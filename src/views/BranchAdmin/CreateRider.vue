<template>
  <div>
  <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Create New Rider Account</h3>

      <form @submit.prevent="handleSubmit">
        <!-- Step 1: Personal Information -->
        <section v-if="currentStep === 1">
          <h4 class="mb-4 text-xl font-medium text-gray-800 dark:text-white/90">Personal Information</h4>
          <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
             <!-- Password -->
            <div>
              <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
              <input type="password" id="password" v-model="formData.password" required
                     class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
               <p v-if="formErrors.password" class="mt-1 text-sm text-error-500">{{ formErrors.password }}</p>
            </div>
            <!-- Password Confirmation -->
             <div>
              <label for="password_confirmation" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Confirm Password</label>
              <input type="password" id="password_confirmation" v-model="formData.password_confirmation" required
                     class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
               <p v-if="formErrors.password_confirmation" class="mt-1 text-sm text-error-500">{{ formErrors.password_confirmation }}</p>
            </div>
            <!-- Branch Selection -->
            <div>
                <label for="branch" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Assign Branch</label>
                 <div v-if="branchesLoading" class="text-sm text-gray-500 dark:text-gray-400">Loading branches...</div>
                 <div v-else-if="branchesError" class="text-sm text-error-500">Error loading branches: {{ branchesError }}</div>
                 <select v-else id="branch" v-model="formData.branch_id" required
                         class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                   <option value="" disabled>Select a branch</option>
                   <option v-for="branch in branches" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
                 </select>
                 <p v-if="formErrors.branch_id" class="mt-1 text-sm text-error-500">{{ formErrors.branch_id }}</p>
            </div>
          </div>
        </section>

        <!-- Step 2: Rider Information -->
        <section v-if="currentStep === 2">
           <h4 class="mb-4 text-xl font-medium text-gray-800 dark:text-white/90">Rider Information</h4>
           <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
             <!-- NIN -->
             <div>
               <label for="nin" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">NIN</label>
               <input type="text" id="nin" v-model="formData.nin" required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                <p v-if="formErrors.nin" class="mt-1 text-sm text-error-500">{{ formErrors.nin }}</p>
             </div>
             <!-- Vehicle Type -->
              <div>
               <label for="vehicle_type" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Vehicle Type</label>
               <select id="vehicle_type" v-model="formData.vehicle_type" required
                       class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                 <option value="">Select Vehicle Type</option>
                 <option value="keke">KEKE</option>
                 <option value="car">CAR</option>
               </select>
                 <p v-if="formErrors.vehicle_type" class="mt-1 text-sm text-error-500">{{ formErrors.vehicle_type }}</p>
             </div>
             <!-- Profile Picture -->
             <div>
                <label for="profile-picture" class="form-label mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Profile Picture</label>
                <input
                    type="file"
                    ref="profilePictureInput"
                    @change="handleProfilePicUpload"
                    accept="image/*"
                    class="hidden"
                    :disabled="isLoading || uploadingProfilePic"
                  />
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isLoading || uploadingProfilePic"
                >
                  {{ uploadingProfilePic ? 'Uploading...' : formData.profile_pic_url ? 'Change Picture' : 'Upload Picture' }}
                </button>
                            <!-- Upload Status/Error Display -->
                            <div v-if="uploadingProfilePic" class="mt-2 text-sm text-blue-600 dark:text-blue-400">
                                Uploading picture...
                            </div>
                            <div v-if="uploadError" class="mt-2 text-sm text-error-500">
                                {{ uploadError }}
                            </div>
                            <div v-if="formData.profile_pic_url && !uploadingProfilePic && !uploadError" class="mt-2 text-sm text-success-500">
                                 ✅ Picture uploaded successfully!
                            </div>
                            <p v-else-if="!formData.profile_pic_url && !uploadingProfilePic && !uploadError" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Upload a clear picture (JPG, PNG). Max 2MB.
                            </p>
                          </div>
           </div>
        </section>

        <!-- Step 3: Guarantor and Address -->
        <section v-if="currentStep === 3">
            <h4 class="mb-4 text-xl font-medium text-gray-800 dark:text-white/90">Guarantor and Address</h4>
            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <!-- Guarantor's Name -->
                <div>
                  <label for="guarantors_name" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Guarantor's Name</label>
                  <input type="text" id="guarantors_name" v-model="formData.guarantors_name" required
                         class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                   <p v-if="formErrors.guarantors_name" class="mt-1 text-sm text-error-500">{{ formErrors.guarantors_name }}</p>
                </div>
                 <!-- Guarantor's Phone -->
                <div>
                  <label for="guarantors_phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Guarantor's Phone</label>
                  <input type="tel" id="guarantors_phone" v-model="formData.guarantors_phone" required
                         class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                    <p v-if="formErrors.guarantors_phone" class="mt-1 text-sm text-error-500">{{ formErrors.guarantors_phone }}</p>
                </div>
                <!-- Guarantor's Address -->
                <div>
                   <label for="guarantors_address" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Guarantor's Address</label>
                   <input type="text" id="guarantors_address" v-model="formData.guarantors_address" required
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                     <p v-if="formErrors.guarantors_address" class="mt-1 text-sm text-error-500">{{ formErrors.guarantors_address }}</p>
            </div>
                <!-- Address -->
                 <div>
                   <label for="address" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Rider's Address</label>
                   <input type="text" id="address" v-model="formData.address" required
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                     <p v-if="formErrors.address" class="mt-1 text-sm text-error-500">{{ formErrors.address }}</p>
          </div>
          </div>
        </section>

        <!-- Navigation Buttons -->
        <div class="mt-6 flex justify-between">
          <button type="button" @click="prevStep" :disabled="currentStep === 1"
                  class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
            Previous
          </button>
          <button type="button" @click="nextStep" v-if="currentStep < 3"
                  class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
            Next
          </button>
          <button type="submit" v-if="currentStep === 3"
                  class="rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600">
            Create Rider
            </button>
          </div>
        </form>

       <!-- Loading and Error states -->
       <div v-if="isLoading || branchesLoading" class="mt-4 text-center text-brand-500">Loading...</div>
       <div v-if="errorMessage || branchesError" class="mt-4 text-center text-error-500">{{ errorMessage || branchesError }}</div>
       <div v-if="successMessage" class="mt-4 text-center text-success-500">{{ successMessage }}</div>

      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import { useAuthStore } from '@/stores/auth';
import apiService, { isBackendValidationErrorResponse, type BackendValidationErrorResponse, type RiderRegistrationResponse, type BranchData, getBranches } from '@/services/apiService';
import { useRouter } from 'vue-router';
import axios, { isAxiosError } from 'axios';

const currentPageTitle = ref('Create Rider');
const authStore = useAuthStore();
const router = useRouter();

const currentStep = ref(1);
const totalSteps = 3;

const formData = ref({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  branch_id: '' as string,
  nin: '',
  vehicle_type: '',
  profile_pic_url: null as string | null,
  guarantors_name: '',
  guarantors_phone: '',
  guarantors_address: '',
  address: '',
});

const formErrors = ref<Record<string, string>>({});
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const branches = ref<BranchData[]>([]);
const branchesLoading = ref(true);
const branchesError = ref<string | null>(null);

onMounted(async () => {
    await fetchBranches();
});

async function fetchBranches() {
  branchesLoading.value = true;
  branchesError.value = null;
  try {
    const token = authStore.token;
    if (!token) {
      branchesError.value = 'Authentication token missing. Cannot fetch branches.';
      return;
    }
    const response = await getBranches(token);
    branches.value = response.data;
  } catch (error: unknown) {
    console.error('Error fetching branches:', error);
    let msg = error instanceof Error ? error.message : 'An unknown error occurred while fetching branches.'
    if (msg.includes('SQLSTATE') || msg.includes('database') || msg.includes('Connection:')) {
      msg = 'Failed to load branches from server due to a database/server error.'
    }
    branchesError.value = msg;
  } finally {
    branchesLoading.value = false;
  }
}

const profilePictureInput = ref<HTMLInputElement | null>(null);
const triggerFileInput = () => {
  profilePictureInput.value?.click();
};

const uploadingProfilePic = ref(false);
const uploadError = ref<string | null>(null);

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const handleProfilePicUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    formData.value.profile_pic_url = null;
    uploadError.value = null;
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxFileSize = 2 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Invalid file type. Please upload a JPG, PNG, or GIF.';
    formData.value.profile_pic_url = null;
    return;
  }

  if (file.size > maxFileSize) {
    uploadError.value = 'File size exceeds 2MB.';
    formData.value.profile_pic_url = null;
    return;
  }

  uploadingProfilePic.value = true;
  uploadError.value = null;

  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      uploadData
    );

    formData.value.profile_pic_url = response.data.secure_url;
    uploadingProfilePic.value = false;
    if (profilePictureInput.value) {
      profilePictureInput.value.value = '';
    }

  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    uploadError.value = 'Image upload failed. Please try again.';
    uploadingProfilePic.value = false;
  }
};

const validateStep = (step: number): boolean => {
  formErrors.value = {};
  errorMessage.value = null;
  let isValid = true;

  if (step === 1) {
    if (!formData.value.fullname) { formErrors.value.fullname = 'Full name is required'; isValid = false; }
    if (!formData.value.email) { formErrors.value.email = 'Email is required'; isValid = false; }
    if (formData.value.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.value.email)) { formErrors.value.email = 'Invalid email format'; isValid = false; }
    if (!formData.value.phone) { formErrors.value.phone = 'Phone number is required'; isValid = false; }
    if (!formData.value.password) { formErrors.value.password = 'Password is required'; isValid = false; }
    if (formData.value.password.length < 6) { formErrors.value.password = 'Password must be at least 6 characters'; isValid = false; }
    if (!formData.value.password_confirmation) { formErrors.value.password_confirmation = 'Confirm password is required'; isValid = false; }
    if (formData.value.password !== formData.value.password_confirmation) { formErrors.value.password_confirmation = 'Passwords do not match'; formErrors.value.password = 'Passwords do not match'; isValid = false; }
    if (formData.value.branch_id === '') { formErrors.value.branch_id = 'Branch selection is required'; isValid = false; }

  } else if (step === 2) {
    if (!formData.value.nin) { formErrors.value.nin = 'NIN is required'; isValid = false; }
    if (!formData.value.vehicle_type) { formErrors.value.vehicle_type = 'Vehicle type is required'; isValid = false; }
    if (!formData.value.profile_pic_url) { uploadError.value = 'Profile picture is required.'; isValid = false; }
  } else if (step === 3) {
    if (!formData.value.guarantors_name) { formErrors.value.guarantors_name = 'Guarantor\'s name is required'; isValid = false; }
    if (!formData.value.guarantors_phone) { formErrors.value.guarantors_phone = 'Guarantor\'s phone is required'; isValid = false; }
    if (!formData.value.guarantors_address) { formErrors.value.guarantors_address = 'Guarantor\'s address is required'; isValid = false; }
    if (!formData.value.address) { formErrors.value.address = 'Rider\'s address is required'; isValid = false; }
  }

  if (!isValid) {
    errorMessage.value = 'Please fix the errors before proceeding.';
  }

  return isValid;
};

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
    if (!validateStep(totalSteps)) {
        return;
    }

    isLoading.value = true;
    errorMessage.value = null;
    successMessage.value = null;

    const payload = {
        fullname: formData.value.fullname,
        email: formData.value.email,
        phone: formData.value.phone,
        password: formData.value.password,
        password_confirmation: formData.value.password_confirmation,
        branch_id: formData.value.branch_id,
        nin: formData.value.nin,
        vehicle_type: formData.value.vehicle_type,
        profile_pic_url: formData.value.profile_pic_url,
        guarantors_name: formData.value.guarantors_name,
        guarantors_phone: formData.value.guarantors_phone,
        guarantors_address: formData.value.guarantors_address,
        address: formData.value.address,
    };

    try {
        const token = authStore.token;
        if (!token) {
            errorMessage.value = 'Authentication token not found. Cannot create rider.';
            isLoading.value = false;
            return;
        }
        // Log the URL and payload before making the API call
        const url = '/register-rider';
        console.log('Creating rider. POST URL:', url, 'Payload:', payload);
        const response = await apiService.post<RiderRegistrationResponse>(url, payload, token);

        console.log('Rider creation successful:', response);
        successMessage.value = 'Rider account created successfully!';

        setTimeout(() => {
            router.push({ name: 'RiderList' });
        }, 2000);

    } catch (error: unknown) {
        console.error("Rider creation failed:", error);
        if (isAxiosError(error) && error.response && error.response.data) {
             const errorData = error.response.data as BackendValidationErrorResponse;
             if (isBackendValidationErrorResponse(errorData)) {
                 for (const field in errorData.errors) {
                      if (field in formData.value) {
                          formErrors.value[field] = errorData.errors[field].join(', ');
                      }
                 }
                 errorMessage.value = errorData.message || 'Validation failed. Please check the form data.';
             } else if (typeof error.response.data.message === 'string') {
                 errorMessage.value = `Creation failed: ${error.response.data.message}`;
             } else {
                 errorMessage.value = 'An unexpected API error occurred during creation.';
             }
        } else if (error instanceof Error) {
            let msg = error.message;
            if (msg.includes('SQLSTATE') || msg.includes('database') || msg.includes('Connection:')) {
                msg = 'An unexpected server error occurred.'
            }
            errorMessage.value = `Creation failed: ${msg}`;
        } else {
            errorMessage.value = 'An unknown error occurred during creation.';
        }

         if (Object.keys(formErrors.value).length > 0) {
            const fieldsInStep1 = ['fullname', 'email', 'phone', 'password', 'password_confirmation', 'branch_id'];
            const fieldsInStep2 = ['nin', 'vehicle_type', 'profile_pic_url'];
            const fieldsInStep3 = ['guarantors_name', 'guarantors_phone', 'guarantors_address', 'address'];

            if (fieldsInStep1.some(field => formErrors.value[field])) {
                 currentStep.value = 1;
            } else if (fieldsInStep2.some(field => formErrors.value[field])) {
                 currentStep.value = 2;
            } else if (fieldsInStep3.some(field => formErrors.value[field])) {
                 currentStep.value = 3;
            }
         }

    } finally {
        isLoading.value = false;
    }
};

</script>

<style scoped>
/* Add any specific styles for the form here if needed */
/* You might want to style the steps/sections */
</style> 