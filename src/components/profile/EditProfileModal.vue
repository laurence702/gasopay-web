<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <template #body>
      <div class="p-6 bg-white rounded-lg dark:bg-gray-800">
        <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Edit Profile</h3>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="fullname" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" id="fullname" v-model="form.fullname" class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div class="mb-4">
            <label for="phone" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input type="text" id="phone" v-model="form.phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div class="mb-4">
            <label for="address" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input type="text" id="address" v-model="form.address" class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div v-if="successMessage" class="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
            {{ successMessage }}
          </div>
          <div v-if="error" class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            {{ error }}
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" :disabled="isLoading" class="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:bg-brand-300">
              <span v-if="isLoading">Saving...</span>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { PropType } from 'vue'
import type { ApiUser } from '@/services/apiService'
import Modal from '@/components/ui/Modal.vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object as PropType<ApiUser | null>,
    default: null
  }
})

const emit = defineEmits(['close', 'profile-updated'])

const authStore = useAuthStore()
const form = reactive({
  fullname: '',
  phone: '',
  address: ''
})
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

watch(() => props.user, (newUser) => {
  if (newUser) {
    form.fullname = newUser.fullname || ''
    form.phone = newUser.phone || ''
    form.address = newUser.user_profile?.address || ''
  }
}, { immediate: true })

const submitForm = async () => {
  if (!props.user) return
  isLoading.value = true
  error.value = null
  successMessage.value = null
  try {
    await authStore.updateUserProfile({
      fullname: form.fullname,
      phone: form.phone,
      address: form.address
    })
    successMessage.value = 'Profile updated successfully!';
    setTimeout(() => {
      emit('profile-updated')
    }, 1000);
  } catch (e: any) {
    error.value = e.message || 'An error occurred while updating the profile.'
  } finally {
    isLoading.value = false
  }
}
</script>
