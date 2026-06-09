<template>
  <div>
    <label v-if="label" :for="selectId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue" @input="updateValue"
        :required="required"
        :disabled="disabled"
        :class="[
            'form-input', // Reusing same base style as input
             { 'border-error-500 dark:border-error-400': !!error },
             { 'text-gray-400 dark:text-gray-500': !modelValue } // Style placeholder option
        ]"
      >
        <!-- Optional Placeholder Option -->
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <!-- Options from prop or slot -->
        <slot>
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </slot>
      </select>
       <!-- Simple dropdown arrow -->
       <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
         <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
       </span>
    </div>
    <p v-if="error" class="mt-1 text-xs text-error-500 dark:text-error-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import type { PropType } from 'vue';

type SelectOption = {
  value: string | number;
  text: string;
};

// Reverting to standard defineProps object syntax
const props = defineProps({
  modelValue: {
    type: [String, Number, null] as PropType<string | number | null>,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    required: false,
  },
  selectId: {
    type: String,
    default: () => `select-${Math.random().toString(36).substring(2, 9)}`,
  },
});

const emit = defineEmits(['update:modelValue']);

// Update function for v-model
const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLSelectElement).value);
};

</script>

<style scoped>
/* Reusing styles defined in BaseInput.vue via global css or duplicating relevant parts */
</style> 