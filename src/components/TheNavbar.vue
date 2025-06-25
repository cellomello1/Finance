<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-primary-600">SME Finance</h1>
            </div>
          </router-link>
        </div>

        <!-- Navigation items -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/dashboard"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </router-link>
            <router-link
              to="/kyc"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              KYC Documents
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin/kyc-review"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Review KYC
            </router-link>
            
            <!-- User menu -->
            <div class="relative ml-3">
              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-700">
                  {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                </span>
                <button
                  @click="handleLogout"
                  class="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="btn-primary"
            >
              Register
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
        <template v-if="authStore.isAuthenticated">
          <router-link
            to="/dashboard"
            class="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </router-link>
          <router-link
            to="/kyc"
            class="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            KYC Documents
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin/kyc-review"
            class="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Review KYC
          </router-link>
          <button
            @click="handleLogout"
            class="block w-full text-left text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
          >
            Logout
          </button>
        </template>
        
        <template v-else>
          <router-link
            to="/login"
            class="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Register
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
  mobileMenuOpen.value = false
}
</script> 