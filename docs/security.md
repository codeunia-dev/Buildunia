# 🔒 BuildUnia Security Documentation

## Overview
This document outlines the security measures implemented in the BuildUnia application to protect against common web vulnerabilities and ensure data integrity.

## 🛡️ Security Features Implemented

### 1. Security Headers
- **X-Frame-Options**: `DENY` - Prevents clickjacking attacks
- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **Referrer-Policy**: `origin-when-cross-origin` - Controls referrer information
- **X-XSS-Protection**: `1; mode=block` - Enables XSS filtering
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains` - Enforces HTTPS
- **Content-Security-Policy**: Comprehensive policy to prevent XSS and injection attacks

### 2. Rate Limiting
- **Authentication**: 5 requests per 15 minutes
- **API**: 100 requests per minute
- **Payment**: 10 requests per minute
- **Upload**: 5 requests per minute

### 3. CSRF Protection
- Token-based protection for all POST/PUT/DELETE requests
- 24-hour token expiry
- Automatic token generation and validation

### 4. Input Sanitization
- HTML sanitization using DOMPurify
- Text sanitization to remove HTML tags and entities
- Email validation and sanitization
- Phone number validation (Indian format)
- Pincode validation (6-digit format)
- File upload validation (type, size, extension)

### 5. Authentication & Authorization
- Supabase authentication with session management
- Role-based access control (admin/user)
- Middleware protection for admin routes
- User ownership validation for orders

### 6. Payment Security
- Razorpay integration with signature verification
- Server-side payment validation
- Secure order creation and management

## 🔧 Configuration

### Environment Variables
```bash
# Required for CSRF protection
CSRF_SECRET=your-32-byte-secret-key

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payment configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Security Headers Configuration
Located in `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'Content-Security-Policy', value: '...' }
      ]
    }
  ]
}
```

## 🚨 Security Best Practices

### For Developers
1. **Always sanitize user input** before processing
2. **Validate file uploads** for type, size, and content
3. **Use HTTPS** in production
4. **Implement proper error handling** without exposing sensitive information
5. **Keep dependencies updated** regularly
6. **Use environment variables** for sensitive configuration

### For Deployment
1. **Enable HTTPS** with valid SSL certificates
2. **Set up monitoring** for security events
3. **Regular security audits** of the application
4. **Backup strategy** for data protection
5. **Access logging** for security monitoring

## 🔍 Security Testing

### Automated Tests
```bash
# Run security audit
npm audit

# Run linting
npm run lint

# Build test
npm run build
```

### Manual Testing Checklist
- [ ] Test rate limiting on API endpoints
- [ ] Verify CSRF protection on forms
- [ ] Test file upload restrictions
- [ ] Verify authentication on protected routes
- [ ] Test payment signature verification
- [ ] Check security headers are present

## 🚨 Incident Response

### Security Breach Response
1. **Immediate Actions**
   - Isolate affected systems
   - Preserve evidence
   - Notify stakeholders

2. **Investigation**
   - Analyze logs and monitoring data
   - Identify root cause
   - Assess impact

3. **Remediation**
   - Apply security patches
   - Update affected systems
   - Implement additional security measures

4. **Post-Incident**
   - Document lessons learned
   - Update security procedures
   - Conduct security review

## 📞 Security Contacts

For security issues or questions:
- **Email**: buildunia.codeunia@gmail.com
- **Phone**: +91 8699025107

## 📋 Security Checklist

### Pre-Deployment
- [ ] All security headers configured
- [ ] Rate limiting implemented
- [ ] CSRF protection enabled
- [ ] Input sanitization active
- [ ] Environment variables secured
- [ ] Dependencies updated
- [ ] Security audit passed

### Post-Deployment
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Access logs enabled
- [ ] Security testing completed

---

**Last Updated**: July 27, 2025
**Version**: 1.0.0 