import { Role, useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import AdminLayout from '@/components/layout/AdminLayout.vue' // Import the layout
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

// Defensive fallback for Role enum in case of import issues
let SafeRole = Role;
if (!SafeRole || typeof SafeRole !== 'object') {
  SafeRole = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    RIDER: 'rider',
    USER: 'regular',
    UNKNOWN: 'unknown',
  } as unknown as typeof Role;
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AdminLayout,
    // meta: { requiresAuth: true }, // Add auth requirement if needed for all nested routes
    children: [
      // --- NESTED ROUTES START ---
      {
        path: '', // Default child route (Dashboard)
        name: 'AdminDashboard',
        component: () => import('../views/Ecommerce.vue'),
        meta: {
          title: 'Dashboard',
          requiresAuth: true, // Keep specific auth requirements if needed
        },
      },

      {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('../views/Others/Calendar.vue'),
        meta: {
          title: 'Calendar',
          requiresAuth: true,
        },
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Others/UserProfile.vue'),
        meta: {
          title: 'Profile',
          requiresAuth: true,
        },
      },
      {
        path: '/form-elements',
        name: 'Form Elements',
        component: () => import('../views/Forms/FormElements.vue'),
        meta: {
          title: 'Form Elements',
          requiresAuth: true,
        },
      },
      {
        path: '/basic-tables',
        name: 'Basic Tables',
        component: () => import('../views/Tables/BasicTables.vue'),
        meta: {
          title: 'Basic Tables',
          requiresAuth: true,
        },
      },
      {
        path: '/line-chart',
        name: 'Line Chart',
        component: () => import('../views/Chart/LineChart/LineChart.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/bar-chart',
        name: 'Bar Chart',
        component: () => import('../views/Chart/BarChart/BarChart.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/alerts',
        name: 'Alerts',
        component: () => import('../views/UiElements/Alerts.vue'),
        meta: {
          title: 'Alerts',
          requiresAuth: true,
        },
      },
      {
        path: '/avatars',
        name: 'Avatars',
        component: () => import('../views/UiElements/Avatars.vue'),
        meta: {
          title: 'Avatars',
          requiresAuth: true,
        },
      },
      {
        path: '/badge',
        name: 'Badge',
        component: () => import('../views/UiElements/Badges.vue'),
        meta: {
          title: 'Badge',
          requiresAuth: true,
        },
      },
      {
        path: '/buttons',
        name: 'Buttons',
        component: () => import('../views/UiElements/Buttons.vue'),
        meta: {
          title: 'Buttons',
          requiresAuth: true,
        },
      },
      {
        path: '/images',
        name: 'Images',
        component: () => import('../views/UiElements/Images.vue'),
        meta: {
          title: 'Images',
          requiresAuth: true,
        },
      },
      {
        path: '/videos',
        name: 'Videos',
        component: () => import('../views/UiElements/Videos.vue'),
        meta: {
          title: 'Videos',
          requiresAuth: true,
        },
      },
      {
        path: '/blank',
        name: 'Blank',
        component: () => import('../views/Pages/BlankPage.vue'),
        meta: {
          title: 'Blank',
          requiresAuth: true,
        },
      },
      {
        path: '/riders',
        name: 'Riders',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Riders', requiresAuth: true },
      },
      {
        path: '/purchase',
        name: 'Purchase',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Purchase', requiresAuth: true },
      },
      {
        path: '/admin/products',
        name: 'ProductManagement',
        component: () => import('../views/SuperAdmin/ProductManagement.vue'),
        meta: { title: 'Product Management', requiresAuth: true }, // TODO: Add correct auth later
      },
      {
        path: '/admin/orders',
        name: 'OrderHistory',
        component: () => import('../views/BranchAdmin/OrderHistory.vue'),
        meta: {
          title: 'Order History',
          requiresAuth: true,
          allowedRoles: [SafeRole.ADMIN, SafeRole.SUPER_ADMIN]
        }
      },
      {
        path: '/admin/registration-approval',
        name: 'RegistrationApproval',
        component: () => import('../views/Admin/PendingRegistrations.vue'),
        meta: {
          title: 'Registration Approval',
          requiresAuth: true,
          allowedRoles: [SafeRole.ADMIN, SafeRole.SUPER_ADMIN]
        },
      },
      {
        path: '/admin/riders',
        name: 'RiderList',
        component: () => import('../views/Admin/RiderList.vue'),
        meta: {
          title: 'All Riders',
          requiresAuth: true,
          allowedRoles: [SafeRole.ADMIN, SafeRole.SUPER_ADMIN]
        },
      },
      {
        path: '/rider/profile',
        name: 'RiderProfile',
        component: () => import('../views/Rider/Profile.vue'),
        meta: { title: 'Rider Profile', requiresAuth: true, allowedRoles: [SafeRole.RIDER, SafeRole.SUPER_ADMIN] } // TEMP: Unguarded for debugging
      },
      {
        path: '/admin/transactions',
        name: 'GlobalTransactions',
        component: () => import('../views/SuperAdmin/GlobalTransactions.vue'),
        meta: { title: 'Global Transactions', requiresAuth: false }, // TODO: Add correct auth later
      },
      {
        path: '/admin/admins',
        name: 'SuperAdminAdmins',
        component: () => import('../views/SuperAdmin/AdminManagement.vue'),
        meta: { title: 'Admin Management', requiresAuth: true }, // TODO: Add correct auth later
      },
      {
        path: '/super-admin/branches',
        name: 'SuperAdminBranches',
        component: () => import("../views/SuperAdmin/BranchOverview.vue"),
        meta: { title: 'Branch Management', requiresAuth: true }, // TODO: Add correct auth later
      },
      {
        path: '/admin/analytics',
        name: 'SuperAdminAnalytics',
        component: () => import('../views/SuperAdmin/SystemAnalytics.vue'),
        meta: { title: 'System Analytics', requiresAuth: true }, // TODO: Add correct auth later
      },
      {
        path: '/admin/stats-reports',
        name: 'SuperAdminStatsReports',
        component: () => import('../views/SuperAdmin/StatsReports.vue'),
        meta: { title: 'Stats & Reports', requiresAuth: true }, // TODO: Add correct auth later
      },
      {
        path: '/admin/api-generator',
        name: 'ApiGenerator',
        component: () => import('../components/common/ApiGenerator.vue'),
        meta: { 
          title: 'API Generator', 
          requiresAuth: true,
          allowedRoles: [SafeRole.SUPER_ADMIN]
        },
      },
      // BranchAdmin routes
      {
        path: '/branch-admin',
        name: 'BranchAdminDashboard',
        component: () => import('../views/BranchAdmin/Dashboard.vue'),
        meta: {
          title: 'Branch Dashboard',
          requiresAuth: true,
        },
      },
      {
        path: '/branch-admin/qr-scanner',
        name: 'BranchAdminQRScanner',
        component: () => import('../views/BranchAdmin/QRScanner.vue'),
        meta: {
          title: 'QR Scanner',
          requiresAuth: true,
        },
      },
      {
        path: '/admin/rider-profile/:id',
        name: 'RiderProfileView',
        component: () => import('../views/BranchAdmin/RiderProfileView.vue'),
        meta: {
          title: 'Rider Profile',
          requiresAuth: true,
        },
      },
      {
        path: '/branch-admin/orders',
        name: 'BranchAdminOrderHistory',
        component: () => import('../views/BranchAdmin/OrderHistory.vue'),
        meta: {
          title: 'Order History',
          requiresAuth: true,
        },
      },
      {
        path: '/branch-admin/pending-approvals',
        name: 'BranchAdminPendingApprovals',
        component: () => import('../views/BranchAdmin/PendingApprovals.vue'),
        meta: {
          title: 'Pending Approvals',
          requiresAuth: true,
          allowedRoles: [SafeRole.ADMIN, SafeRole.SUPER_ADMIN]
        },
      },
      {
        path: '/branch-admin/create-rider',
        name: 'BranchAdminCreateRider',
        component: () => import('../views/BranchAdmin/CreateRider.vue'),
        meta: {
          title: 'Create Rider',
          requiresAuth: true,
          allowedRoles: [SafeRole.ADMIN, SafeRole.SUPER_ADMIN]
        },
      },
      {
        path: '/branch-admin/riders',
        name: 'BranchAdminRidersList',
        component: () => import('../views/BranchAdmin/RidersList.vue'),
        meta: {
          title: 'Riders',
          requiresAuth: true,
          allowedRoles: [SafeRole.ADMIN, SafeRole.SUPER_ADMIN]
        },
      },
      // Rider routes
      {
        path: '/rider/dashboard',
        name: 'RiderDashboard',
        component: () => import('../views/Rider/Dashboard.vue'),
        meta: { title: 'My Dashboard', requiresAuth: true, allowedRoles: [SafeRole.RIDER] },
      },
      {
        path: '/rider/purchase-history',
        name: 'RiderPurchaseHistory',
        component: () => import('../views/Rider/PurchaseHistory.vue'),
        meta: { title: 'Purchase History', requiresAuth: true, allowedRoles: [SafeRole.RIDER] },
      },
      {
        path: '/rider/pending-payments',
        name: 'RiderPendingPayments',
        component: () => import('../views/Rider/PendingPayments.vue'),
        meta: { title: 'Pending Payments', requiresAuth: true, allowedRoles: [SafeRole.RIDER] },
      },
      {
        path: '/rider/upload-proof/:orderId',
        name: 'RiderUploadProof',
        component: () => import('../views/Rider/UploadProof.vue'),
        meta: { title: 'Upload Payment Proof', requiresAuth: true, allowedRoles: [SafeRole.RIDER] },
      },
      {
        path: '/rider/support',
        name: 'RiderSupport',
        component: () => import('../views/Rider/Support.vue'),
        meta: { title: 'Support', requiresAuth: true, allowedRoles: [SafeRole.RIDER] },
      },
    ]
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/Auth/Welcome.vue'),
    meta: {
      title: 'Welcome',
      requiresAuth: true
    }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('@/views/Auth/AuthCallback.vue'),
    meta: {
      title: 'Authenticating...'
    }
  },
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../views/Auth/Signin.vue'),
    meta: {
      title: 'Signin',
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Auth/Signup.vue'),
    meta: {
      title: 'Signup',
    },
  },
  {
    path: '/password-reset',
    name: 'PasswordReset',
    component: () => import('../views/Auth/PasswordReset.vue'),
    meta: {
      title: 'Reset Password',
    },
  },
  {
    path: '/rider/signup',
    name: 'RiderSignup',
    component: () => import('../views/Auth/RiderSignup.vue'),
    meta: { title: 'Rider Signup' }
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true, allowedRoles: [SafeRole.USER] },
    children: [
      {
        path: '',
        name: 'UserDashboard',
        component: () => import('../views/User/UserDashboard.vue'),
        meta: {
          title: 'Dashboard',
        },
      },
      {
        path: 'order-history',
        name: 'UserOrderHistory',
        component: () => import('../views/User/OrderHistory.vue'),
        meta: {
          title: 'Order History',
        },
      },
    ],
  },
  {
    path: '/landing',
    name: 'LandingPage',
    component: () => import('../views/LandingPage.vue'),
  },
  {
    path: '/test/paystack',
    name: 'TestPaystack',
    component: () => import('@/views/TestPaystack.vue'),
    meta: {
      title: 'Test Paystack',
      requiresAuth: false, // Allow access without authentication for testing
    },
  },
  {
    path: '/error-404',
    name: '404 Error',
    component: () => import('../views/Error404.vue'),
    meta: {
      title: '404 Error',
    },
  },
  {
    path: '/complete-profile',
    name: 'ProfileCompletion',
    component: () => import('../views/User/ProfileCompletion.vue'),
    meta: {
      title: 'Complete Profile',
      requiresAuth: true,
    },
  },
  { path: '/:pathMatch(.*)*', redirect: '/error-404' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes,
})

const waitForAuth = async () => {
  const authStore = useAuthStore();
  if (!authStore.isInitialized) {
    await authStore.loadAuthFromStorage();
  }
};

router.beforeEach(async (to, from, next) => {
  console.log(`[Router Guard] Navigating from ${from.path} to ${to.path}`);
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const allowedRoles = to.meta.allowedRoles as Role[] | undefined
  const publicPages = ['/signin', '/signup', '/password-reset', '/rider/signup', '/landing']

  // Allow navigation to the auth callback route without any checks
  if (to.path === '/auth/callback') {
    console.log('[Router Guard] Allowing /auth/callback route.');
    next();
    return;
  }

  await waitForAuth();

  document.title = to.meta.title ? `GasoPay | ${to.meta.title}` : 'GasoPay'

  const currentRole = authStore.userRoleTyped
  console.log('[Router Guard] Auth state: isAuthenticated=', authStore.isAuthenticated, 'currentRole=', currentRole);

  if (authStore.isAuthenticated && authStore.currentUser) {
    const user = authStore.currentUser;
    if (user.role === SafeRole.USER && (!user.phone || !user.user_profile?.address) && to.name !== 'ProfileCompletion') {
      return next({ name: 'ProfileCompletion' });
    }
  }

  if (to.path === '/') {
    if (!authStore.isAuthenticated) {
      return next('/landing');
    }
    switch (currentRole) {
      case SafeRole.SUPER_ADMIN:
        return next('/admin/analytics');
      case SafeRole.ADMIN:
        return next('/branch-admin');
      case SafeRole.RIDER:
        return next('/rider/dashboard');
      case SafeRole.USER:
        return next('/dashboard');
      default:
        return next('/signin');
    }
  }

  if (requiresAuth) {
    console.log('[Router Guard] Route requires authentication.');
    if (!authStore.token || !authStore.currentUser) {
      console.log('[Router Guard] Not authenticated, redirecting to signin.');
      next('/signin');
    } else if (allowedRoles && (!currentRole || !allowedRoles.includes(currentRole as Role))) {
      console.log('[Router Guard] Authenticated but role not allowed, redirecting to default.');
      next('/');
    } else {
      next()
    }
  } else if (authStore.isAuthenticated && publicPages.includes(to.path)) {
    switch (currentRole) {
      case SafeRole.SUPER_ADMIN:
        next('/');
        break;
      case SafeRole.ADMIN:
        next('/branch-admin');
        break;
      case SafeRole.RIDER:
        next('/rider/profile');
        break;
      case SafeRole.USER:
        next('/dashboard');
        break;
      default:
        next('/signin');
        break;
    }
  } else {
    console.log('[Router Guard] Public route, proceeding.');
    next()
  }
})

export default router