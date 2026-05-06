import { useState, useRef } from 'react'
import { resumeAPI } from '../services/api'

export default function ResumeUpload() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const uploadFile = async (file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('resume', file)

    try {
      setUploading(true)
      setMessage('Uploading...')
      const response = await resumeAPI.upload(formData)
      setMessage(`Success! ${file.name} uploaded.`)
      console.log('Upload response:', response.data)
    } catch (error) {
      console.error('Upload error:', error)
      setMessage(error.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    uploadFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative cursor-pointer transition-all duration-300 border-2 border-dashed p-10 rounded-xl text-center
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl">📄</div>
        <div>
          <p className="text-lg font-medium text-gray-700">
            {uploading ? 'Processing...' : 'Drop your resume here or click to upload'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Supports PDF, DOCX, and TXT (Max 5MB)</p>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}