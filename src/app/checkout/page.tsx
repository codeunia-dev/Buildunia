'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ShoppingBag, User, Mail, Phone, MessageSquare, CreditCard, Users, MapPin, ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext';
import { formatPrice } from '@/lib/utils';

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

// Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    console.log('🔧 Starting Razorpay script loading...');
    
    // Check if Razorpay is already loaded
    if ((window as any).Razorpay) {
      console.log('✅ Razorpay already loaded on window object');
      resolve(true);
      return;
    }

    console.log('📥 Razorpay not found, loading script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
      console.log('🔍 Window.Razorpay available:', !!(window as any).Razorpay);
      resolve(true);
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Razorpay script:', error);
      resolve(false);
    };
    
    document.head.appendChild(script);
    console.log('📤 Razorpay script element added to DOM');
  });
};

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
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
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
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
      [itemId]: option,
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 'cart') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      if (validateForm()) {
        setCurrentStep('payment');
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('cart');
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
      // Validate cart items before sending
      if (!state.items || state.items.length === 0) {
        throw new Error('No items in cart');
      }

      // Get CSRF token first
      const csrfResponse = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include',
      });

      if (!csrfResponse.ok) {
        throw new Error('Failed to get CSRF token');
      }

      const { token: csrfToken } = await csrfResponse.json();

      // Prepare items with proper validation
      const preparedItems = state.items.map(item => {
        if (!item.project || !item.project.id) {
          throw new Error('Invalid item structure');
        }
        
        return {
          ...item,
          selectedOption: itemOptions[item.project.id] || 'full',
          price: calculateItemPrice({ project: item.project as any, quantity: item.quantity })
        };
      });

      // Create order and get Razorpay order details
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          items: preparedItems,
          total: total,
          customerInfo: formData,
          isMentorship: hasMentorship,
          selectedMentor: formData.mentor
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create order');
      }

      const responseData = await response.json();
      const { order } = responseData;
      
      if (!order) {
        throw new Error('Invalid response from server');
      }

      const { id: orderId, razorpay_order_id: razorpayOrderId, key, amount, currency } = order;

      // Debug: Check if key is received
      console.log('Received order data:', { orderId, razorpayOrderId, key, amount, currency });
      console.log('Key type:', typeof key);
      console.log('Key length:', key ? key.length : 'undefined');
      
      if (!key) {
        throw new Error('Razorpay key not received from server');
      }

      // Load Razorpay script
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay');
      }

      // Initialize Razorpay payment
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'BuildUnia',
        description: hasMentorship ? 'Mentorship Session' : 'IoT Project Kit',
        order_id: razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
          order_id: orderId,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            console.log('❌ Razorpay modal was dismissed by user');
            setIsProcessing(false);
            alert('Payment cancelled. Please try again to complete your purchase.');
          },
          confirm_close: true,
          escape: false,
          handleback: true,
        },
        handler: async function (response: any) {
          try {
            console.log('🔄 Razorpay payment response received:', response);
            
            // Check if payment was cancelled or failed
            if (!response || !response.razorpay_payment_id) {
              console.error('❌ Payment was cancelled or failed - no payment ID received');
              alert('Payment was not completed. Please try again.');
              setIsProcessing(false);
              return;
            }
            
            // Verify that we have a valid payment response
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              console.error('❌ Invalid payment response - missing required fields:', {
                has_payment_id: !!response.razorpay_payment_id,
                has_order_id: !!response.razorpay_order_id,
                has_signature: !!response.razorpay_signature
              });
              throw new Error('Invalid payment response received');
            }
            
            console.log('✅ Valid payment response received, proceeding to verification...');
            
            // Verify payment
            console.log('🔄 Calling payment verification API...');
            const verifyResponse = await fetch('/api/orders/verify-payment', {
              method: 'POST',
              credentials: 'include', // Include cookies for authentication
              headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken,
              },
              body: JSON.stringify({
                orderId: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            console.log('📡 Payment verification response status:', verifyResponse.status);

            if (verifyResponse.ok) {
              const result = await verifyResponse.json();
              console.log('✅ Payment verification successful:', result);
              
              // Only clear cart and redirect if payment was actually completed
              if (result.success && result.payment_status === 'completed') {
                console.log('🎉 Payment completed successfully! Clearing cart and redirecting...');
              // Clear cart after successful payment
              clearCart();
              // Redirect to success page
              router.push(`/success?orderId=${orderId}`);
              } else {
                console.error('❌ Payment verification returned invalid status:', result);
                throw new Error('Payment was not completed successfully');
              }
            } else {
              const errorData = await verifyResponse.json();
              console.error('❌ Payment verification failed:', errorData);
              throw new Error(errorData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('❌ Payment processing error:', error);
            alert(`Payment failed: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
            setIsProcessing(false);
          }
        },
      };

      console.log('🎯 Razorpay options:', options);
      console.log('🚀 Attempting to open Razorpay modal...');
      
      // Check if Razorpay is available
      if (!(window as any).Razorpay) {
        console.error('❌ Razorpay is not available on window object');
        throw new Error('Razorpay is not available. Please refresh the page and try again.');
      }
      
      console.log('✅ Razorpay object is available:', typeof (window as any).Razorpay);
      console.log('🔧 Razorpay constructor:', (window as any).Razorpay);
      
      // Test if we can create a Razorpay instance
      try {
        const testOptions = {
          key: key,
          amount: 100,
          currency: 'INR',
          name: 'Test',
          description: 'Test payment',
          order_id: 'test_order',
        };
        console.log('🧪 Testing Razorpay with options:', testOptions);

      const rzp = new (window as any).Razorpay(options);
        console.log('✅ Razorpay instance created successfully:', rzp);
        
        console.log('🚀 Opening Razorpay modal...');
      rzp.open();
        console.log('✅ Razorpay modal opened successfully');
        
        // Add a timeout to check if modal actually opened
        setTimeout(() => {
          // Check if modal is visible or if there are any errors
          const modalElement = document.querySelector('.razorpay-container');
          if (!modalElement) {
            console.warn('⚠️ Razorpay modal element not found in DOM');
          } else {
            console.log('✅ Razorpay modal element found in DOM');
          }
        }, 1000);
        
      } catch (modalError) {
        console.error('❌ Failed to open Razorpay modal:', modalError);
        console.error('🔍 Error details:', {
          message: modalError instanceof Error ? modalError.message : 'Unknown error',
          stack: modalError instanceof Error ? modalError.stack : undefined,
          name: modalError instanceof Error ? modalError.name : 'Unknown'
        });
        throw new Error('Failed to open payment modal. Please try again.');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
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
                <CardContent className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">
                          {item.project.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {item.project.category} • {item.project.difficulty}
                        </p>
                        <p className="text-blue-400 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {formatPrice(calculateItemPrice(item) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>Shipping</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>Tax (8%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Information */}
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                          errors.name ? 'border-red-500' : 'border-gray-600'
                        } focus:outline-none focus:border-blue-500`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                          errors.phone ? 'border-red-500' : 'border-gray-600'
                        } focus:outline-none focus:border-blue-500`}
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                      placeholder="your@email.com"
                      readOnly
                    />
                    <p className="text-gray-400 text-sm mt-1">Using your account email</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                        errors.address ? 'border-red-500' : 'border-gray-600'
                      } focus:outline-none focus:border-blue-500`}
                      placeholder="Enter your complete address"
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                          errors.city ? 'border-red-500' : 'border-gray-600'
                        } focus:outline-none focus:border-blue-500`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                          errors.state ? 'border-red-500' : 'border-gray-600'
                        } focus:outline-none focus:border-blue-500`}
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                          errors.pincode ? 'border-red-500' : 'border-gray-600'
                        } focus:outline-none focus:border-blue-500`}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>

                  {/* Mentor Selection for Mentorship Items */}
                  {hasMentorship && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Mentor *
                      </label>
                      <select
                        name="mentor"
                        value={formData.mentor}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white ${
                          errors.mentor ? 'border-red-500' : 'border-gray-600'
                        } focus:outline-none focus:border-blue-500`}
                      >
                        <option value="">Choose a mentor</option>
                        {mentors.map((mentor) => (
                          <option key={mentor.id} value={mentor.id}>
                            {mentor.name} - {mentor.title}
                          </option>
                        ))}
                      </select>
                      {errors.mentor && (
                        <p className="text-red-400 text-sm mt-1">{errors.mentor}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                      placeholder="Any special instructions or requirements..."
                    />
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
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="mb-6">
                      <Lock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium mb-2">
                        Secure Payment via Razorpay
                      </h3>
                      <p className="text-gray-400">
                        Your payment will be processed securely through Razorpay.
                        We accept all major credit cards, UPI, net banking, and digital wallets.
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg mb-6">
                      <div className="flex justify-between text-gray-300 mb-2">
                        <span>Total Amount:</span>
                        <span className="text-white font-bold text-lg">
                          {formatPrice(total)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Click "Pay Now" to proceed to secure payment
                      </p>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Pay Now - {formatPrice(total)}
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep !== 'cart' && (
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  className="text-white border-gray-600 hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              {currentStep !== 'payment' && (
                <Button
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">
                        {item.project.title}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {item.project.category} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-white font-medium">
                      {formatPrice(calculateItemPrice(item) * item.quantity)}
                    </p>
                  </div>
                ))}
                
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (8%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Secure Payment</h4>
                    <p className="text-gray-400 text-sm">
                      Your payment information is encrypted and secure. We use Razorpay, 
                      a trusted payment gateway, to process all transactions.
                    </p>
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