import DOMPurify from 'dompurify'

// Configure DOMPurify for server-side use
const purify = DOMPurify.sanitize

export interface SanitizeOptions {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  allowedSchemes?: string[]
  stripIgnoreTag?: boolean
  stripIgnoreTagBody?: string[]
}

const defaultOptions: SanitizeOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  allowedAttributes: {
    'a': ['href', 'target', 'rel'],
    'img': ['src', 'alt', 'title'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed']
}

export function sanitizeHTML(html: string, options: SanitizeOptions = {}): string {
  const config = { ...defaultOptions, ...options }
  
  return purify(html, {
    ALLOWED_TAGS: config.allowedTags,
    ALLOWED_ATTR: config.allowedAttributes as any,
    ALLOWED_URI_REGEXP: new RegExp(`^(${config.allowedSchemes?.join('|')}):`, 'i'),
    KEEP_CONTENT: !config.stripIgnoreTag,
    FORBID_TAGS: config.stripIgnoreTagBody
  })
}

export function sanitizeText(text: string): string {
  // Remove HTML tags and entities
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, '') // Remove HTML entities
    .replace(/[<>]/g, '') // Remove remaining < and >
    .trim()
}

export function sanitizeEmail(email: string): string {
  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const sanitized = email.toLowerCase().trim()
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format')
  }
  
  return sanitized
}

export function sanitizePhone(phone: string): string {
  // Remove all non-digit characters except + for international numbers
  const sanitized = phone.replace(/[^\d+]/g, '')
  
  // Basic validation for Indian numbers
  if (sanitized.startsWith('+91') && sanitized.length !== 13) {
    throw new Error('Invalid Indian phone number format')
  }
  
  if (sanitized.startsWith('91') && sanitized.length !== 12) {
    throw new Error('Invalid Indian phone number format')
  }
  
  if (sanitized.length === 10 && /^[6-9]\d{9}$/.test(sanitized)) {
    return sanitized
  }
  
  return sanitized
}

export function sanitizePincode(pincode: string): string {
  // Remove all non-digit characters
  const sanitized = pincode.replace(/\D/g, '')
  
  // Validate Indian pincode format (6 digits, first digit 1-9)
  if (!/^[1-9]\d{5}$/.test(sanitized)) {
    throw new Error('Invalid pincode format')
  }
  
  return sanitized
}

export function sanitizePrice(price: string | number): number {
  const num = typeof price === 'string' ? parseFloat(price) : price
  
  if (isNaN(num) || num < 0) {
    throw new Error('Invalid price value')
  }
  
  // Round to 2 decimal places
  return Math.round(num * 100) / 100
}

export function sanitizeFileName(filename: string): string {
  // Remove or replace dangerous characters
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace dangerous characters with underscore
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 255) // Limit length
}

export function validateFileUpload(file: File): void {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif'
  ]
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds 5MB limit`)
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`)
  }
  
  // Additional validation for image files
  if (file.type.startsWith('image/')) {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const fileName = file.name.toLowerCase()
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
    
    if (!hasValidExtension) {
      throw new Error('Invalid file extension')
    }
  }
}

// Sanitize form data
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized: any = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value)
    } else if (typeof value === 'number') {
      sanitized[key] = value
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeText(item) : item
      )
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
} 