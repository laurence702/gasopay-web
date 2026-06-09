import type { ApiUser, LoginResponse, RiderRegistrationResponse } from '@/services/apiService';
import { computed, ref } from 'vue';
// Import with an alias to avoid name collision inside the store
import { getMe, updateUserProfile as apiUpdateUserProfile } from '@/services/apiService';

import { defineStore } from 'pinia';

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  RIDER = 'rider',
  USER = 'regular',
  UNKNOWN = 'unknown',
}

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const currentUser = ref<ApiUser | null>(null);
  const profileLoading = ref<boolean>(false);
  const profileError = ref<string | null>(null);
  const isInitialized = ref<boolean>(false);

  function isValidRole(value: string): value is Role {
    return Object.values(Role).includes(value as Role);
  }

  function setUserState(apiUserData: ApiUser | null, persist: boolean = false) {
    if (!apiUserData) {
      currentUser.value = null;
      if (persist) {
        setUserStorage(null);
      }
      return;
    }

    let userRoleEnum: Role = Role.UNKNOWN;
    const roleKey = Object.keys(Role).find(
      (key) => Role[key as keyof typeof Role] === apiUserData.role
    ) as keyof typeof Role | undefined;

    if (roleKey) {
      userRoleEnum = Role[roleKey];
    }

    const userWithMappedRole: ApiUser = { ...apiUserData, role: userRoleEnum };
    currentUser.value = userWithMappedRole;

    if (persist) {
      setUserStorage(currentUser.value);
    }
  }

  function setTokenState(newToken: string | null) {
    token.value = newToken;
  }

  function setUserStorage(user: ApiUser | null) {
    if (user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_DATA_KEY);
    }
  }

  function setTokenStorage(tokenValue: string | null) {
    if (tokenValue) {
      localStorage.setItem(AUTH_TOKEN_KEY, tokenValue);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  function clearAuthData(clearToken: boolean) {
    if (clearToken) {
      setTokenState(null);
      setTokenStorage(null);
    }
    setUserState(null, true);
    profileError.value = null;
    profileLoading.value = false;
  }

  async function fetchProfile() {
    if (!token.value) {
      return;
    }
    profileLoading.value = true;
    profileError.value = null;
    try {
      const response = await getMe(token.value);
      setUserState(response.user, true);
    } catch (error: any) {
      profileError.value = error.message || 'An unexpected error occurred during profile fetch.';
    } finally {
      profileLoading.value = false;
    }
  }

  async function loadAuthFromStorage(): Promise<void> {
    const tokenFromStorage = localStorage.getItem(AUTH_TOKEN_KEY);
    if (tokenFromStorage) {
      setTokenState(tokenFromStorage);
      const userFromStorage = localStorage.getItem(USER_DATA_KEY);
      if (userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage);
          if (parsedUser && typeof parsedUser === 'object' && 'id' in parsedUser) {
            setUserState(parsedUser as ApiUser);
          } else {
            setUserState(null, true);
          }
        } catch (error) {
          setUserState(null, true);
        }
      }
    } else {
      clearAuthData(true);
    }
    isInitialized.value = true;
  }

  

  async function login(loginResponse: LoginResponse) {
    setTokenState(loginResponse.token);
    setUserState(loginResponse.user, true);
    setTokenStorage(loginResponse.token);
    profileError.value = null;
  }

  function logout() {
    clearAuthData(true);
  }

  async function handleRiderRegistration(registrationResponse: RiderRegistrationResponse) {
    setTokenState(registrationResponse.access_token);
    setUserState(registrationResponse.user, true);
    setTokenStorage(registrationResponse.access_token);
    profileError.value = null;
  }

  async function handleAuthCallback(tokenValue: string): Promise<Role | null> {
    setTokenState(tokenValue);
    setTokenStorage(tokenValue);
    await fetchProfile();
    return userRole.value;
  }

  async function updateUserProfile(payload: { phone?: string; address?: string; fullname?: string }): Promise<void> {
    if (!token.value || !currentUser.value?.id) {
      throw new Error('Not authenticated or user ID is missing.');
    }

    profileLoading.value = true;
    profileError.value = null;

    try {
      const updatedUser = await apiUpdateUserProfile(token.value, currentUser.value.id, payload);
      setUserState(updatedUser, true); // Persist the updated user
    } catch (error: any) {
      profileError.value = error.message || 'An unexpected error occurred during profile update.';
      throw error; // Re-throw the error so the component can catch it
    } finally {
      profileLoading.value = false;
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!currentUser.value);
  const userRole = computed(() => currentUser.value?.role ?? null);
  const userProfile = computed(() => currentUser.value?.user_profile ?? null);
  const userRoleTyped = computed<Role | null>(() => {
    const role = currentUser.value?.role;
    if (role && Object.values(Role).includes(role)) {
      return role;
    }
    return null;
  });

  return {
    token,
    currentUser,
    profileLoading,
    profileError,
    isInitialized,
    isAuthenticated,
    userRole,
    userProfile,
    userRoleTyped,
    loadAuthFromStorage,
    login,
    logout,
    handleRiderRegistration,
    handleAuthCallback,
    fetchProfile,
    clearAuthData,
    updateUserProfile,
  };
});