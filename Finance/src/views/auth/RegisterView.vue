<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-full">
          <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to existing account
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- User Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              :class="[
                'flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium',
                form.userType === 'lender' 
                  ? 'border-primary-600 bg-primary-50 text-primary-600' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              ]"
              @click="form.userType = 'lender'"
            >
              Lender
            </button>
            <button
              type="button"
              :class="[
                'flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium',
                form.userType === 'borrower' 
                  ? 'border-primary-600 bg-primary-50 text-primary-600' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              ]"
              @click="form.userType = 'borrower'"
            >
              Borrower
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                required
                class="input-field"
                placeholder="First name"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                required
                class="input-field"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input-field"
              placeholder="Email address"
            />
          </div>

          <div>
            <label for="companyName" class="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              id="companyName"
              v-model="form.companyName"
              name="companyName"
              type="text"
              required
              class="input-field"
              placeholder="Company name"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              required
              class="input-field"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="input-field"
              placeholder="Password"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="input-field"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div v-if="authStore.error" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded">
          {{ authStore.error }}
        </div>

        <div v-if="formError" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded">
          {{ formError }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="mr-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ authStore.loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/" class="text-primary-600 hover:text-primary-500">
            ← Back to home
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formError = ref('')

const form = reactive({
  userType: 'borrower',
  firstName: '',
  lastName: '',
  email: '',
  companyName: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// Load saved form data on mount
onMounted(() => {
  authStore.clearError()
  const saved = localStorage.getItem('registrationForm')
  if (saved) {
    Object.assign(form, JSON.parse(saved))
  }
})

// Watch for changes and save to localStorage
watch(form, (val) => {
  localStorage.setItem('registrationForm', JSON.stringify(val))
}, { deep: true })

const handleRegister = async () => {
  formError.value = ''
  authStore.clearError()
  console.log('Starting registration...')

  // Validation
  if (!form.userType) {
    formError.value = 'Please select whether you are a lender or borrower'
    console.log('Validation failed: userType')
    return
  }

  if (form.password !== form.confirmPassword) {
    formError.value = 'Passwords do not match'
    console.log('Validation failed: passwords do not match')
    return
  }

  if (form.password.length < 6) {
    formError.value = 'Password must be at least 6 characters long'
    console.log('Validation failed: password too short')
    return
  }

  // Save form to localStorage and go to onboarding
  localStorage.setItem('registrationForm', JSON.stringify(form))
  router.push('/onboarding')
}
</script> 