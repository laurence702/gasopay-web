<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <!-- Left Panel (Form) - Make it scrollable -->
        <div class="flex flex-col flex-1 w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto">
          <div class="w-full max-w-md pt-10 mx-auto">
            <!-- Back link -->
            <router-link
              to="/"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 lg:mb-0"
            >
              <svg class="stroke-current mr-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Back to Home
            </router-link>
          </div>
          <!-- Form -->
          <div class="flex flex-col justify-center flex-1 w-full max-w-md px-4 mx-auto lg:px-0 py-10 lg:py-0">
            <div class="mb-5 sm:mb-8">
              <h1
                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
              >
                Create your GasoPay Account
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Fill in the details below to get started.
              </p>
            </div>
            <div>
              <form @submit.prevent="handleSubmit">
                <div class="space-y-5">
                  <!-- Error Message Placeholder -->
                  <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
                     {{ errorMessage }}
                  </div>

                  <!-- Full Name -->
                  <BaseInput v-model="formData.fullName" label="Full Name" placeholder="John Doe" required inputId="signup-name" />

                  <!-- Email -->
                  <BaseInput v-model="formData.email" label="Email Address" type="email" placeholder="you@example.com" required inputId="signup-email" />

                  <!-- Phone Number -->
                  <BaseInput v-model="formData.phone" label="Phone Number" type="tel" placeholder="08012345678" required inputId="signup-phone" />

                  <!-- Address -->
                  <BaseInput v-model="formData.address" label="Address" type="text" placeholder="123 Main St, Anytown" required inputId="signup-address" />

                  <!-- Password -->
                  <BaseInput v-model="formData.password" label="Password" type="password" placeholder="Enter your password" required inputId="signup-password" />

                  <!-- Confirm Password -->
                  <BaseInput v-model="formData.confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" required inputId="signup-confirm-password" :error="passwordMismatchError" />

                  <div>
                    <button
                      type="submit"
                      class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isLoading || !!passwordMismatchError"
                    >
                       <span v-if="isLoading">Creating Account...</span>
                       <span v-else>Create Account</span>
                    </button>
                  </div>
                </div>
              </form>
              <div class="mt-5">
                <p
                  class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                >
                  Already have an account?
                  <router-link
                    to="/signin"
                    class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >Sign In</router-link
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- ADD RIGHT SIDE PANEL HERE -->
         <div
          class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"
        >
             <div class="flex items-center justify-center z-1">
               <CommonGridShape />
               <div class="flex flex-col items-center max-w-xs">
                <img src="/src/assets/images/GASOPAY-orange.svg" alt="gasopay-logo">
                 <p class="text-center text-gray-400 dark:text-white/60">
                   Join us and start fueling your journey!
                 </p>
               </div>
             </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts" name="UserSignup">
import { ref, reactive, computed } from 'vue';
import { registerUser } from '@/services/apiService';
import { useRouter } from 'vue-router';
// Assume separate auth store or logic might be needed
// import { useAuthStore } from '@/stores/auth';
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import CommonGridShape from '@/components/common/CommonGridShape.vue';

const router = useRouter();
// const authStore = useAuthStore();

// Use reactive state for form data
const formData = reactive({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: '',
});

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// Password confirmation check
const passwordMismatchError = computed(() => {
  if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
});

const handleSubmit = async () => {
  if (passwordMismatchError.value) {
    errorMessage.value = passwordMismatchError.value;
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    const payload = {
      fullname: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };

    await registerUser(payload);

    // On successful registration, redirect to the sign-in page with a success message
    router.push({ name: 'Signin', query: { registered: 'true' } });

  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unexpected error occurred during signup.';
    }
    console.error("User Signup error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Remove styles if BaseInput covers them, or scope specific ones if needed */
/* .form-input { @apply ... } */
/* .form-label { @apply ... } */
</style>
