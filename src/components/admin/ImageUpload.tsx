'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react'
import { uploadProjectImage, ImageUploadResult } from '@/lib/imageUpload'
import Image from 'next/image';

interface ImageUploadProps {
  onImageUploaded: (result: ImageUploadResult) => void
  currentImageUrl?: string
  projectId?: string
  disabled?: boolean
}

export default function ImageUpload({
  onImageUploaded,
  currentImageUrl,
  projectId,
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file || disabled) return

    setUploadError(null)
    setDebugInfo(`Starting upload for file: ${file.name} (${file.size} bytes, ${file.type})`)

    // Validate file before creating preview
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      const error = `Invalid file type: ${file.type}. Please use JPEG, PNG, WebP, or GIF.`
      setUploadError(error)
      setDebugInfo(prev => prev + '\n' + error)
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      const error = `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.`
      setUploadError(error)
      setDebugInfo(prev => prev + '\n' + error)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      setDebugInfo(prev => prev + '\nPreview created successfully')
    }
    reader.onerror = () => {
      setUploadError('Failed to read file')
      setDebugInfo(prev => prev + '\nError creating preview')
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploading(true)
    setDebugInfo(prev => prev + '\nStarting upload to Supabase...')
    
    try {
      const result = await uploadProjectImage(file, projectId)
      setDebugInfo(prev => prev + '\nUpload result: ' + JSON.stringify(result, null, 2))
      
      onImageUploaded(result)
      
      if (!result.success) {
        setUploadError(result.error || 'Upload failed')
        // Reset preview on error
        setPreview(currentImageUrl || null)
      } else {
        setUploadError(null)
        setDebugInfo(prev => prev + '\nUpload successful!')
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
      setUploadError(errorMsg)
      setDebugInfo(prev => prev + '\nCatch block error: ' + errorMsg)
      setPreview(currentImageUrl || null)
      onImageUploaded({
        success: false,
        error: errorMsg
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = () => {
    setPreview(null)
    setUploadError(null)
    setDebugInfo(null)
    onImageUploaded({
      success: true,
      url: '',
      path: ''
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">Project Image</Label>
      
      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Error display */}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-600 font-medium">Upload Error</p>
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Debug info (only show in development) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <details className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <summary>Debug Info (Development Only)</summary>
          <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
        </details>
      )}

      {/* Image preview */}
      {preview ? (
        <div className="relative">
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Project preview"
              className="w-full h-48 object-cover"
              width={800}
              height={384}
              onError={() => {
                setUploadError('Failed to display image');
                setPreview(null);
              }}
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        /* Upload area */
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
            ${uploadError ? 'border-red-300 bg-red-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600">Uploading image...</p>
              <p className="text-xs text-gray-500">This may take a moment</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${uploadError ? 'bg-red-100' : 'bg-gray-100'}`}>
                <ImageIcon className={`w-6 h-6 ${uploadError ? 'text-red-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP or GIF (max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      {!preview && !isUploading && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Image
        </Button>
      )}

      {/* Help text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Upload a high-quality image that represents your IoT project.</p>
        <p>Recommended size: 800x600px or larger.</p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-blue-600">💡 Check browser console for detailed error messages</p>
        )}
      </div>
    </div>
  )
}
