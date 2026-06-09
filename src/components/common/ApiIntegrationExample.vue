<template>
  <div class="api-integration-example">
    <h2 class="text-xl font-semibold mb-4">API Integration Example</h2>
    
    <div class="mb-4">
      <label class="inline-flex items-center">
        <input 
          type="checkbox" 
          v-model="useMockData" 
          class="form-checkbox h-5 w-5 text-blue-600"
          @change="toggleMockData"
        />
        <span class="ml-2">Use Mock Data</span>
      </label>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- API Endpoints List -->
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-lg font-medium mb-3">Available API Endpoints</h3>
        <div class="space-y-2">
          <button 
            v-for="endpoint in availableEndpoints" 
            :key="endpoint.name"
            @click="callEndpoint(endpoint)"
            class="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            {{ endpoint.name }}
          </button>
        </div>
      </div>
      
      <!-- API Response -->
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-lg font-medium mb-3">API Response</h3>
        <div v-if="loading" class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
        <div v-else-if="error" class="text-red-500 p-3 bg-red-50 rounded">
          <p class="font-medium">Error:</p>
          <p>{{ error }}</p>
        </div>
        <div v-else-if="response" class="overflow-auto max-h-96">
          <pre class="text-sm bg-gray-50 p-3 rounded">{{ JSON.stringify(response, null, 2) }}</pre>
        </div>
        <div v-else class="text-gray-500 flex justify-center items-center h-40">
          <p>Select an API endpoint to see the response</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { apiClient } from '@/services/apiGenerator';
import mockUsers from '@/mockData/users.json';

// State
const useMockData = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const response = ref<any>(null);
const authStore = useAuthStore();

// Define available endpoints
const availableEndpoints = [
  { 
    name: 'Get Current User', 
    call: async () => {
      // Example of using the API client with mock data
      const token = authStore.token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // This would normally use the generated API client
      // For demonstration, we'll use the existing getMe function
      const { getMe } = await import('@/services/apiService');
      return getMe(token);
    },
    mockData: { user: mockUsers[0] }
  },
  { 
    name: 'List Users', 
    call: async () => {
      const token = authStore.token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // This would normally use the generated API client
      // For demonstration, we'll use the existing getUsers function
      const { getUsers } = await import('@/services/apiService');
      return getUsers(token, { role: 'rider' });
    },
    mockData: { data: mockUsers }
  },
  // Add more endpoints as needed
];

// Toggle mock data usage
function toggleMockData() {
  apiClient.setUseMockData(useMockData.value);
}

// Call an API endpoint
async function callEndpoint(endpoint: typeof availableEndpoints[0]) {
  loading.value = true;
  error.value = null;
  response.value = null;
  
  try {
    if (useMockData.value) {
      // Use mock data
      response.value = endpoint.mockData;
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    } else {
      // Call real API
      response.value = await endpoint.call();
    }
  } catch (err) {
    console.error('API call failed:', err);
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
  } finally {
    loading.value = false;
  }
}

// Initialize
onMounted(() => {
  // Set initial mock data state
  apiClient.setUseMockData(useMockData.value);
});
</script>
