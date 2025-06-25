<template>
  <div>
    <TheNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">
          Welcome back, {{ authStore.user?.firstName }}! Manage your KYC documents and track your verification status.
        </p>
      </div>

      <!-- KYC Status Card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">KYC Verification Status</h2>
              <span :class="kycStatusBadgeClass">
                {{ kycStatusText }}
              </span>
            </div>
            
            <div class="space-y-4">
              <div v-if="authStore.user?.kycStatus === 'pending'" class="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-warning-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 class="text-sm font-medium text-warning-800">
                      KYC Verification Required
                    </h3>
                    <p class="mt-1 text-sm text-warning-700">
                      Please upload your KYC documents to complete the verification process and access all platform features.
                    </p>
                  </div>
                </div>
              </div>
              
              <div v-else-if="authStore.user?.kycStatus === 'approved'" class="bg-success-50 border border-success-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-success-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 class="text-sm font-medium text-success-800">
                      KYC Verified
                    </h3>
                    <p class="mt-1 text-sm text-success-700">
                      Your identity has been verified. You now have full access to all platform features.
                    </p>
                  </div>
                </div>
              </div>
              
              <div v-else-if="authStore.user?.kycStatus === 'rejected'" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-danger-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 class="text-sm font-medium text-danger-800">
                      KYC Verification Failed
                    </h3>
                    <p class="mt-1 text-sm text-danger-700">
                      Your KYC documents were rejected. Please review the feedback and resubmit updated documents.
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex space-x-4">
                <router-link
                  to="/kyc"
                  class="btn-primary"
                >
                  View KYC Documents
                </router-link>
                <router-link
                  v-if="authStore.user?.kycStatus !== 'approved'"
                  to="/kyc/upload"
                  class="btn-secondary"
                >
                  Upload Documents
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="space-y-6">
          <div class="card text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">
              {{ documentCount }}
            </div>
            <div class="text-sm text-gray-600">Documents Uploaded</div>
          </div>
          
          <div class="card text-center">
            <div class="text-3xl font-bold text-gray-900 mb-2">
              {{ authStore.userType === 'lender' ? 'Lender' : 'Borrower' }}
            </div>
            <div class="text-sm text-gray-600">Account Type</div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        
        <div v-if="kycStore.loading" class="flex justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="recentDocuments.length === 0" class="text-center py-8 text-gray-500">
          No documents uploaded yet. 
          <router-link to="/kyc/upload" class="text-primary-600 hover:text-primary-500">
            Upload your first document
          </router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="document in recentDocuments"
            :key="document.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ document.fileName }}</p>
                <p class="text-sm text-gray-500">{{ document.documentType }} • {{ formatDate(document.uploadedAt) }}</p>
              </div>
            </div>
            <span :class="getStatusBadgeClass(document.status)">
              {{ getStatusText(document.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useKYCStore } from '@/stores/kyc'
import TheNavbar from '@/components/TheNavbar.vue'

const authStore = useAuthStore()
const kycStore = useKYCStore()
const documentCount = ref(0)

// Initialize auth and load user documents
onMounted(async () => {
  await authStore.initAuth()
  if (authStore.user) {
    await kycStore.getUserDocuments(authStore.user.uid)
    documentCount.value = kycStore.documents.length
  }
})

const kycStatusText = computed(() => {
  switch (authStore.user?.kycStatus) {
    case 'pending': return 'Verification Pending'
    case 'approved': return 'Verified'
    case 'rejected': return 'Verification Failed'
    default: return 'Not Started'
  }
})

const kycStatusBadgeClass = computed(() => {
  switch (authStore.user?.kycStatus) {
    case 'pending': return 'px-3 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full'
    case 'approved': return 'px-3 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full'
    case 'rejected': return 'px-3 py-1 text-xs font-medium bg-danger-100 text-danger-800 rounded-full'
    default: return 'px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
  }
})

const recentDocuments = computed(() => {
  return kycStore.documents.slice(0, 3)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'pending': return 'px-2 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full'
    case 'approved': return 'px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full'
    case 'rejected': return 'px-2 py-1 text-xs font-medium bg-danger-100 text-danger-800 rounded-full'
    default: return 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Pending'
    case 'approved': return 'Approved'
    case 'rejected': return 'Rejected'
    default: return 'Unknown'
  }
}
</script> 