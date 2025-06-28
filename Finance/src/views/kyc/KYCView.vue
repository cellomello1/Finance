<template>
  <div>
    <TheNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">KYC Documents</h1>
          <p class="mt-2 text-gray-600">
            Manage your identity verification documents and track their approval status.
          </p>
        </div>
        <router-link
          to="/kyc/upload"
          class="btn-primary"
        >
          Upload Document
        </router-link>
      </div>

      <!-- Documents Grid -->
      <div v-if="kycStore.loading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="kycStore.documents.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No documents</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by uploading your first KYC document.
        </p>
        <div class="mt-6">
          <router-link
            to="/kyc/upload"
            class="btn-primary"
          >
            Upload Document
          </router-link>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
        <!-- Document Card -->
        <div
          v-for="document in kycStore.documents"
          :key="document.id"
          class="card"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <!-- Document Icon -->
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <!-- Document Info -->
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ document.fileName }}</h3>
                <div class="mt-1 space-y-1">
                  <p class="text-sm text-gray-500">
                    Document Type: <span class="font-medium">{{ formatDocumentType(document.documentType) }}</span>
                  </p>
                  <p class="text-sm text-gray-500">
                    Uploaded: <span class="font-medium">{{ formatDate(document.uploadedAt) }}</span>
                  </p>
                  <p class="text-sm text-gray-500">
                    File Size: <span class="font-medium">{{ formatFileSize(document.fileSize) }}</span>
                  </p>
                  <p v-if="document.reviewedAt" class="text-sm text-gray-500">
                    Reviewed: <span class="font-medium">{{ formatDate(document.reviewedAt) }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Status and Actions -->
            <div class="flex flex-col items-end space-y-3">
              <span :class="getStatusBadgeClass(document.status)">
                {{ getStatusText(document.status) }}
              </span>
              
              <div class="flex space-x-2">
                <a
                  :href="document.downloadURL"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View
                </a>
                <a
                  :href="document.downloadURL"
                  :download="document.fileName"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Download
                </a>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div v-if="document.comments && document.comments.length > 0" class="mt-4 pt-4 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Review Comments</h4>
            <div class="space-y-2">
              <div
                v-for="(comment, index) in document.comments"
                :key="index"
                class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3"
              >
                {{ comment }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card text-center">
          <div class="text-2xl font-bold text-warning-600 mb-2">
            {{ kycStore.pendingDocuments.length }}
          </div>
          <div class="text-sm text-gray-600">Pending Review</div>
        </div>
        
        <div class="card text-center">
          <div class="text-2xl font-bold text-success-600 mb-2">
            {{ kycStore.approvedDocuments.length }}
          </div>
          <div class="text-sm text-gray-600">Approved</div>
        </div>
        
        <div class="card text-center">
          <div class="text-2xl font-bold text-danger-600 mb-2">
            {{ kycStore.rejectedDocuments.length }}
          </div>
          <div class="text-sm text-gray-600">Rejected</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useKYCStore } from '@/stores/kyc'
import TheNavbar from '@/components/TheNavbar.vue'

const authStore = useAuthStore()
const kycStore = useKYCStore()

onMounted(async () => {
  await authStore.initAuth()
  if (authStore.user) {
    await kycStore.getUserDocuments(authStore.user.uid)
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDocumentType = (type) => {
  return type.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'pending': return 'px-3 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full'
    case 'approved': return 'px-3 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full'
    case 'rejected': return 'px-3 py-1 text-xs font-medium bg-danger-100 text-danger-800 rounded-full'
    default: return 'px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Pending Review'
    case 'approved': return 'Approved'
    case 'rejected': return 'Rejected'
    default: return 'Unknown'
  }
}
</script> 