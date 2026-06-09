<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Branch Overview" />

    <!-- Branch Stats Grid -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
      <div v-for="branch in branches" :key="branch.id">
         <StatsCard
            :title="`Branch: ${branch.name} (${branch.id})`"
            :value="formatCurrency(branch.totalSales)"
            :secondaryInfo="[
                { label: 'Pending Payments', value: formatCurrency(branch.pendingPayments) },
                { label: 'Active Riders', value: branch.activeRiders }
            ]"
            viewLink="#"
          />
          <!-- We could add more details or a small chart per branch later -->
      </div>
       <div v-if="!branches || branches.length === 0" class="col-span-full p-6 text-center text-gray-500 dark:text-gray-400">
          No branch data available.
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import StatsCard from '@/components/common/StatsCard.vue';

// Mock Branch Data Type
type BranchStat = {
    id: string;
    name: string;
    location?: string; // Optional location
    totalSales: number;
    pendingPayments: number;
    activeRiders: number;
}

// Mock Branch Data
const branches = ref<BranchStat[]>([
    {
        id: 'branch_01',
        name: 'Lekki Phase 1',
        location: 'Lekki, Lagos',
        totalSales: 450000,
        pendingPayments: 35000,
        activeRiders: 55
    },
    {
        id: 'branch_02',
        name: 'Ikeja GRA',
        location: 'Ikeja, Lagos',
        totalSales: 620000,
        pendingPayments: 15000,
        activeRiders: 72
    },
    {
        id: 'branch_03',
        name: 'Wuse II Hub',
        location: 'Abuja',
        totalSales: 380000,
        pendingPayments: 50000,
        activeRiders: 40
    },
    {
        id: 'branch_04',
        name: 'Port Harcourt Central',
        location: 'Port Harcourt',
        totalSales: 510000,
        pendingPayments: 20000,
        activeRiders: 60
    }
]);

// Helper function for currency formatting (copied from Dashboard)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
};

</script> 