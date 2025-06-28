<template>
  <div>
    <TheNavbar />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Upload KYC Documents</h1>
        <p class="mt-2 text-gray-600">
          Upload your identity verification documents for review. Accepted formats: PDF, JPG, PNG (Max 10MB per file)
        </p>
      </div>

      <!-- Upload Form -->
      <div class="card">
        <form @submit.prevent="handleUpload">
          <!-- Document Type Selection -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Document Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="selectedDocumentType"
              required
              class="input-field"
            >
              <option value="">Select document type</option>
              <option value="passport">Passport</option>
              <option value="nationalId">National ID Card</option>
              <option value="driversLicense">Driver's License</option>
              <option value="businessLicense">Business License</option>
              <option value="incorporationCertificate">Certificate of Incorporation</option>
              <option value="bankStatement">Bank Statement</option>
              <option value="addressProof">Proof of Address</option>
              <option value="taxCertificate">Tax Certificate</option>
              <option value="auditedFinancials">Audited Financial Statements</option>
              <option value="boardResolution">Board Resolution</option>
            </select>
          </div>

          <!-- File Upload Area -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Document File <span class="text-red-500">*</span>
            </label>
            
            <!-- Drag and Drop Area -->
            <div
              ref="dropZone"
              :class="[
                'relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200',
                isDragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
              ]"
              @drop="handleDrop"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @click="fileInput?.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileSelect"
                class="hidden"
              />
              
              <div class="text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="mt-4">
                  <p class="text-sm text-gray-600">
                    <span class="font-medium text-primary-600 hover:text-primary-500 cursor-pointer">
                      Click to upload
                    </span>
                    or drag and drop
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <!-- Selected File Display -->
            <div v-if="selectedFile" class="mt-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p class="font-medium text-gray-900">{{ selectedFile.name }}</p>
                    <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeFile"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="mb-6 bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div class="flex justify-between">
            <router-link
              to="/kyc"
              class="btn-secondary"
            >
              Cancel
            </router-link>
            
            <button
              type="submit"
              :disabled="!selectedFile || !selectedDocumentType || kycStore.uploading"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="kycStore.uploading" class="mr-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ kycStore.uploading ? 'Uploading...' : 'Upload Document' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Guidelines Card -->
      <div class="card mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Document Guidelines</h3>
        <div class="space-y-3 text-sm text-gray-600">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p>Ensure documents are clear, legible, and in good condition</p>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p>Upload original documents or certified copies</p>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p>File formats: PDF (preferred), PNG, JPG</p>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p>Maximum file size: 10MB per document</p>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p>Documents must be valid and not expired</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useKYCStore } from '@/stores/kyc'
import TheNavbar from '@/components/TheNavbar.vue'

const router = useRouter()
const authStore = useAuthStore()
const kycStore = useKYCStore()

const selectedFile = ref(null)
const selectedDocumentType = ref('')
const isDragOver = ref(false)
const error = ref('')
const fileInput = ref(null)
const dropZone = ref(null)

onMounted(async () => {
  await authStore.initAuth()
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    validateAndSetFile(files[0])
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragOver.value = false
}

const validateAndSetFile = (file) => {
  error.value = ''
  
  // Check file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Please select a valid file type (PDF, JPG, PNG)'
    return
  }
  
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    error.value = 'File size must be less than 10MB'
    return
  }
  
  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleUpload = async () => {
  if (!selectedFile.value || !selectedDocumentType.value) {
    error.value = 'Please select both a document type and file'
    return
  }
  
  error.value = ''
  
  const result = await kycStore.uploadDocument(
    selectedFile.value,
    selectedDocumentType.value,
    authStore.user.uid
  )
  
  if (result.success) {
    router.push('/kyc')
  } else {
    error.value = result.error || 'Failed to upload document'
  }
}
</script> 