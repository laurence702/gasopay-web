<template>
  <div class="relative" ref="dropdownRef">
    <!-- Bell button -->
    <button
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      @click="toggleDropdown"
    >
      <span v-if="unreadCount > 0" class="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full" style="background-color:#00bf63;">
        <span class="absolute inline-flex w-full h-full rounded-full opacity-75 -z-1 animate-ping" style="background-color:#00bf63;"></span>
      </span>
      <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill=""/>
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen"
      class="absolute -right-[240px] mt-[17px] flex h-auto max-h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:w-[361px] lg:right-0 z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Notifications</h5>
          <span v-if="unreadCount > 0" class="px-1.5 py-0.5 text-xs font-bold rounded-full text-white" style="background-color:#00bf63;">
            {{ unreadCount }}
          </span>
        </div>
        <button @click="closeDropdown" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="fill-current" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill=""/>
          </svg>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-8 text-gray-400 text-sm gap-2">
        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        Loading…
      </div>

      <!-- Empty state -->
      <div v-else-if="!fetchError && notifications.length === 0" class="flex flex-col items-center justify-center py-10 gap-3">
        <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
      </div>

      <!-- Error -->
      <div v-else-if="fetchError" class="flex flex-col items-center justify-center py-8 gap-2">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ fetchError }}</p>
        <button @click="fetchNotifications" class="text-xs underline" style="color:#00bf63;">Retry</button>
      </div>

      <!-- Notification list -->
      <ul v-else class="flex flex-col overflow-y-auto custom-scrollbar flex-1">
        <li
          v-for="n in notifications"
          :key="n.id"
          @click="markRead(n)"
          class="flex gap-3 rounded-lg border-b border-gray-100 p-3 hover:bg-gray-50 cursor-pointer dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
          :class="{ 'opacity-60': n.read_at }"
        >
          <div class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <svg class="w-4 h-4" style="color:#00bf63;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-800 dark:text-white/90 leading-snug line-clamp-2">
              {{ n.data?.message ?? n.type ?? 'New notification' }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatTime(n.created_at) }}</p>
          </div>
          <div v-if="!n.read_at" class="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style="background-color:#00bf63;"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import apiService from '@/services/apiService'
import { useAuthStore } from '@/stores/auth'

interface ApiNotification {
  id: string
  type: string
  data?: { message?: string; [key: string]: unknown }
  read_at: string | null
  created_at: string
}

const authStore = useAuthStore()
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownOpen = ref(false)
const loading = ref(false)
const fetchError = ref('')
const notifications = ref<ApiNotification[]>([])

const unreadCount = computed(() => notifications.value.filter(n => !n.read_at).length)

const formatTime = (iso: string) => {
  try {
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return d.toLocaleDateString()
  } catch { return '' }
}

const fetchNotifications = async () => {
  const token = authStore.token
  if (!token) return
  loading.value = true
  fetchError.value = ''
  try {
    const res = await apiService.get<{ data: ApiNotification[] }>('/notifications', token)
    notifications.value = Array.isArray(res.data) ? res.data : []
  } catch {
    fetchError.value = 'Could not load notifications.'
    notifications.value = []
  } finally {
    loading.value = false
  }
}

const markRead = async (n: ApiNotification) => {
  if (n.read_at) return
  try {
    const token = authStore.token
    if (!token) return
    await apiService.put(`/notifications/${n.id}`, { read: true }, token)
    n.read_at = new Date().toISOString()
  } catch { /* silently fail */ }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) fetchNotifications()
}

const closeDropdown = () => { dropdownOpen.value = false }

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) closeDropdown()
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
