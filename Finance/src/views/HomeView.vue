<template>
  <div>
    <TheNavbar />
    
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-600 to-primary-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Finance Platform for SMEs
          </h1>
          <p class="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Connect lenders and borrowers with secure KYC verification and streamlined financial services for small and medium enterprises.
          </p>
          <div class="space-x-4">
            <template v-if="!authStore.isAuthenticated">
              <router-link
                to="/register"
                class="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Get Started
              </router-link>
              <router-link
                to="/login"
                class="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Login
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Secure and Streamlined KYC Process
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform ensures compliance and security with comprehensive KYC verification for all participants.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center">
            <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Secure Document Upload</h3>
            <p class="text-gray-600">
              Upload and manage KYC documents securely with encrypted storage and access controls.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center">
            <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Manual Verification</h3>
            <p class="text-gray-600">
              Expert review team manually verifies all documents to ensure compliance and authenticity.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center">
            <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Fast Processing</h3>
            <p class="text-gray-600">
              Quick turnaround times for document verification and approval processes.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-primary-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p class="text-xl text-primary-100 mb-8">
            Join our platform today and experience secure, efficient financial services.
          </p>
          <router-link
            to="/register"
            class="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Create Account
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script> 