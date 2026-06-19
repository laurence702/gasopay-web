<template>
  <PageBreadcrumb pageTitle="Support" />

  <div class="max-w-lg mx-auto space-y-5">
    <!-- WhatsApp CTA -->
    <BaseCard>
      <div class="p-6 text-center">
        <div class="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.543 4.063 1.492 5.77L.057 23.857a.5.5 0 0 0 .612.612l6.086-1.435A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.93 0-3.74-.525-5.283-1.437l-.374-.22-3.874.913.913-3.874-.22-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Chat With Us on WhatsApp</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-5">
          Our support team is available Mon–Sat, 8am–6pm. We typically reply within minutes.
        </p>
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-md"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.543 4.063 1.492 5.77L.057 23.857a.5.5 0 0 0 .612.612l6.086-1.435A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.93 0-3.74-.525-5.283-1.437l-.374-.22-3.874.913.913-3.874-.22-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Open WhatsApp
        </a>
      </div>
    </BaseCard>

    <!-- Contact info -->
    <BaseCard>
      <div class="p-5 space-y-4">
        <h3 class="font-semibold text-gray-800 dark:text-white">Other Ways to Reach Us</h3>
        <div class="flex items-center gap-3 text-sm">
          <EnvelopeIcon class="h-5 w-5 text-brand-500 flex-shrink-0" />
          <a href="mailto:support@gasopay.com" class="text-brand-600 hover:underline">support@gasopay.com</a>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <PhoneIcon class="h-5 w-5 text-brand-500 flex-shrink-0" />
          <a href="tel:+2348000000000" class="text-brand-600 hover:underline">+234 800 000 0000</a>
        </div>
        <div class="flex items-start gap-3 text-sm">
          <ClockIcon class="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
          <div class="text-gray-600 dark:text-gray-400">
            <p>Mon – Fri: 8:00am – 6:00pm</p>
            <p>Saturday: 9:00am – 3:00pm</p>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- FAQ -->
    <BaseCard>
      <div class="p-5">
        <h3 class="font-semibold text-gray-800 dark:text-white mb-4">Frequently Asked Questions</h3>
        <div class="space-y-3">
          <details v-for="faq in faqs" :key="faq.q" class="border border-gray-200 dark:border-gray-700 rounded-lg">
            <summary class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              {{ faq.q }}
            </summary>
            <p class="px-4 pb-3 text-sm text-gray-500 dark:text-gray-400">{{ faq.a }}</p>
          </details>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EnvelopeIcon, PhoneIcon, ClockIcon } from '@heroicons/vue/24/outline';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';

defineOptions({ name: 'RiderSupport' });

const WHATSAPP_NUMBER = '2348000000000'; // update with real number
const whatsappUrl = computed(() =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I need help with my Gasopay account.')}`
);

const faqs = [
  { q: 'How do I pay for a Pay Later order?', a: 'Make a bank transfer to our account, then upload the receipt under Pending Payments > Upload Proof.' },
  { q: 'How long does payment verification take?', a: 'Typically within 2–4 hours during business hours. You\'ll be notified once approved.' },
  { q: 'My account shows an outstanding debt. What do I do?', a: 'You\'ll need to clear the outstanding balance before making new purchases. Contact support if you think this is an error.' },
  { q: 'How do I get my QR code?', a: 'Your unique QR code is displayed on your Profile page. You can show it to a branch admin for quick identification.' },
];
</script>
