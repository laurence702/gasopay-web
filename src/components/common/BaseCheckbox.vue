<template>
  <label :for="checkboxId" class="flex items-center cursor-pointer select-none">
    <div class="relative">
      <input
        :id="checkboxId"
        type="checkbox"
        :checked="modelValue"
        @change="updateValue"
        :required="required"
        :disabled="disabled"
        class="sr-only"
      />
      <div
        :class="[
            'mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] transition-colors',
            modelValue
                ? 'border-brand-500 bg-brand-500 dark:border-brand-600 dark:bg-brand-600'
                : 'bg-transparent border-gray-300 dark:border-gray-700',
            { 'opacity-50 cursor-not-allowed': disabled }
        ]"
      >
        <!-- Checkmark Icon -->
        <span :class="modelValue ? 'opacity-100' : 'opacity-0'" class="transition-opacity">
          <svg
            width="11"
            height="11"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="text-white"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="currentColor"
              stroke-width="1.94437"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
    <!-- Label Text Slot -->
    <span v-if="label || $slots.default" class="text-sm font-normal text-gray-700 dark:text-gray-400">
      <slot>{{ label }}</slot>
       <span v-if="required" class="ml-1 text-error-500">*</span>
    </span>
  </label>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
  modelValue: boolean;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  checkboxId?: string;
}>(), {
  required: false,
  disabled: false,
  checkboxId: () => `checkbox-${Math.random().toString(36).substring(2, 9)}`,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked);
};
</script>

<style scoped>
/* Add any specific checkbox styles if needed, but Tailwind handles most */
</style> 