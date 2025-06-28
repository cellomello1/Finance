<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full space-y-8">
      <h2 class="text-2xl font-bold text-center mb-6">Complete Your Onboarding</h2>
      <form @submit.prevent="handleNext">
        <div v-if="step === 1" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input v-model="form.dob" type="date" class="input-field" required />
            <div v-if="submitError && step === 1" class="text-red-600 text-sm mt-1">{{ submitError }}</div>
          </div>
        </div>
        <div v-if="step === 2" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Business Number</label>
            <input v-model="form.businessNumber" type="text" class="input-field" required />
          </div>
        </div>
        <div v-if="step === 3" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Number of Individuals of Significant Control</label>
            <input v-model.number="form.numIndividuals" type="number" min="0" class="input-field" required :disabled="onlyMe" />
          </div>
          <div class="flex items-center mt-2">
            <input id="onlyMe" type="checkbox" v-model="onlyMe" class="mr-2" />
            <label for="onlyMe" class="text-sm text-gray-700">I am the only individual of significant control</label>
          </div>
          <div v-if="onlyMe && individuals.length > 0" class="border rounded p-4 mt-4">
            <h4 class="font-semibold mb-2">You (Individual 1)</h4>
            <p class="text-sm text-gray-600">Name: {{ userFullName }}</p>
            <p class="text-sm text-gray-600">Date of Birth: {{ form.dob }}</p>
          </div>
          <div v-if="!onlyMe">
            <div v-for="(individual, idx) in individuals" :key="idx" class="border rounded p-4 mt-4">
              <h4 class="font-semibold mb-2">Individual {{ idx + 1 }}</h4>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <input v-model="individual.name" type="text" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input v-model="individual.dob" type="date" class="input-field" required />
              </div>
            </div>
            <button type="button" class="btn-secondary mt-4" @click="addIndividual">Add other individual of significant control (at least 25%)</button>
          </div>
        </div>
        <div v-if="step === 4" class="space-y-4">
          <h3 class="font-bold mb-2">Review Your Information</h3>
          <ul class="text-gray-700 text-sm space-y-1">
            <li><strong>Full Name:</strong> {{ userFullName }}</li>
            <li><strong>Date of Birth:</strong> {{ form.dob }}</li>
            <li><strong>Business Number:</strong> {{ form.businessNumber }}</li>
            <li><strong>Individuals of Significant Control:</strong></li>
            <ul v-for="(individual, idx) in individuals" :key="idx" class="ml-4">
              <li v-if="!(onlyMe && individual.name === userFullName && individual.dob === form.dob)">- {{ individual.name }}, DOB: {{ individual.dob }}</li>
              <li v-else>- {{ individual.name }}</li>
            </ul>
          </ul>
          <div v-if="submitError" class="text-red-600 text-sm">{{ submitError }}</div>
        </div>
        <div class="flex justify-between mt-8">
          <button type="button" class="btn-secondary" @click="handleBack">Back</button>
          <button v-if="step < 4" type="button" class="btn-primary" @click="handleNext">Next</button>
          <button v-else type="submit" class="btn-primary">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { db, auth } from '@/firebase/init'
import { doc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const authStore = useAuthStore()
const step = ref(1)
const submitError = ref('')
const onlyMe = ref(false)

const form = reactive({
  dob: '',
  businessNumber: '',
  numIndividuals: 0
})
const individuals = ref([])

const userFullName = computed(() => {
  const reg = JSON.parse(localStorage.getItem('registrationForm') || '{}')
  return [reg.firstName, reg.lastName].filter(Boolean).join(' ')
})

function syncIndividualsWithOnlyMe() {
  if (onlyMe.value) {
    individuals.value = [{ name: userFullName.value, dob: form.dob }]
    form.numIndividuals = 1
  } else {
    if (individuals.value.length === 0 || individuals.value[0].name !== userFullName.value) {
      individuals.value = [{ name: userFullName.value, dob: form.dob }]
    } else {
      individuals.value[0].dob = form.dob
      individuals.value[0].name = userFullName.value
    }
    form.numIndividuals = individuals.value.length
  }
}

watch(onlyMe, (val) => {
  syncIndividualsWithOnlyMe()
})

watch(() => form.dob, (newDob) => {
  if (individuals.value.length > 0) {
    individuals.value[0].dob = newDob
    individuals.value[0].name = userFullName.value
  }
})

watch(() => individuals.value.length, (newLen) => {
  form.numIndividuals = newLen
})

function addIndividual() {
  if (individuals.value.length === 0 || individuals.value[0].name !== userFullName.value) {
    individuals.value = [{ name: userFullName.value, dob: form.dob }]
  }
  individuals.value.push({ name: '', dob: '' })
  form.numIndividuals = individuals.value.length
}

function nextStep() {
  if (step.value < 4) step.value++
}
function handleBack() {
  if (step.value > 1) {
    step.value--
  } else {
    router.push('/register')
  }
}

async function handleNext() {
  submitError.value = ''
  if (step.value === 1) {
    if (!form.dob) {
      submitError.value = 'Date of birth is required.'
      return
    }
    if (new Date(form.dob) > new Date()) {
      submitError.value = 'Date of birth cannot be in the future.'
      return
    }
  }
  if (step.value === 2) {
    if (!form.businessNumber) {
      submitError.value = 'Business number is required.'
      return
    }
  }
  if (step.value === 3) {
    if (!form.numIndividuals || form.numIndividuals < 1) {
      submitError.value = 'At least one individual of significant control is required.'
      return
    }
    for (const [idx, individual] of individuals.value.entries()) {
      if (idx === 0) {
        individual.name = userFullName.value
        individual.dob = form.dob
      }
      if (!individual.name || !individual.dob) {
        submitError.value = `All individuals must have a name and date of birth. (Missing info for individual ${idx + 1})`;
        return;
      }
    }
  }
  if (step.value < 4) {
    nextStep()
    return
  }
  try {
    const reg = JSON.parse(localStorage.getItem('registrationForm') || '{}')
    if (!reg.email || !reg.password) throw new Error('Registration info missing. Please start again.')

    const cred = await createUserWithEmailAndPassword(auth, reg.email, reg.password)
    const userId = cred.user.uid

    const userDocData = {
      email: reg.email,
      firstName: reg.firstName,
      lastName: reg.lastName,
      userType: reg.userType,
      companyName: reg.companyName,
      phone: reg.phone,
      role: 'user',
      kycStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboarding: {
        dob: form.dob,
        businessNumber: form.businessNumber,
        individuals: individuals.value
      }
    }
    await setDoc(doc(db, 'users', userId), userDocData)
    localStorage.removeItem('registrationForm')
    router.push('/dashboard')
  } catch (e) {
    submitError.value = e.message || 'Failed to complete onboarding.'
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500;
}
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition;
}
</style> 