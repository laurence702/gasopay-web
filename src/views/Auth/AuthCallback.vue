<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
      <p class="text-lg font-semibold">Logging you in...</p>
      <p class="text-sm text-gray-500">Please wait while we redirect you.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore, Role } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  console.log('[AuthCallback] Component mounted.');
  const token = route.query.token as string;
  console.log('[AuthCallback] Token received:', token ? 'Exists' : 'Missing');

  if (token) {
    try {
      const userRole = await authStore.handleAuthCallback(token);
      console.log('[AuthCallback] User role from store:', userRole);

      if (userRole) {
        // Check for incomplete profile for regular users
        if (userRole === Role.USER) {
          const user = authStore.currentUser;
          // Assuming user_profile is loaded and has an address field
          const isProfileComplete = user?.phone && user?.user_profile?.address;

          if (!isProfileComplete) {
            console.log('[AuthCallback] Incomplete profile, redirecting to profile completion.');
            router.push({ name: 'ProfileCompletion' }); // New route for profile completion
            return;
          }
        }

        switch (userRole) {
          case Role.SUPER_ADMIN:
            console.log('[AuthCallback] Redirecting to Ecommerce.');
            router.push({ name: 'Ecommerce' });
            break;
          case Role.ADMIN:
            console.log('[AuthCallback] Redirecting to BranchAdminDashboard.');
            router.push({ name: 'BranchAdminDashboard' });
            break;
          case Role.RIDER:
            console.log('[AuthCallback] Redirecting to RiderProfile.');
            router.push({ name: 'RiderProfile' });
            break;
          case Role.USER:
            console.log('[AuthCallback] Redirecting to UserDashboard.');
            router.push({ name: 'UserDashboard' });
            break;
          default:
            console.log('[AuthCallback] Invalid user role, redirecting to Signin.');
            router.push({ name: 'Signin', query: { error: 'Invalid user role.' } });
            break;
        }
      } else {
        console.log('[AuthCallback] Could not verify user role, redirecting to Signin.');
        router.push({ name: 'Signin', query: { error: 'Could not verify user role.' } });
      }
    } catch (error) {
      console.error('[AuthCallback] Error during auth callback handling:', error);
      router.push({ name: 'Signin', query: { error: 'An error occurred during login.' } });
    }
  } else {
    console.log('[AuthCallback] No token found, redirecting to Signin.');
    router.push({ name: 'Signin', query: { error: 'Authentication failed. Please try again.' } });
  }
});
</script>
