<template>
  <div
    class="flex flex-col justify-between p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-full"
  >
    <div>
      <!-- Optional Icon -->
      <div v-if="icon" class="mb-3 text-brand-500 dark:text-brand-400">
        <component :is="icon" class="w-6 h-6" />
      </div>

      <!-- Title -->
      <h5 class="mb-1 text-xs font-medium tracking-tight text-gray-500 uppercase dark:text-gray-400">
        {{ title }}
      </h5>

      <!-- Main Value -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-2xl font-semibold text-gray-900 dark:text-white">{{ value }}</span>
        <!-- Optional Change Indicator -->
        <span
          v-if="change"
          :class="[
            'text-xs font-medium px-2 py-0.5 rounded',
            changeType === 'increase' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
            changeType === 'decrease' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          ]"
        >
          {{ change }}
        </span>
      </div>

      <!-- Optional Secondary Info (e.g., Registered Riders Breakdown) -->
      <div v-if="secondaryInfo && secondaryInfo.length > 0" class="mt-2 mb-3 space-y-1">
        <div v-for="(info, index) in secondaryInfo" :key="index" class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">{{ info.label }}</span>
          <span
             :class="[
                'font-medium',
                info.color ? `text-${info.color}-600 dark:text-${info.color}-400` : 'text-gray-700 dark:text-gray-300'
             ]"
          >
            {{ info.value }}
           </span>
        </div>
      </div>

      <!-- Optional View Link (e.g., View Breakdown) -->
       <div v-if="viewLink" class="mt-2 mb-3">
         <router-link
           v-if="typeof viewLink === 'string' || (typeof viewLink === 'object' && viewLink.path)"
           :to="typeof viewLink === 'string' ? viewLink : viewLink.path"
           class="text-sm font-medium text-brand-600 hover:underline dark:text-brand-500"
         >
           View Breakdown
         </router-link>
          <button
             v-else-if="typeof viewLink === 'function'"
             @click="viewLink"
             class="text-sm font-medium text-brand-600 hover:underline dark:text-brand-500 focus:outline-none"
           >
             View Breakdown
           </button>
       </div>
    </div>

    <!-- Optional Action Buttons (e.g., Daily/Weekly/Monthly) -->
    <div v-if="actions && actions.length > 0" class="flex mt-auto pt-3 -mx-1">
      <button
        v-for="action in actions"
        :key="action"
        @click="handleActionClick(action)"
        :class="[
            'flex-1 mx-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none',
            selectedAction === action
                ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
        ]"
      >
        {{ action }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType, FunctionalComponent, Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router';

type SecondaryInfo = {
  label: string;
  value: string | number;
  color?: string; // e.g., 'green', 'red'
}

// Define a more specific type for the icon prop
type IconComponent = FunctionalComponent | Component

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: Object as PropType<IconComponent>, // Use the specific IconComponent type
    required: false,
  },
  change: {
    type: String,
    required: false,
  },
  changeType: {
    type: String as PropType<'increase' | 'decrease'>,
    required: false,
  },
  secondaryInfo: {
    type: Array as PropType<SecondaryInfo[]>,
    required: false,
    default: () => [],
  },
  actions: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },
  actionCallback: {
    type: Function as PropType<(action: string) => void>,
    required: false,
  },
   viewLink: {
     type: [String, Object, Function] as PropType<string | { path: RouteLocationRaw } | (() => void)>,
     required: false,
   },
});

const selectedAction = ref<string | null>(props.actions?.length ? props.actions[0] : null); // Default to first action

const handleActionClick = (action: string) => {
  selectedAction.value = action;
  if (props.actionCallback) {
    props.actionCallback(action);
  }
};

</script>

<style scoped>
/* Add any additional scoped styles if needed */
</style> 