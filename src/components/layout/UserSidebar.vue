<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/">
       <h1 class="text-2xl font-bold">
        <img src="/src/assets/images/main_logo.svg" alt="gasopay-logo" height="10px">
       </h1>
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div>
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                Menu
              </template>
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="item in userMenu" :key="item.name">
                <router-link
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      'w-5 h-5',
                      isActive(item.path)
                        ? 'text-brand-500 dark:text-brand-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-brand-500 dark:group-hover:text-brand-400',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import { HomeIcon, UserCircleIcon, ReceiptPercentIcon } from '@heroicons/vue/24/solid'

const { isExpanded, isHovered, isMobileOpen } = useSidebar()
const route = useRoute()

const userMenu = [
  {
    name: 'Dashboard',
    path: '/',
    icon: HomeIcon,
  },
  {
    name: 'Order History',
    path: '/dashboard/order-history',
    icon: ReceiptPercentIcon,
  },
  {
    name: 'My Profile',
    path: '/profile',
    icon: UserCircleIcon,
  },
]

const isActive = (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path));
};

</script>

<style scoped lang="postcss">
.menu-item {
  @apply flex items-center gap-4 p-3 rounded-lg transition-colors duration-200;
}
.menu-item-text {
  @apply text-sm font-medium text-gray-700 dark:text-gray-200;
}
.menu-item-active {
  @apply bg-brand-50 text-brand-500 dark:bg-gray-700 dark:text-brand-400;
}
.menu-item-inactive {
  @apply text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white;
}
</style>
