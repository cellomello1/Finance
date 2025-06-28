<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div class="mx-auto h-12 w-12 flex items-center justify-center bg-green-100 rounded-full">
        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
        Account Created!
      </h2>
      <p class="mt-2 text-gray-600">
        Your account has been successfully created.
      </p>
      <router-link to="/dashboard" class="w-full inline-block mt-6 px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition">
        Go to Dashboard
      </router-link>
      <router-link to="/login" class="block mt-4 text-primary-600 hover:text-primary-700">
        Or sign in to another account
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script> 