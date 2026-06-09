<template>
  <div class="api-generator p-4 bg-white rounded shadow">
    <h2 class="text-xl font-semibold mb-4">API Client Generator</h2>
    
    <div class="mb-6">
      <p class="text-gray-700 mb-2">
        This tool automatically generates TypeScript API client code from the Postman collection in <code>/guide/gasopay.json</code>.
      </p>
      <p class="text-gray-700 mb-4">
        The generated code will include typed functions for all API endpoints defined in the collection.
      </p>
    </div>
    
    <div class="flex flex-col space-y-4">
      <div class="flex items-center">
        <label class="inline-flex items-center mr-6">
          <input 
            type="checkbox" 
            v-model="includeInterfaces" 
            class="form-checkbox h-5 w-5 text-blue-600"
          />
          <span class="ml-2">Include TypeScript Interfaces</span>
        </label>
        
        <label class="inline-flex items-center">
          <input 
            type="checkbox" 
            v-model="includeMockData" 
            class="form-checkbox h-5 w-5 text-blue-600"
          />
          <span class="ml-2">Include Mock Data Support</span>
        </label>
      </div>
      
      <div class="flex space-x-4">
        <button 
          @click="generateApiClient"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          :disabled="generating"
        >
          <span v-if="generating">Generating...</span>
          <span v-else>Generate API Client</span>
        </button>
        
        <button 
          @click="previewCode"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          :disabled="generating || !generatedCode"
        >
          Preview Code
        </button>
      </div>
    </div>
    
    <!-- Status message -->
    <div v-if="statusMessage" class="mt-4 p-3 rounded" :class="statusClass">
      {{ statusMessage }}
    </div>
    
    <!-- API Integration Status -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-4">API Integration Status</h3>
      
      <div class="flex mb-4">
        <button 
          @click="activeTab = 'all'"
          class="px-4 py-2 rounded-l"
          :class="activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'"
        >
          All Endpoints ({{ allEndpoints.length }})
        </button>
        <button 
          @click="activeTab = 'integrated'"
          class="px-4 py-2"
          :class="activeTab === 'integrated' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'"
        >
          Integrated ({{ integratedEndpointsCount }})
        </button>
        <button 
          @click="activeTab = 'pending'"
          class="px-4 py-2 rounded-r"
          :class="activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'"
        >
          Pending ({{ pendingEndpointsCount }})
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th class="py-2 px-4 border-b text-left">Name</th>
              <th class="py-2 px-4 border-b text-left">Method</th>
              <th class="py-2 px-4 border-b text-left">Path</th>
              <th class="py-2 px-4 border-b text-left">Status</th>
              <th class="py-2 px-4 border-b text-left">Mock Data</th>
              <th class="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="endpoint in filteredEndpoints" :key="`${endpoint.method}:${endpoint.path}`" class="border-b">
              <td class="py-2 px-4">{{ endpoint.name }}</td>
              <td class="py-2 px-4">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium uppercase"
                  :class="{
                    'bg-green-100 text-green-800': endpoint.method === 'get',
                    'bg-blue-100 text-blue-800': endpoint.method === 'post',
                    'bg-yellow-100 text-yellow-800': endpoint.method === 'put',
                    'bg-red-100 text-red-800': endpoint.method === 'delete'
                  }"
                >
                  {{ endpoint.method }}
                </span>
              </td>
              <td class="py-2 px-4">{{ endpoint.path }}</td>
              <td class="py-2 px-4">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="endpoint.integrated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ endpoint.integrated ? 'Integrated' : 'Pending' }}
                </span>
              </td>
              <td class="py-2 px-4">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="endpoint.mockDataAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ endpoint.mockDataAvailable ? 'Available' : 'Not Available' }}
                </span>
              </td>
              <td class="py-2 px-4">
                <button 
                  @click="toggleEndpointStatus(endpoint)"
                  class="px-3 py-1 text-xs rounded"
                  :class="endpoint.integrated ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'"
                >
                  {{ endpoint.integrated ? 'Mark as Pending' : 'Mark as Integrated' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Components Using Mock Data -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Components Using Mock Data</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th class="py-2 px-4 border-b text-left">Component</th>
              <th class="py-2 px-4 border-b text-left">Path</th>
              <th class="py-2 px-4 border-b text-left">Mock Data Used</th>
              <th class="py-2 px-4 border-b text-left">API Endpoint</th>
              <th class="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(component, index) in componentsUsingMockData" :key="index" class="border-b">
              <td class="py-2 px-4">{{ component.name }}</td>
              <td class="py-2 px-4">{{ component.path }}</td>
              <td class="py-2 px-4">{{ component.mockDataUsed }}</td>
              <td class="py-2 px-4">{{ component.apiEndpoint }}</td>
              <td class="py-2 px-4">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="component.integrated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ component.integrated ? 'Integrated' : 'Needs Integration' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Code preview modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-3/4 h-3/4 flex flex-col">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-medium">Generated API Client Code</h3>
          <button @click="showPreview = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-auto p-4 bg-gray-50">
          <pre class="text-sm"><code>{{ generatedCode }}</code></pre>
        </div>
        <div class="p-4 border-t flex justify-end">
          <button 
            @click="downloadCode"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { generateApiClient as generateApiClientCode, apiClient, type EndpointStatus } from '@/services/apiGenerator';
import { generateApiClientFile } from '@/services/generateApi';

// State
const includeInterfaces = ref(true);
const includeMockData = ref(true);
const generating = ref(false);
const statusMessage = ref('');
const statusClass = ref('');
const generatedCode = ref('');
const showPreview = ref(false);
const activeTab = ref('all'); // 'all', 'integrated', or 'pending'

// Endpoint statuses
const allEndpoints = ref<EndpointStatus[]>([]);

// Filtered endpoints based on active tab
const filteredEndpoints = computed(() => {
  switch (activeTab.value) {
    case 'integrated':
      return allEndpoints.value.filter(endpoint => endpoint.integrated);
    case 'pending':
      return allEndpoints.value.filter(endpoint => !endpoint.integrated);
    default:
      return allEndpoints.value;
  }
});

// Counts for tab badges
const integratedEndpointsCount = computed(() => allEndpoints.value.filter(endpoint => endpoint.integrated).length);
const pendingEndpointsCount = computed(() => allEndpoints.value.filter(endpoint => !endpoint.integrated).length);

// Components using mock data
const componentsUsingMockData = ref([
  {
    name: 'EcommerceMetrics',
    path: 'web/src/components/ecommerce/EcommerceMetrics.vue',
    mockDataUsed: 'Hardcoded values',
    apiEndpoint: 'GET /branch-admin/statistics',
    integrated: false
  },
  {
    name: 'RecentOrders',
    path: 'web/src/components/ecommerce/RecentOrders.vue',
    mockDataUsed: 'Hardcoded product list',
    apiEndpoint: 'GET /orders',
    integrated: false
  },
  {
    name: 'StatisticsChart',
    path: 'web/src/components/ecommerce/StatisticsChart.vue',
    mockDataUsed: 'Hardcoded chart data',
    apiEndpoint: 'GET /branch-admin/statistics',
    integrated: false
  },
  {
    name: 'MonthlyTarget',
    path: 'web/src/components/ecommerce/MonthlySale.vue',
    mockDataUsed: 'Hardcoded sales data',
    apiEndpoint: 'GET /branch-admin/statistics',
    integrated: false
  },
  {
    name: 'CustomerDemographic',
    path: 'web/src/components/ecommerce/CustomerDemographic.vue',
    mockDataUsed: 'Hardcoded demographic data',
    apiEndpoint: 'GET /users?role=rider',
    integrated: false
  },
  {
    name: 'RiderList',
    path: 'web/src/views/Admin/RiderList.vue',
    mockDataUsed: 'users.json',
    apiEndpoint: 'GET /users?role=rider',
    integrated: false
  },
  {
    name: 'PendingRegistrations',
    path: 'web/src/views/Admin/PendingRegistrations.vue',
    mockDataUsed: 'users.json',
    apiEndpoint: 'GET /branch-admin/pending-approvals',
    integrated: false
  },
  {
    name: 'OrderHistory',
    path: 'web/src/views/BranchAdmin/OrderHistory.vue',
    mockDataUsed: 'transactions.json',
    apiEndpoint: 'GET /branch-admin/orders/history',
    integrated: false
  },
  {
    name: 'ProductManagement',
    path: 'web/src/views/SuperAdmin/ProductManagement.vue',
    mockDataUsed: 'products.json',
    apiEndpoint: 'GET /products',
    integrated: false
  }
]);

// Generate API client
async function generateApiClient() {
  generating.value = true;
  statusMessage.value = 'Generating API client...';
  statusClass.value = 'bg-blue-100 text-blue-800';
  
  try {
    // In a real implementation, we would pass the options to the generator
    // For now, we'll just use the default implementation
    generatedCode.value = generateApiClientCode();
    
    statusMessage.value = 'API client generated successfully!';
    statusClass.value = 'bg-green-100 text-green-800';
  } catch (error) {
    console.error('Error generating API client:', error);
    statusMessage.value = `Error generating API client: ${error instanceof Error ? error.message : 'Unknown error'}`;
    statusClass.value = 'bg-red-100 text-red-800';
  } finally {
    generating.value = false;
  }
}

// Preview generated code
function previewCode() {
  if (generatedCode.value) {
    showPreview.value = true;
  }
}

// Download generated code
function downloadCode() {
  generateApiClientFile();
  showPreview.value = false;
}

// Toggle endpoint integration status
function toggleEndpointStatus(endpoint: EndpointStatus) {
  apiClient.markEndpointIntegration(endpoint.method, endpoint.path, !endpoint.integrated);
  
  // Update the local state
  const index = allEndpoints.value.findIndex(
    e => e.method === endpoint.method && e.path === endpoint.path
  );
  
  if (index !== -1) {
    allEndpoints.value[index].integrated = !endpoint.integrated;
  }
  
  // Also update the components using mock data if applicable
  const componentIndex = componentsUsingMockData.value.findIndex(
    c => c.apiEndpoint.toLowerCase().includes(endpoint.path.toLowerCase())
  );
  
  if (componentIndex !== -1) {
    componentsUsingMockData.value[componentIndex].integrated = !endpoint.integrated;
  }
  
  // Provide feedback to the user
  statusMessage.value = `Endpoint "${endpoint.name}" marked as ${endpoint.integrated ? 'Pending' : 'Integrated'}`;
  statusClass.value = 'bg-green-100 text-green-800';
}

// Initialize endpoint statuses
onMounted(() => {
  allEndpoints.value = apiClient.getAllEndpointStatuses();
});
</script>
