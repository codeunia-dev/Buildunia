import { createClient } from './supabase'
const supabase = createClient();

export interface ImageUploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export const uploadProjectImage = async (
  file: File,
  projectId?: string
): Promise<ImageUploadResult> => {
  try {
    console.log('🔄 Starting image upload process...')
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      const error = 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)'
      console.error('❌ File type validation failed:', file.type)
      return { success: false, error }
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      const error = 'Image file must be smaller than 5MB'
      console.error('❌ File size validation failed:', `${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return { success: false, error }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${projectId || Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `projects/${fileName}`

    console.log('📝 Generated file path:', filePath)

    // Check if supabase is available
    if (!supabase) {
      console.error('❌ Supabase client not available')
      return {
        success: false,
        error: 'Storage service not available. Please check your configuration.'
      }
    }

    console.log('☁️ Uploading to Supabase Storage...')

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Upload error:', error)
      
      // Provide more specific error messages
      let userFriendlyError = error.message
      if (error.message.includes('Bucket not found')) {
        userFriendlyError = 'Storage bucket not found. Please contact administrator to set up image storage.'
      } else if (error.message.includes('Row Level Security')) {
        userFriendlyError = 'You do not have permission to upload images. Please ensure you have admin privileges.'
      } else if (error.message.includes('policies')) {
        userFriendlyError = 'Storage permissions not configured. Please contact administrator.'
      }
      
      return {
        success: false,
        error: userFriendlyError
      }
    }

    console.log('✅ Upload successful:', data)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    console.log('🔗 Generated public URL:', publicUrl)

    return {
      success: true,
      url: publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('💥 Unexpected upload error:', error)
    
    let errorMessage = 'Failed to upload image. Please try again.'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

export const deleteProjectImage = async (imagePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('project-images')
      .remove([imagePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return ''
  
  const { data: { publicUrl } } = supabase.storage
    .from('project-images')
    .getPublicUrl(imagePath)
  
  return publicUrl
}
