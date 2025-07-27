import Razorpay from 'razorpay';

// Lazy initialization of Razorpay client
let razorpayInstance: Razorpay | null = null;

// Supported currencies with their decimal places
export const SUPPORTED_CURRENCIES = {
  // Zero decimal currencies
  'JPY': 0,
  // Two decimal currencies (standard)
  'INR': 2,
  'USD': 2,
  'EUR': 2,
  'GBP': 2,
  'AUD': 2,
  'CAD': 2,
  'SGD': 2,
  'MYR': 2,
  // Three decimal currencies
  'KWD': 3,
  'BHD': 3,
  'OMR': 3,
} as const;

export type SupportedCurrency = keyof typeof SUPPORTED_CURRENCIES;

// Get decimal places for a currency
export function getCurrencyDecimals(currency: string): number {
  return SUPPORTED_CURRENCIES[currency as SupportedCurrency] ?? 2;
}

// Convert amount to Razorpay format based on currency decimals
export function convertAmountToRazorpayFormat(amount: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  
  // For zero decimal currencies (like JPY), don't multiply
  if (decimals === 0) {
    return Math.round(amount);
  }
  
  // For two decimal currencies (like INR, USD), multiply by 100
  if (decimals === 2) {
    return Math.round(amount * 100);
  }
  
  // For three decimal currencies (like KWD, BHD, OMR), multiply by 1000
  if (decimals === 3) {
    return Math.round(amount * 1000);
  }
  
  // Default to two decimal places
  return Math.round(amount * 100);
}

export function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID) {
      throw new Error('RAZORPAY_KEY_ID environment variable is required');
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_SECRET environment variable is required');
    }
    
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  currency: 'INR' as SupportedCurrency,
  payment_method_types: ['card', 'netbanking', 'upi', 'wallet'],
  billing_address_collection: 'required' as const,
  shipping_address_collection: {
    allowed_countries: ['IN'],
  },
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id={order_id}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
};

// Create Razorpay order with enhanced error handling and currency support
export const createRazorpayOrder = async (
  amount: number, 
  currency: SupportedCurrency = 'INR', 
  receipt: string
) => {
  try {
    // Validate inputs
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    if (!SUPPORTED_CURRENCIES[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
    
    // Ensure receipt is under 40 characters as required by Razorpay
    const shortReceipt = receipt.length > 40 ? receipt.substring(0, 40) : receipt;
    
    // Convert amount to Razorpay format based on currency
    const razorpayAmount = convertAmountToRazorpayFormat(amount, currency);
    
    const options = {
      amount: razorpayAmount,
      currency,
      receipt: shortReceipt,
      payment_capture: 1, // Auto capture payment
      notes: {
        source: 'buildunia',
        currency_type: `${currency}_${getCurrencyDecimals(currency)}_decimals`,
      },
    };

    console.log('Creating Razorpay order with:', { 
      original_amount: amount, 
      currency, 
      razorpay_amount: razorpayAmount,
      receipt: shortReceipt,
      decimals: getCurrencyDecimals(currency)
    });
    
    // Log environment variable status (without exposing secrets)
    console.log('Environment variables:', { 
      key_id: process.env.RAZORPAY_KEY_ID ? 'SET' : 'NOT SET',
      key_secret: process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT SET'
    });
    
    console.log('Razorpay options:', options);

    const order = await getRazorpayClient().orders.create(options);
    console.log('Razorpay order created:', order);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    // Enhanced error handling
    if (error instanceof Error) {
      if (error.message.includes('key_id')) {
        throw new Error('Invalid Razorpay configuration: Key ID is missing or invalid');
      }
      if (error.message.includes('key_secret')) {
        throw new Error('Invalid Razorpay configuration: Key Secret is missing or invalid');
      }
      if (error.message.includes('amount')) {
        throw new Error('Invalid amount provided for Razorpay order');
      }
      if (error.message.includes('currency')) {
        throw new Error('Invalid or unsupported currency provided');
      }
    }
    
    throw new Error('Failed to create Razorpay order. Please try again.');
  }
};

// Verify Razorpay payment signature with enhanced security
export const verifyPaymentSignature = (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): boolean => {
  try {
    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing required parameters for signature verification');
      return false;
    }
    
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET not configured');
      return false;
    }
    
    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;
    
    console.log('Payment signature verification:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature_provided: razorpay_signature.substring(0, 10) + '...',
      signature_expected: expectedSignature.substring(0, 10) + '...',
      is_valid: isValid
    });
    
    return isValid;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
}; 