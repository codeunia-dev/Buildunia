import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { uploadRateLimit } from '@/lib/rateLimit'
import { csrfMiddleware } from '@/lib/csrf'
import { validateFileUpload, sanitizeFileName } from '@/lib/sanitize'

// Create admin client with service role
const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = uploadRateLimit(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Apply CSRF protection
    const csrfResult = await csrfMiddleware(request);
    if (csrfResult) {
      return csrfResult;
    }

    console.log('🔄 API: Starting image upload...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string

    console.log('📁 API: File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      projectId
    })

    if (!file) {
      console.error('❌ API: No file provided')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Enhanced file validation using sanitization utility
    try {
      validateFileUpload(file);
    } catch (validationError) {
      return NextResponse.json(
        { success: false, error: validationError instanceof Error ? validationError.message : 'Invalid file' },
        { status: 400 }
      )
    }

    // Generate unique filename with sanitization
    const fileExt = file.name.split('.').pop()
    const sanitizedFileName = sanitizeFileName(file.name)
    const fileName = `${projectId || Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `projects/${fileName}`

    // Use admin client for uploads to bypass RLS
    const supabase = createAdminClient()

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('buildunia.project.pic')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('buildunia.project.pic')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath
    })

  } catch (error) {
    console.error('Unexpected upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload image. Please try again.' },
      { status: 500 }
    )
  }
}
