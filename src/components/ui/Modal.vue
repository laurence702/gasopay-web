<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div
        class="fixed inset-0 h-full w-full bg-gray-900/50 backdrop-blur-sm"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>
      <div class="relative z-10 w-full max-w-lg p-4">
        <slot name="body"></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">

defineProps<{
  isOpen: boolean
}>()

defineEmits(['close'])

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
