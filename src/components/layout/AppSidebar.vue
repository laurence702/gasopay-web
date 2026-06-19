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
      <router-link to="/" class="flex items-center">
        <!-- Full logo when expanded -->
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          src="/src/assets/images/main_logo.svg"
          alt="Gasopay"
          class="h-9 w-auto object-contain"
        />
        <!-- Icon-only when collapsed -->
        <img
          v-else
          src="/src/assets/images/GASOPAY-logo-fn.svg"
          alt="Gasopay"
          class="h-8 w-8 object-contain"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in filteredMenuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
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
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { Component } from 'vue';
import { computed } from 'vue';
import { useAuthStore, Role } from '@/stores/auth';

import {
  ChevronDownIcon,
  HorizontalDots,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import { useSidebar } from "@/composables/useSidebar";
import {
  UserPlusIcon,
  UsersIcon,
  UserCircleIcon as SolidUserCircleIcon,
  QrCodeIcon,
  ReceiptPercentIcon,
  HomeIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  CubeIcon,
  DocumentChartBarIcon,
  CodeBracketIcon,
} from "@heroicons/vue/24/solid";

interface SubMenuItem {
  name: string;
  path: string;
  pro?: boolean;
  allowedRoles?: Role[];
}

interface MenuItem {
  icon: Component;
  name: string;
  path?: string;
  subItems?: SubMenuItem[];
  allowedRoles?: Role[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
  allowedRoles?: Role[];
}

const route = useRoute();
const authStore = useAuthStore();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const allMenuGroups: MenuGroup[] = [
  {
    title: "Menu",
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
    items: [
      {
        icon: HomeIcon,
        name: "Dashboard",
        path: "/",
        allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      },
      {
        icon: TruckIcon,
        name: "Riders",
        path: "/admin/riders",
        allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      },
    ],
  },

  {
    title: "ADMIN",
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
    items: [
      {
        icon: ClipboardDocumentCheckIcon,
        name: "Registration Approval",
        path: "/admin/registration-approval",
        allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      },
      {
        icon: Cog6ToothIcon,
        name: "Admin Management",
        path: "/admin/admins",
        allowedRoles: [Role.SUPER_ADMIN],
      },
      {
        icon: BuildingOfficeIcon,
        name: "Branch Overview",
        path: "/super-admin/branches",
        allowedRoles: [Role.SUPER_ADMIN],
      },
      {
        icon: ChartPieIcon,
        name: "System Analytics",
        path: "/super-admin/analytics",
        allowedRoles: [Role.SUPER_ADMIN],
      },
      {
        icon: CurrencyDollarIcon,
        name: "Global Transactions",
        path: "/super-admin/transactions",
        allowedRoles: [Role.SUPER_ADMIN],
      },
      {
        icon: CubeIcon,
        name: "Product Management",
        path: "/admin/products",
        allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      },
      {
        icon: DocumentChartBarIcon,
        name: "Stats & Reports",
        path: "/super-admin/stats-reports",
        allowedRoles: [Role.SUPER_ADMIN],
      },
      {
        icon: CodeBracketIcon,
        name: "API Generator",
        path: "/admin/api-generator",
        allowedRoles: [Role.SUPER_ADMIN],
      },
    ],
  },
  {
    title: "RIDER",
    allowedRoles: [Role.RIDER],
    items: [
      {
        icon: SolidUserCircleIcon,
        name: "My Profile",
        path: "/rider/profile",
        allowedRoles: [Role.RIDER],
      },
      {
        icon: ReceiptPercentIcon,
        name: "Order History",
        path: "/admin/orders",
        allowedRoles: [Role.RIDER, Role.ADMIN, Role.SUPER_ADMIN],
      },
    ],
  },
  {
    title: "Management",
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
    items: [
      {
        icon: ReceiptPercentIcon,
        name: "Order History",
        path: "/admin/orders",
        allowedRoles: [Role.RIDER, Role.ADMIN, Role.SUPER_ADMIN],
      },
      {
        icon: UserPlusIcon,
        name: "Pending Approvals",
        path: "/admin/registration-approval",
        allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      },
      {
        icon: UsersIcon,
        name: "All Riders",
        path: "/admin/riders",
        allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
      },
    ]
  },
  {
    title: "BRANCH ADMIN",
    allowedRoles: [Role.ADMIN],
    items: [
      {
        icon: HomeIcon,
        name: "Branch Dashboard",
        path: "/branch-admin",
        allowedRoles: [Role.ADMIN],
      },
      {
        icon: QrCodeIcon,
        name: "QR Scanner",
        path: "/branch-admin/qr-scanner",
        allowedRoles: [Role.ADMIN],
      },
      {
        icon: ReceiptPercentIcon,
        name: "Order History",
        path: "/branch-admin/orders",
        allowedRoles: [Role.ADMIN],
      },
      {
        icon: UserPlusIcon,
        name: "Pending Approvals",
        path: "/branch-admin/pending-approvals",
        allowedRoles: [Role.ADMIN],
      },
      {
        icon: UsersIcon,
        name: "All Riders",
        path: "/admin/riders",
        allowedRoles: [Role.ADMIN],
      },
      {
        icon: UserPlusIcon,
        name: "Create New Rider",
        path: "/branch-admin/create-rider",
        allowedRoles: [Role.ADMIN],
      },
    ]
  },
];

const filteredMenuGroups = computed(() => {
  const currentRole = authStore.userRoleTyped;
  if (!currentRole || !authStore.isAuthenticated) {
    return [];
  }

  return allMenuGroups
    .filter(group => group.allowedRoles && currentRole !== null && group.allowedRoles.includes(currentRole))
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.allowedRoles && currentRole !== null && item.allowedRoles.includes(currentRole))
    }))
    .filter(group => group.items.length > 0);
});

const isActive = (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path));
};

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  return openSubmenu.value === `${groupIndex}-${itemIndex}`;
};

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  const menuKey = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === menuKey ? null : menuKey;
};

const startTransition = (el: Element) => {
  (el as HTMLElement).style.height = el.scrollHeight + "px";
};

const endTransition = (el: Element) => {
  (el as HTMLElement).style.height = "";
};
</script>

<style scoped>
/* Add any specific styles for the sidebar here if needed */
</style>
