import './assets/main.css'
import './assets/toast.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import 'vue3-toastify/dist/index.css'

import App from './App.vue'
import VueApexCharts from 'vue3-apexcharts'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)


// Must be called AFTER app.use(pinia)
const authStore = useAuthStore();
try {
    authStore.loadAuthFromStorage();
} catch (error) {
    console.error("Failed to load auth state from storage:", error);
}

app.use(router)
app.use(VueApexCharts)

app.mount('#app')
