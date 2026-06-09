<template>
  <div>
    <label v-if="label" :for="inputId" 
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" 
    >
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue ?? ''" @input="updateValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autocomplete"
        :class="[
            // Directly applied Tailwind classes for form-input
            'block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:cursor-not-allowed disabled:opacity-50 dark:disabled:bg-gray-800',
            // Conditional classes
            { 'pl-10': hasIconLeft },
            { 'pr-10': hasIconRight || type === 'password' },
            { 'border-error-500 dark:border-error-400': !!error }
        ]"
      />
      <!-- Left Icon Slot -->
      <span v-if="hasIconLeft" class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
        <slot name="icon-left"></slot>
      </span>

      <!-- Right Icon Slot (or Password Toggle) -->
       <span v-if="hasIconRight || type === 'password'" class="absolute inset-y-0 right-0 flex items-center pr-3">
         <slot name="icon-right">
           <!-- Default password toggle -->
           <button
              v-if="type === 'password'"
              type="button"
              @click="togglePasswordVisibility"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
              aria-label="Toggle password visibility"
           >
                <svg v-if="!isPasswordVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .615 0 1.214.055 1.792.158m4.491 4.491a3.001 3.001 0 01-4.136 4.136M19.542 12c-.274 1.01-.69 1.955-1.21 2.792M6.208 6.208c1.667-1.243 3.757-2.043 6.012-2.092M17.792 17.792a10.014 10.014 0 01-1.825 1.033M4.208 4.208L19.792 19.792"></path></svg>
           </button>
         </slot>
       </span>
    </div>
    <p v-if="error" class="mt-1 text-xs text-error-500 dark:text-error-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, defineEmits, withDefaults } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: string | number | null | undefined; // Explicitly allow undefined
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  error?: string; // Error message to display
  inputId?: string;
  maxlength?: number;
  minlength?: number;
  autocomplete?: string;
}>(), {
  type: 'text', // Default type
  required: false,
  disabled: false,
  readonly: false,
  inputId: () => `input-${Math.random().toString(36).substring(2, 9)}`,
});

const emit = defineEmits(['update:modelValue']);

const slots = useSlots();
const hasIconLeft = computed(() => !!slots['icon-left']);
const hasIconRight = computed(() => !!slots['icon-right']);

const isPasswordVisible = ref(false);

const internalType = ref(props.type);

// Update function for v-model
const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

const togglePasswordVisibility = () => {
    if (internalType.value === 'password') {
        internalType.value = 'text';
        isPasswordVisible.value = true;
    } else {
        internalType.value = 'password';
        isPasswordVisible.value = false;
    }
}

// Use internalType for the input type binding to allow password toggle
const type = computed(() => {
    return props.type === 'password' ? internalType.value : props.type;
})

</script>

<style scoped>
/* Styles removed - applied directly in template */
</style> 