import { createClient } from './supabase'

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

    // Create FormData for the API request
    const formData = new FormData()
    formData.append('file', file)
    if (projectId) {
      formData.append('projectId', projectId)
    }

    console.log('☁️ Uploading to server API...')

    // Upload via our secure API route
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      console.error('❌ Upload error:', result.error)
      return {
        success: false,
        error: result.error || 'Failed to upload image'
      }
    }

    console.log('✅ Upload successful:', result)
    console.log('🔗 Generated public URL:', result.url)

    return {
      success: true,
      url: result.url,
      path: result.path
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
    const supabase = createClient();
    const { error } = await supabase.storage
      .from('buildunia.project.pic')
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
  
  const supabase = createClient();
  const { data: { publicUrl } } = supabase.storage
    .from('buildunia.project.pic')
    .getPublicUrl(imagePath)
  
  return publicUrl
}
