<template>
  <div class="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
    <!-- Optional Header Actions -->
    <div v-if="$slots['header-actions']" class="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
      <slot name="header-actions"></slot>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-sm bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
              :class="{ 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700': column.sortable }"
              @click="column.sortable ? sortBy(column.key) : null"
            >
              <div class="flex items-center">
                {{ column.label }}
                <span v-if="column.sortable" class="ml-1.5">
                   <svg v-if="sortKey === column.key && sortDirection === 'asc'" class="w-3 h-3 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
                   <svg v-else-if="sortKey === column.key && sortDirection === 'desc'" class="w-3 h-3 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                   <svg v-else class="w-3 h-3 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" /></svg> <!-- Placeholder for unsorted -->
                </span>
              </div>
            </th>
            <!-- Optional Actions Header -->
            <th v-if="$slots.actions" scope="col" class="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Loading State -->
          <tr v-if="loading">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="p-6 text-center">
              <div class="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
                 <svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 <span>Loading data...</span>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="!data || data.length === 0">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="p-6 text-center text-gray-500 dark:text-gray-400">
              <slot name="empty-state">
                {{ emptyStateMessage || 'No data available.' }}
              </slot>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr v-else v-for="(row, rowIndex) in paginatedData" :key="rowIndex" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-gray-700 whitespace-nowrap dark:text-gray-300"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
            <!-- Optional Actions Cell -->
            <td v-if="$slots.actions" class="px-4 py-3 text-right whitespace-nowrap">
              <slot name="actions" :row="row"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Optional Pagination -->
    <div
        v-if="showPagination && totalPages > 1"
        class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ (localCurrentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(localCurrentPage * itemsPerPage, totalItems) }} of {{ totalItems }} results
      </div>
      <div class="flex items-center space-x-1">
        <button
          @click="changePage(localCurrentPage - 1)"
          :disabled="localCurrentPage === 1"
          class="px-2.5 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Previous
        </button>
        <!-- Page Numbers (simplified example) -->
         <span v-for="page in paginationRange" :key="page">
           <button
             v-if="page !== '...'"
             @click="changePage(page as number)"
             :class="[
               'px-2.5 py-1 text-sm font-medium border rounded-md mx-0.5',
               page === localCurrentPage
                 ? 'bg-brand-500 border-brand-500 text-white dark:bg-brand-600 dark:border-brand-600'
                 : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
             ]"
           >
             {{ page }}
           </button>
           <span v-else class="px-2.5 py-1 text-sm font-medium text-gray-400 dark:text-gray-500">...</span>
         </span>

        <button
          @click="changePage(localCurrentPage + 1)"
          :disabled="localCurrentPage === totalPages"
          class="px-2.5 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits } from 'vue';
import type { PropType } from 'vue';
import type { ColumnDefinition, TableRow, SortDirection } from '@/types/table'; // Import from global types

const props = defineProps({
  columns: {
    type: Array as PropType<ColumnDefinition[]>,
    required: true,
  },
  data: {
    type: Array as PropType<TableRow[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showPagination: {
    type: Boolean,
    default: false,
  },
  itemsPerPage: {
    type: Number,
    default: 10, // Default items per page
  },
  totalItems: {
    type: Number,
    required: true, // Required for pagination display
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  emptyStateMessage: {
    type: String,
    default: 'No data available.',
  },
});

const emit = defineEmits(['update:currentPage', 'sort']);

const sortKey = ref<string | null>(null);
const sortDirection = ref<SortDirection>(null);
// Use a local ref for currentPage to manage internal state changes
const localCurrentPage = ref(props.currentPage);

// Watch for external changes to currentPage prop
watch(() => props.currentPage, (newPage) => {
  localCurrentPage.value = newPage;
});

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
  emit('sort', { key: sortKey.value, direction: sortDirection.value });
};

// --- Pagination Logic ---
const totalPages = computed(() => {
  if (!props.totalItems || props.itemsPerPage <= 0) return 1;
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    localCurrentPage.value = page;
    emit('update:currentPage', page);
  }
};

// Simplified pagination range (e.g., 1 ... 4 5 6 ... 10)
const paginationRange = computed(() => {
  const range: (number | string)[] = [];
  const delta = 1; // Number of pages around current page
  const left = localCurrentPage.value - delta;
  const right = localCurrentPage.value + delta + 1;
  let l: number | null = null;

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= left && i < right)) {
      if (l !== null && i - l === 2) {
        range.push(l + 1);
      } else if (l !== null && i - l !== 1) {
        range.push('...');
      }
      range.push(i);
      l = i;
    }
  }
  return range;
});

// Paginated data (assumes client-side pagination if totalItems matches data.length)
// For server-side pagination, the parent component should pass the correctly sliced data
const paginatedData = computed(() => {
    if (!props.showPagination || props.totalItems !== props.data.length) {
        // If pagination is off or totalItems suggests server-side pagination, return raw data
        return props.data;
    }
    // Client-side pagination logic
    const start = (localCurrentPage.value - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return props.data.slice(start, end);
});

</script>

<style scoped>
/* Scoped styles for the table */
</style>
