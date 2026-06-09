<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm fixed w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img src="/src/assets/images/GASOPAY-orange.svg" alt="gasopay-logo" height="10px">
            <!-- <Fuel class="h-8 w-8 text-blue-600" />
            <span class="ml-2 text-2xl font-bold text-gray-900">Gasopay</span> -->
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#products" class="text-gray-600 hover:text-gray-900">Products</a>
            <a href="#about" class="text-gray-600 hover:text-gray-900">About</a>
            <a href="#contact" class="text-gray-600 hover:text-gray-900">Contact</a>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative bg-white pt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Smart Fuel Solutions for Modern Business
            </h1>
            <p class="mt-6 text-xl text-gray-600">
              Streamline your fuel management with Gasopay. We offer seamless payments and delivery for LPG, CNG, and petroleum products.
            </p>
            <div class="mt-8 flex space-x-4">
                <router-link to="/signup">
                    <button class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700">
                         Sign Up
                    </button>
                </router-link>
                <router-link to="/signin">
                    <button class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50">
                        Sign In
                    </button>
                </router-link>
            </div>
          </div>
          <div class="relative h-96">
            <img 
              src="/src/assets/images/lpg-truck.png"
              alt="Modern gas station"
              class="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Why Choose Gasopay?</h2>
          <p class="mt-4 text-xl text-gray-600">Experience the future of fuel management</p>
        </div>
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-sm">
            <Wallet class="h-12 w-12 text-blue-600" />
            <h3 class="mt-6 text-xl font-semibold text-gray-900">Quick Payments</h3>
            <p class="mt-4 text-gray-600">Safe and seamless transactions for all your fuel purchases</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-sm">
            <Truck class="h-12 w-12 text-blue-600" />
            <h3 class="mt-6 text-xl font-semibold text-gray-900">Fast Delivery</h3>
            <p class="mt-4 text-gray-600">Quick and reliable delivery to your location</p>
          </div>
          <div class="bg-white p-8 rounded-xl shadow-sm">
            <LineChart class="h-12 w-12 text-blue-600" />
            <h3 class="mt-6 text-xl font-semibold text-gray-900">Usage Analytics</h3>
            <p class="mt-4 text-gray-600">Track and optimize your consumption</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div id="products" class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center">Our Products</h2>
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="relative group">
            <img 
              src="/src/assets/images/lpg-truck.png"
              alt="LPG cylinders"
              class="w-full h-64 object-cover rounded-xl"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl">
              <div class="absolute bottom-6 left-6">
                <h3 class="text-xl font-semibold text-white">LPG</h3>
                <!-- <p class="text-gray-200 mt-2">Clean and efficient cooking gas</p> -->
              </div>
            </div>
          </div>
          <div class="relative group">
            <img 
              src="/src/assets/images/CNG-keke.webp"
              alt="CNG station"
              class="w-full h-64 object-cover rounded-xl"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl">
              <div class="absolute bottom-6 left-6">
                <h3 class="text-xl font-semibold text-white">CNG</h3>
                <!-- <p class="text-gray-200 mt-2">Eco-friendly vehicle fuel</p> -->
              </div>
            </div>
          </div>
          <div class="relative group">
            <img 
              src="/src/assets/images/Fuel-pump-860x519.jpg"
              alt="Petroleum station"
              class="w-full h-64 object-cover rounded-xl"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl">
              <div class="absolute bottom-6 left-6">
                <h3 class="text-xl font-semibold text-white">Petroleum</h3>
                <!-- <p class="text-gray-200 mt-2">High-quality fuel products</p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div id="contact" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p class="mt-4 text-xl text-gray-600">Have questions? We're here to help!</p>
            <div class="mt-8 space-y-6">
              <div class="flex items-center">
                <MapPin class="h-6 w-6 text-blue-600" />
                <span class="ml-4 text-gray-600">123 Uromi street, Benin City, Edo State</span>
              </div>
              <div class="flex items-center">
                <Phone class="h-6 w-6 text-blue-600" />
                <span class="ml-4 text-gray-600">+1 234 567 890</span>
              </div>
              <div class="flex items-center">
                <Mail class="h-6 w-6 text-blue-600" />
                <span class="ml-4 text-gray-600">contact@gasopay.com</span>
              </div>
            </div>
          </div>
          <form class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Message</label>
              <textarea rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
            <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center">
                <img src="/src/assets/images/GASOPAY-orange.svg" alt="site-logo">
              <span class="ml-2 text-2xl font-bold">
                <!-- <img src="/src/assets/images/main_logo.svg" alt="site-logo"> -->
              </span>
            </div>
            <p class="mt-4 text-gray-400">Your trusted partner for smart fuel solutions</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold">Products</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">LPG</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">CNG</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Petroleum</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold">Company</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold">Legal</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">Privacy</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Terms</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Security</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-12 border-t border-gray-800 pt-8">
          <p class="text-center text-gray-400">&copy; 2025 Gasopay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Fuel, Wallet, Truck, LineChart, MapPin, Phone, Mail } from 'lucide-vue-next'
</script> 