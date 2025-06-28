<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">KYC Verification</h2>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <template v-for="(step, idx) in steps" :key="step.label">
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-bold',
              currentStep === idx ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            ]">
              {{ idx + 1 }}
            </div>
            <span class="ml-2 text-sm font-medium" :class="currentStep === idx ? 'text-primary-600' : 'text-gray-500'">{{ step.label }}</span>
          </div>
          <div v-if="idx < steps.length - 1" class="flex-1 h-1 bg-gray-200 mx-2"></div>
        </template>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div v-if="currentStep === 0">
        <!-- Step 1: Identity Fields -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Date of Birth *</label>
          <input v-model="form.dob" type="date" class="input" required />
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">Residential Address *</label>
          <input v-model="form.address" type="text" class="input" required />
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">Occupation / Source of Funds *</label>
          <input v-model="form.occupation" type="text" class="input" required />
        </div>
      </div>

      <div v-if="currentStep === 1">
        <!-- Step 2: Document Uploads -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Government ID (PDF/JPG) *</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="onFileChange($event, 'govId')" required />
          <div v-if="form.govIdName" class="text-xs text-gray-500 mt-1">Selected: {{ form.govIdName }}</div>
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">ID Selfie (PDF/JPG) <span class="text-gray-400">(Optional)</span></label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="onFileChange($event, 'selfie')" />
          <div v-if="form.selfieName" class="text-xs text-gray-500 mt-1">Selected: {{ form.selfieName }}</div>
        </div>
      </div>

      <div v-if="currentStep === 2">
        <!-- Step 3: Optional Fields -->
        <div class="mb-4">
          <label class="block font-medium mb-1">SIN (Canada) or TIN (US) <span class="text-gray-400">(Optional, high-value accounts)</span></label>
          <input v-model="form.sinTin" type="text" class="input" />
        </div>
      </div>

      <div v-if="currentStep === 3">
        <!-- Step 4: Review & Submit -->
        <h3 class="font-bold mb-2">Review your information:</h3>
        <ul class="mb-4 text-sm text-gray-700 space-y-1">
          <li><strong>Date of Birth:</strong> {{ form.dob }}</li>
          <li><strong>Address:</strong> {{ form.address }}</li>
          <li><strong>Occupation:</strong> {{ form.occupation }}</li>
          <li><strong>Government ID:</strong> {{ form.govIdName || 'Not uploaded' }}</li>
          <li><strong>ID Selfie:</strong> {{ form.selfieName || 'Not uploaded' }}</li>
          <li><strong>SIN/TIN:</strong> {{ form.sinTin || 'Not provided' }}</li>
        </ul>
        <div v-if="submitError" class="text-red-600 text-sm mb-2">{{ submitError }}</div>
        <div v-if="submitSuccess" class="text-green-600 text-sm mb-2">Submitted! (Mock)</div>
      </div>

      <div class="flex justify-between mt-8">
        <button type="button" class="btn-secondary" @click="prevStep" :disabled="currentStep === 0">Back</button>
        <button v-if="currentStep < steps.length - 1" type="button" class="btn-primary" @click="nextStep">Next</button>
        <button v-else type="submit" class="btn-primary">Submit</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const steps = [
  { label: 'Identity' },
  { label: 'Documents' },
  { label: 'Optional' },
  { label: 'Review' }
]
const currentStep = ref(0)
const form = reactive({
  dob: '',
  address: '',
  occupation: '',
  govId: null,
  govIdName: '',
  selfie: null,
  selfieName: '',
  sinTin: ''
})
const submitError = ref('')
const submitSuccess = ref(false)

function nextStep() {
  if (currentStep.value === 0 && (!form.dob || !form.address || !form.occupation)) {
    submitError.value = 'Please fill all required fields.'
    return
  }
  if (currentStep.value === 1 && !form.govId) {
    submitError.value = 'Please upload your Government ID.'
    return
  }
  submitError.value = ''
  currentStep.value++
}
function prevStep() {
  submitError.value = ''
  if (currentStep.value > 0) currentStep.value--
}
function onFileChange(event, type) {
  const file = event.target.files[0]
  if (!file) return
  if (type === 'govId') {
    form.govId = file
    form.govIdName = file.name
  } else if (type === 'selfie') {
    form.selfie = file
    form.selfieName = file.name
  }
}
function handleSubmit() {
  // Mock submit
  submitSuccess.value = true
  submitError.value = ''
  setTimeout(() => {
    submitSuccess.value = false
    currentStep.value = 0
    Object.assign(form, {
      dob: '', address: '', occupation: '', govId: null, govIdName: '', selfie: null, selfieName: '', sinTin: ''
    })
  }, 2000)
}
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500;
}
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition;
}
.card {
  @apply bg-white rounded-lg shadow p-6;
}
</style> 