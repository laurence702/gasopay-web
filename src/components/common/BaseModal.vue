<template>
  <teleport to="body"> <!-- Render modal at the end of body -->
    <transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-75"
        @click.self="closeOnOverlayClick ? closeModal() : null"
        aria-modal="true"
        role="dialog"
      >
        <transition name="modal-slide">
          <div
             v-if="modelValue"
            :class="[
                'relative w-full bg-white rounded-lg shadow-xl dark:bg-gray-800',
                modalSizeClass
            ]"
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <slot name="header">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ title || 'Modal Title' }}
                </h3>
              </slot>
              <button
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white ms-auto"
                @click="closeModal"
                aria-label="Close modal"
              >
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-4 space-y-4 md:p-5">
              <slot name="body">
                 <!-- Default slot content -->
                 <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Modal body content goes here.
                 </p>
              </slot>
            </div>

            <!-- Modal Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 rounded-b md:p-5 dark:border-gray-600">
              <slot name="footer"></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: boolean; // Controls visibility via v-model
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; // Modal size
  closeOnOverlayClick?: boolean;
}>(), {
  size: 'md', // Default size
  closeOnOverlayClick: true, // Default behavior
});

const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
  emit('update:modelValue', false);
};

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    // Add a slight delay to restore scroll to avoid layout shift during transition
    setTimeout(() => {
        if (!props.modelValue) { // Double check modal is still closed
             document.body.style.overflow = '';
        }
    }, 300); // Match transition duration
  }
}, { immediate: true }); // Apply on initial load too

// Compute size class based on prop
const modalSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'max-w-sm';
    case 'md': return 'max-w-md';
    case 'lg': return 'max-w-lg';
    case 'xl': return 'max-w-xl';
    case 'full': return 'max-w-full h-full'; // Example for full screen
    default: return 'max-w-md';
  }
});

// Ensure body overflow reset on component unmount if modal was open
onUnmounted(() => {
  // Only reset if this instance was the one locking scroll
  // This check is basic; a more robust solution might involve a counter or store
  if (document.body.style.overflow === 'hidden') {
    document.body.style.overflow = '';
  }
});

</script>

<style scoped>
/* Fade transition for overlay */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Slide/Scale transition for modal content */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
