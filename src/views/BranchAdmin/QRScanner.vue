<template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div class="space-y-5">
      <BaseCard>
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">Scan Rider QR Code</h2>
          
          <div class="flex flex-col items-center justify-center space-y-6">
            <!-- QR Scanner Container -->
            <div 
              ref="videoContainer" 
              class="relative w-full max-w-md h-80 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
            >
              <div v-if="!hasCamera" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div class="text-center p-6">
                  <ExclamationTriangleIcon class="h-12 w-12 text-warning-500 mx-auto mb-3" />
                  <p class="text-gray-700 dark:text-gray-300 mb-2">No camera found or permission was denied.</p>
                  <p class="text-gray-500 dark:text-gray-400 text-sm">Please check your camera permissions and try again.</p>
                </div>
              </div>
              
              <div v-else-if="!isScanning" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div class="text-center p-6">
                  <QrCodeIcon class="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p class="text-gray-700 dark:text-gray-300 mb-2">Camera is ready.</p>
                  <button
                    @click="startScanner"
                    class="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
                  >
                    Start Scanning
                  </button>
                </div>
              </div>
              
              <video
                v-show="isScanning"
                ref="video"
                class="w-full h-full object-cover"
                autoplay
                playsinline
              ></video>
              
              <!-- Scanning overlay with animation -->
              <div v-if="isScanning" class="absolute inset-0 pointer-events-none">
                <div class="relative w-full h-full">
                  <div class="absolute inset-0 border-2 border-brand-500/30 rounded-lg"></div>
                  <div class="absolute top-0 left-0 right-0 border-t-2 border-brand-500 rounded-t-lg animate-scan"></div>
                </div>
              </div>
            </div>
            
            <!-- Manual Entry Option -->
            <div class="w-full max-w-md">
              <div class="relative">
                <input
                  v-model="manualRiderId"
                  type="text"
                  placeholder="Or enter rider ID manually..."
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  @click="navigateToRiderProfile(manualRiderId)"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none"
                  :disabled="!manualRiderId"
                >
                  Go
                </button>
              </div>
            </div>
            
            <!-- Controls -->
            <div v-if="isScanning" class="flex space-x-4">
              <button
                @click="toggleFlash"
                class="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              >
                <LightBulbIcon class="h-5 w-5 mr-2" />
                {{ isFlashOn ? 'Turn Flash Off' : 'Turn Flash On' }}
              </button>
              
              <button
                @click="stopScanner"
                class="flex items-center px-4 py-2 bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-400 rounded-lg hover:bg-error-200 dark:hover:bg-error-800/30 focus:outline-none"
              >
                <StopIcon class="h-5 w-5 mr-2" />
                Stop Scanning
              </button>
            </div>
          </div>
          
          <!-- Results and scan history -->
          <div v-if="scanResults.length > 0" class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Recent Scans</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rider ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scanned At</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(result, index) in scanResults" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ result.riderId }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm text-gray-500 dark:text-gray-400">{{ result.timestamp }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button
                        @click="navigateToRiderProfile(result.riderId)"
                        class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:border-brand-700 focus:ring-brand-500 active:bg-brand-700 transition duration-150 ease-in-out"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { 
  ExclamationTriangleIcon, 
  LightBulbIcon, 
  StopIcon,
  QrCodeIcon
} from '@heroicons/vue/24/solid';

// Define component name
defineOptions({
  name: 'BranchAdminQRScanner'
});

const router = useRouter();
const currentPageTitle = ref('QR Scanner');
const videoContainer = ref<HTMLDivElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);
const isScanning = ref(false);
const hasCamera = ref(true);
const isFlashOn = ref(false);
const manualRiderId = ref('');
const scanResults = ref<{ riderId: string; timestamp: string }[]>([]);

// Track stream and scanner to clean up
let stream: MediaStream | null = null;

async function startScanner() {
  try {
    // In a real implementation, we would use a QR scanning library
    // For this mock, we'll simulate a successful scan after a delay
    isScanning.value = true;
    
    // Get camera stream
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    
    if (video.value) {
      video.value.srcObject = stream;
    }
    
    // Simulate a QR code scan after 5 seconds
    setTimeout(() => {
      const mockRiderId = 'R' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      handleScanResult(mockRiderId);
    }, 5000);
    
  } catch (error) {
    console.error('Error starting scanner:', error);
    hasCamera.value = false;
    isScanning.value = false;
  }
}

function stopScanner() {
  isScanning.value = false;
  isFlashOn.value = false;
  
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  
  if (video.value) {
    video.value.srcObject = null;
  }
}

function toggleFlash() {
  // In a real implementation, we would toggle the flash of the camera
  // For this mock, we'll just toggle the state
  isFlashOn.value = !isFlashOn.value;
  
  if (stream) {
    const track = stream.getVideoTracks()[0];
    // This would require proper type definitions for torch capabilities
    // which aren't standard in all browsers
    try {
      // Using any here because torch isn't in the standard MediaTrackCapabilities type
      const capabilities = track.getCapabilities() as any;
      if (capabilities?.torch) {
        // Using any because torch isn't in the standard MediaTrackConstraintSet type
        track.applyConstraints({
          advanced: [{ torch: isFlashOn.value } as any]
        }).catch(err => console.error('Error applying constraints:', err));
      }
    } catch (error) {
      console.error('Flash not supported:', error);
    }
  }
}

function handleScanResult(riderId: string) {
  // Add to scan history
  scanResults.value.unshift({
    riderId,
    timestamp: new Date().toLocaleTimeString()
  });
  
  // Keep only last 5 scans
  if (scanResults.value.length > 5) {
    scanResults.value = scanResults.value.slice(0, 5);
  }
  
  // Stop scanning
  stopScanner();
  
  // Navigate to rider profile
  navigateToRiderProfile(riderId);
}

function navigateToRiderProfile(riderId: string) {
  if (!riderId) return;
  
  // Navigate to rider profile
  router.push(`/admin/rider-profile/${riderId}`);
}

onMounted(() => {
  // Check if camera is supported
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    hasCamera.value = false;
  }
});

onBeforeUnmount(() => {
  // Clean up resources
  stopScanner();
});
</script>

<style scoped>
.animate-scan {
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style> 