<template>
  <div>
    <TheNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">KYC Document Review</h1>
        <p class="mt-2 text-gray-600">
          Review and approve or reject KYC documents submitted by users.
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card text-center">
          <div class="text-3xl font-bold text-warning-600 mb-2">
            {{ kycStore.pendingDocuments.length }}
          </div>
          <div class="text-sm text-gray-600">Pending Review</div>
        </div>
        
        <div class="card text-center">
          <div class="text-3xl font-bold text-success-600 mb-2">
            {{ todayApproved }}
          </div>
          <div class="text-sm text-gray-600">Approved Today</div>
        </div>
        
        <div class="card text-center">
          <div class="text-3xl font-bold text-danger-600 mb-2">
            {{ todayRejected }}
          </div>
          <div class="text-sm text-gray-600">Rejected Today</div>
        </div>
      </div>

      <!-- Documents List -->
      <div v-if="kycStore.loading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="kycStore.pendingDocuments.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No pending documents</h3>
        <p class="mt-1 text-sm text-gray-500">
          All documents have been reviewed.
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Document Review Card -->
        <div
          v-for="document in kycStore.pendingDocuments"
          :key="document.id"
          class="card"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Document Info -->
            <div>
              <div class="flex items-start space-x-4 mb-4">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-gray-900">{{ document.fileName }}</h3>
                  <div class="mt-2 space-y-1">
                    <p class="text-sm text-gray-500">
                      User ID: <span class="font-medium font-mono">{{ document.userId }}</span>
                    </p>
                    <p class="text-sm text-gray-500">
                      Document Type: <span class="font-medium">{{ formatDocumentType(document.documentType) }}</span>
                    </p>
                    <p class="text-sm text-gray-500">
                      Uploaded: <span class="font-medium">{{ formatDate(document.uploadedAt) }}</span>
                    </p>
                    <p class="text-sm text-gray-500">
                      File Size: <span class="font-medium">{{ formatFileSize(document.fileSize) }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Document Actions -->
              <div class="flex space-x-2 mb-4">
                <a
                  :href="document.downloadURL"
                  target="_blank"
                  class="btn-primary"
                >
                  View Document
                </a>
                <a
                  :href="document.downloadURL"
                  :download="document.fileName"
                  class="btn-secondary"
                >
                  Download
                </a>
              </div>
            </div>

            <!-- Review Form -->
            <div class="border-l border-gray-200 pl-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Review Decision</h4>
              
              <form @submit.prevent="submitReview(document.id)">
                <!-- Decision Selection -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="reviewDecisions[document.id]?.status"
                        type="radio"
                        value="approved"
                        class="mr-2 text-primary-600"
                      />
                      <span class="text-sm text-gray-700">Approve</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="reviewDecisions[document.id]?.status"
                        type="radio"
                        value="rejected"
                        class="mr-2 text-primary-600"
                      />
                      <span class="text-sm text-gray-700">Reject</span>
                    </label>
                  </div>
                </div>

                <!-- Comments -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                    <span v-if="reviewDecisions[document.id]?.status === 'rejected'" class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="reviewDecisions[document.id]?.comments"
                    rows="3"
                    class="input-field"
                    placeholder="Add review comments..."
                    :required="reviewDecisions[document.id]?.status === 'rejected'"
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="!reviewDecisions[document.id]?.status || submittingReview === document.id"
                  class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="submittingReview === document.id" class="mr-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ submittingReview === document.id ? 'Submitting...' : 'Submit Review' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useKYCStore } from '@/stores/kyc'
import TheNavbar from '@/components/TheNavbar.vue'

const authStore = useAuthStore()
const kycStore = useKYCStore()

const reviewDecisions = reactive({})
const submittingReview = ref(null)

onMounted(async () => {
  await authStore.initAuth()
  await kycStore.getAllPendingDocuments()
  
  // Initialize review decisions for each document
  kycStore.pendingDocuments.forEach(doc => {
    reviewDecisions[doc.id] = {
      status: '',
      comments: ''
    }
  })
})

const todayApproved = computed(() => {
  const today = new Date().toDateString()
  return kycStore.documents.filter(doc => 
    doc.status === 'approved' && 
    doc.reviewedAt && 
    new Date(doc.reviewedAt).toDateString() === today
  ).length
})

const todayRejected = computed(() => {
  const today = new Date().toDateString()
  return kycStore.documents.filter(doc => 
    doc.status === 'rejected' && 
    doc.reviewedAt && 
    new Date(doc.reviewedAt).toDateString() === today
  ).length
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

const submitReview = async (documentId) => {
  const decision = reviewDecisions[documentId]
  if (!decision.status) return
  
  if (decision.status === 'rejected' && !decision.comments.trim()) {
    alert('Comments are required when rejecting a document')
    return
  }
  
  submittingReview.value = documentId
  
  try {
    const commentsArray = decision.comments.trim() ? [decision.comments.trim()] : []
    
    const result = await kycStore.reviewDocument(
      documentId,
      decision.status,
      commentsArray
    )
    
    if (result.success) {
      // Remove the document from pending list
      const index = kycStore.pendingDocuments.findIndex(doc => doc.id === documentId)
      if (index !== -1) {
        kycStore.pendingDocuments.splice(index, 1)
      }
      
      // Clean up the review decision
      delete reviewDecisions[documentId]
      
      // Update user KYC status if needed
      // This is a simplified approach - in a real app, you'd want to check all user documents
      const userId = kycStore.documents.find(doc => doc.id === documentId)?.userId
      if (userId) {
        await kycStore.updateUserKYCStatus(userId, decision.status)
      }
    } else {
      alert('Failed to submit review: ' + result.error)
    }
  } catch (error) {
    alert('Error submitting review: ' + error.message)
  } finally {
    submittingReview.value = null
  }
}
</script> 