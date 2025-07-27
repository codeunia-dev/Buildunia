import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Debug logging utility - only logs in development
export const debugLog = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args)
    }
  },
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  warn: (...args: any[]) => {
    // Always log warnings, even in production
    console.warn(...args)
  }
}

// Production-safe logging
export const safeLog = {
  log: (...args: any[]) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(...args)
    }
  },
  error: (...args: any[]) => {
    // Always log errors
    console.error(...args)
  },
  warn: (...args: any[]) => {
    // Always log warnings
    console.warn(...args)
  },
  info: (...args: any[]) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.info(...args)
    }
  }
}

// Format price for display (moved from razorpay.ts to avoid client-side initialization)
export const formatPrice = (price: number) => {
  if (!price || isNaN(price)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
