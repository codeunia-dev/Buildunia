'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ShoppingBag, User, Mail, Phone, MessageSquare, CreditCard, Users, MapPin, ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext';
import { formatPrice } from '@/lib/stripe';
import { loadStripe } from '@stripe/stripe-js';

// Mentor data
const mentors = [
  {
    id: 'deepak',
    name: 'Deepak Pandey',
    title: 'Founder, Codeunia | IoT & Embedded Systems Mentor',
    rating: 4.9,
    avatar: 'DP'
  },
  {
    id: 'aayush',
    name: 'Aayush Bhardwaj',
    title: 'Core Team Member, Codeunia | IoT & Java Backend Mentor',
    rating: 4.8,
    avatar: 'AB'
  },
  {
    id: 'akshay',
    name: 'Akshay Kumar',
    title: 'Full Stack Developer | Web Dev Lead at Codeunia | AI & Web Development Mentor',
    rating: 4.9,
    avatar: 'AK'
  }
];

type CheckoutStep = 'cart' | 'shipping' | 'payment';

// Pincode validation function
const validatePincode = (pincode: string): boolean => {
  // Indian pincode validation (6 digits)
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export default function CheckoutPage() {
  const { state } = useCart();
  const { user } = useBuilduniaAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Track options for each cart item
  const [itemOptions, setItemOptions] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Customer info
    name: '',
    email: user?.email || '', // Use logged-in user's email
    phone: '',
    
    // Shipping address
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    
    // Order details
    mentor: '',
    notes: '',
  });

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user?.email]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isProcessing) {
      router.push('/auth/signin');
    }
  }, [user, router, isProcessing]);

  // Get cart items
  const cartItems = state.items.map(item => ({
    ...item,
    project: item.project as (typeof item.project) & { prices?: { [key: string]: number } }
  }));

  // Check cart limits
  const cartValidation = () => {
    const errors: string[] = [];
    
    // Check total items limit (max 5)
    if (cartItems.length > 5) {
      errors.push('Maximum 5 items allowed in cart');
    }
    
    // Check same type limit (max 2 of same type)
    const itemCounts: Record<string, number> = {};
    cartItems.forEach(item => {
      const itemType = item.project.category || 'unknown';
      itemCounts[itemType] = (itemCounts[itemType] || 0) + 1;
    });
    
    Object.entries(itemCounts).forEach(([type, count]) => {
      if (count > 2) {
        errors.push(`Maximum 2 items of type "${type}" allowed`);
      }
    });
    
    return errors;
  };

  const cartErrors = cartValidation();

  // Check if any item is mentorship
  const hasMentorship = cartItems.some(item => 
    item.project?.category === 'Mentorship' || item.project?.title?.includes('Mentorship')
  );

  // Calculate pricing for each item based on selected options
  const calculateItemPrice = (item: typeof cartItems[0]) => {
    const basePrice = item.project?.price || 0;
    const selectedOption = itemOptions[item.project.id] || 'full';
    
    if (item.project?.prices && selectedOption !== 'full') {
      return item.project.prices[selectedOption] || basePrice;
    }
    
    return basePrice;
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const shipping = hasMentorship ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    
    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    // Validate state
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    // Validate pincode
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian pincode';
    }
    
    // Validate mentor selection for mentorship items
    if (hasMentorship && !formData.mentor) {
      newErrors.mentor = 'Please select a mentor for mentorship items';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemOptionChange = (itemId: string, option: string) => {
    setItemOptions(prev => ({
      ...prev,
      [itemId]: option
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 'cart') {
      // Validate cart before proceeding
      if (cartErrors.length > 0) {
        alert(`Please fix cart issues:\n${cartErrors.join('\n')}`);
        return;
      }
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      // Validate form before proceeding
      if (!validateForm()) {
        return;
      }
      setCurrentStep('payment');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('cart');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            ...item,
            selectedOption: itemOptions[item.project.id] || 'full',
            price: calculateItemPrice({ project: item.project as any, quantity: item.quantity })
          })),
          total: total,
          customerInfo: formData,
          isMentorship: hasMentorship,
          selectedMentor: formData.mentor
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });
        
        if (error) {
          console.error('Stripe error:', error);
          alert('Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-400 mb-8">Add some projects to your cart before checking out.</p>
          <Button onClick={() => router.push('/projects')}>Browse Projects</Button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'cart', name: 'Cart Review', icon: ShoppingBag },
    { id: 'shipping', name: 'Shipping', icon: MapPin },
    { id: 'payment', name: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        
        {/* Cart Validation Errors */}
        {cartErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Cart Validation Errors:</span>
            </div>
            <ul className="text-red-300 text-sm space-y-1">
              {cartErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isActive 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-gray-800 border-gray-600 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Step 1: Cart Review */}
            {currentStep === 'cart' && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const isMentorship = item.project?.category === 'Mentorship' || item.project?.title?.includes('Mentorship');
                      const itemPrice = calculateItemPrice(item);
                      
                      return (
                        <div key={item.project.id} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {(item.project as { title?: string; name?: string }).title?.charAt(0) || (item.project as { title?: string; name?: string }).name?.charAt(0) || 'P'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">
                                {(item.project as { title?: string; name?: string }).title || (item.project as { title?: string; name?: string }).name}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {item.project.category} • {item.project.difficulty || 'all-levels'}
                              </p>
                            </div>
                            <div className="text-white font-medium">
                              ₹{itemPrice.toFixed(0)}
                            </div>
                          </div>
                          
                          {/* Options for each item */}
                          {!isMentorship && (
          <div>
                              <label className="block text-gray-200 mb-2 font-medium">What do you want for this item?</label>
                              <select
                                value={itemOptions[item.project.id] || 'full'}
                                onChange={(e) => handleItemOptionChange(item.project.id, e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="full">Complete Project Kit</option>
                                <option value="hardware">Hardware Only</option>
                                <option value="code">Code Only</option>
                                <option value="mentorship">Mentorship Only</option>
                                <option value="hardware_mentorship">Hardware + Mentorship</option>
                                <option value="code_mentorship">Code + Mentorship</option>
                              </select>
                            </div>
                          )}

                          {isMentorship && (
              <div>
                              <label className="block text-gray-200 mb-2 font-medium flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Choose Your Mentor
                              </label>
                <select
                                value={formData.mentor}
                                onChange={handleInputChange}
                                name="mentor"
                  required
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select a mentor</option>
                                {mentors.map((mentor) => (
                                  <option key={mentor.id} value={mentor.name}>
                                    {mentor.name} - {mentor.title} (⭐ {mentor.rating})
                                  </option>
                                ))}
                </select>
              </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button 
                    onClick={handleNextStep}
                    disabled={cartErrors.length > 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Shipping
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Address */}
            {currentStep === 'shipping' && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
              <div>
                      <label htmlFor="name" className="block text-gray-200 mb-2 font-medium">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                  required
                        className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:ring-1 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="Enter your full name"
                />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                      )}
              </div>
              <div>
                      <label htmlFor="email" className="block text-gray-200 mb-2 font-medium">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                        value={formData.email}
                        disabled
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-400 cursor-not-allowed"
                        placeholder={user?.email || 'Loading...'}
                      />
                      <p className="text-gray-500 text-xs mt-1">Email is fixed for security</p>
                    </div>
              </div>
                  
              <div>
                    <label htmlFor="phone" className="block text-gray-200 mb-2 font-medium">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:ring-1 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                      }`}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-gray-200 mb-2 font-medium">Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:ring-1 focus:ring-blue-500 resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                      }`}
                      placeholder="Enter your complete address"
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-gray-200 mb-2 font-medium">City *</label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:ring-1 focus:ring-blue-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-gray-200 mb-2 font-medium">State *</label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:ring-1 focus:ring-blue-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                      )}
              </div>
              <div>
                      <label htmlFor="pincode" className="block text-gray-200 mb-2 font-medium">Pincode *</label>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        maxLength={6}
                        className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:ring-1 focus:ring-blue-500 ${
                          errors.pincode ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && (
                        <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={handlePrevStep}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Continue to Payment
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="notes" className="block text-gray-200 mb-2 font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Additional Notes (Optional)
                    </label>
                <textarea
                  id="notes"
                  name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                  rows={3}
                      placeholder="Any special requirements or questions..."
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={handlePrevStep}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Pay ₹{total.toFixed(0)}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const itemPrice = calculateItemPrice(item);
                    const selectedOption = itemOptions[item.project.id] || 'full';
                    
                    return (
                    <div key={item.project.id} className="flex items-center space-x-3 py-3 border-b border-gray-700 last:border-b-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {(item.project as { title?: string; name?: string }).title?.charAt(0) || (item.project as { title?: string; name?: string }).name?.charAt(0) || 'P'}
                          </span>
                        </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                            {(item.project as { title?: string; name?: string }).title || (item.project as { title?: string; name?: string }).name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {item.project.category} • {item.project.difficulty || 'all-levels'}
                          </p>
                          {selectedOption !== 'full' && (
                            <p className="text-blue-400 text-xs capitalize">
                              {selectedOption.replace('_', ' + ')} option
                            </p>
                          )}
                      </div>
                      <div className="text-white font-medium">
                          ₹{itemPrice.toFixed(0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Order Totals */}
                <div className="space-y-2 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  {!hasMentorship && (
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                      <span>₹{shipping.toFixed(0)}</span>
                  </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                </div>
                
                {/* Security Badge */}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center text-green-400 text-sm mb-1">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    Your payment is processed securely by Stripe
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}