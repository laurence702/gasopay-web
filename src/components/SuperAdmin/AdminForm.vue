<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <!-- Full Name -->
      <div>
        <label for="fullname" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Full Name</label>
        <input type="text" id="fullname" v-model="formData.fullname" required
               class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
        <p v-if="formErrors.fullname" class="mt-1 text-sm text-error-500">{{ formErrors.fullname }}</p>
      </div>
      <!-- Email -->
      <div>
        <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
        <input type="email" id="email" v-model="formData.email" required
               class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
        <p v-if="formErrors.email" class="mt-1 text-sm text-error-500">{{ formErrors.email }}</p>
      </div>
      <!-- Phone -->
      <div>
        <label for="phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
        <input type="tel" id="phone" v-model="formData.phone" required
               class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
        <p v-if="formErrors.phone" class="mt-1 text-sm text-error-500">{{ formErrors.phone }}</p>
      </div>
      <!-- Branch -->
      <div>
        <label for="branch" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Assign Branch</label>
        <select id="branch" v-model="formData.branch_id" required
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
          <option value="" disabled>Select a branch</option>
          <option v-for="branch in branches" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
        </select>
        <p v-if="formErrors.branch_id" class="mt-1 text-sm text-error-500">{{ formErrors.branch_id }}</p>
      </div>
      <!-- Password -->
      <div>
        <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
        <input type="password" id="password" v-model="formData.password" :required="!initialData" :disabled="!!initialData && !formData.password"
               class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
        <p v-if="formErrors.password" class="mt-1 text-sm text-error-500">{{ formErrors.password }}</p>
         <p v-if="initialData" class="mt-1 text-sm text-gray-500 dark:text-gray-400">Leave blank to keep current password.</p>
      </div>
      <!-- Password Confirmation -->
      <div>
        <label for="password_confirmation" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Confirm Password</label>
        <input type="password" id="password_confirmation" v-model="formData.password_confirmation" :required="!initialData" :disabled="!!initialData && !formData.password_confirmation"
               class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
        <p v-if="formErrors.password_confirmation" class="mt-1 text-sm text-error-500">{{ formErrors.password_confirmation }}</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 text-center text-error-500">{{ errorMessage }}</div>

    <!-- Submit Button -->
    <div class="mt-6 flex justify-end">
      <button type="submit"
              class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600" :disabled="isLoading">
        {{ isLoading ? 'Processing...' : (initialData ? 'Update Admin' : 'Create Admin') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { type BranchData } from '@/services/apiService';

// Define interface for the data emitted by the form
export interface AdminFormData {
  id?: string; // Optional ID for editing
  fullname: string;
  email: string;
  phone: string;
  password?: string; // Optional password for creation/update
  password_confirmation?: string;
  branch_id: string;
}

const props = defineProps({
  initialData: { // For editing
    type: Object as () => {
      id?: string;
      fullname: string;
      email: string;
      phone: string;
      branch_id?: string | null;
    },
    default: () => ({}),
  },
  branches: { // List of branches for select dropdown
    type: Array as () => BranchData[],
    required: true,
  },
});

const emit = defineEmits(['submit']);

const formData = ref<AdminFormData>({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  branch_id: '',
});

const formErrors = ref<Record<string, string>>({});
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// Populate form when initialData changes (for editing)
watchEffect(() => {
  if (props.initialData && props.initialData.id) {
    formData.value = {
      id: props.initialData.id,
      fullname: props.initialData.fullname || '',
      email: props.initialData.email || '',
      phone: props.initialData.phone || '',
      password: '', // Passwords are not pre-filled for security
      password_confirmation: '',
      branch_id: props.initialData.branch_id ?? '', // Use nullish coalescing for default
    };
     // Clear errors when initial data changes
     formErrors.value = {};
     errorMessage.value = null;
  } else {
     // Reset form for creation if no initialData or no ID
     resetForm();
  }
});

const handleSubmit = () => {
  formErrors.value = {};
  errorMessage.value = null;
  let isValid = true;

  // Basic validation
  if (!formData.value.fullname) { formErrors.value.fullname = 'Full name is required'; isValid = false; }
  if (!formData.value.email) { formErrors.value.email = 'Email is required'; isValid = false; }
  if (formData.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) { formErrors.value.email = 'Invalid email format'; isValid = false; }
  if (!formData.value.phone) { formErrors.value.phone = 'Phone number is required'; isValid = false; }

  // Password validation only for creation or if changing password during edit
  if (!props.initialData?.id || (formData.value.password || formData.value.password_confirmation)) {
      if (!formData.value.password) {
          formErrors.value.password = 'Password is required'; isValid = false; 
      } else if (typeof formData.value.password === 'string' && formData.value.password.length < 6) {
          formErrors.value.password = 'Password must be at least 6 characters'; isValid = false; 
      }
      if (!formData.value.password_confirmation) { formErrors.value.password_confirmation = 'Confirm password is required'; isValid = false; }
      if (formData.value.password !== formData.value.password_confirmation) { formErrors.value.password_confirmation = 'Passwords do not match'; isValid = false; formErrors.value.password = 'Passwords do not match'; }
  }

   if (formData.value.branch_id === '') { formErrors.value.branch_id = 'Branch selection is required'; isValid = false; }

  if (!isValid) {
    errorMessage.value = 'Please fix the errors in the form.';
    return;
  }

  // Emit submit event with validated formData
  // Parent component will handle isLoading and API calls
  emit('submit', formData.value);
};

const resetForm = () => {
  formData.value = {
    fullname: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    branch_id: '',
  };
  formErrors.value = {};
  errorMessage.value = null;
};

// This component is responsible for form display and basic client-side validation.
// API calls and complex error handling (like backend validation errors) are handled by the parent.
</script>

<style scoped>
/* Add component-specific styles here */
/* You can add styles for inputs, labels, buttons etc. to enhance aesthetics */
</style> 