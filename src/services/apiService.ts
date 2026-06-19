import { API_BASE_URL, getAuthHeaders } from './apiConfig';

import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useSessionExpiredModal } from '@/composables/useSessionExpiredModal';

/**
 * Create an axios instance with a base URL
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add a global axios response interceptor for 401 errors
let isSessionModalShown = false;
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      const token = authStore.token;
      console.error('[apiService][401 Interceptor] 401 Unauthorized error:', error, 'Request config:', error.config, 'Current token:', token);
      if (!isSessionModalShown) {
        isSessionModalShown = true;
        // Use nextTick to ensure modal is shown in UI
        Promise.resolve().then(() => {
          const { showSessionExpired } = useSessionExpiredModal();
          showSessionExpired();
          authStore.logout();
          // Optionally, redirect to login after a short delay if modal is closed
          // router.push('/signin');
        });
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Generic API Service for handling requests
 */
export const apiService = {
  /**
   * Send a GET request
   */
  async get<T>(url: string, token?: string): Promise<T> {
    const config = token ? { headers: getAuthHeaders(token) } : undefined;
    console.log('[apiService][GET]', url, 'Token:', token, 'Headers:', config?.headers);
    const response = await apiClient.get<T>(url, config);
    console.log('[apiService][GET] Raw Axios Response:', response);
    return response.data;
  },

  /**
   * Send a POST request
   */
  async post<T, D = Record<string, unknown>>(url: string, data: D, token?: string): Promise<T> {
    const config = token ? { headers: getAuthHeaders(token) } : undefined;
    console.log('[apiService][POST]', url, 'Token:', token, 'Headers:', config?.headers, 'Data:', data);
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  /**
   * Send a POST request with FormData (multipart/form-data)
   */
  async postForm<T>(url: string, formData: FormData, token?: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'multipart/form-data' };
    if (token) Object.assign(headers, getAuthHeaders(token));
    const response = await apiClient.post<T>(url, formData, { headers });
    return response.data;
  },

  /**
   * Send a PUT request
   */
  async put<T, D = Record<string, unknown>>(url: string, data: D, token?: string): Promise<T> {
    const config = token ? { headers: getAuthHeaders(token) } : undefined;
    console.log('[apiService][PUT]', url, 'Token:', token, 'Headers:', config?.headers, 'Data:', data);
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  /**
   * Send a DELETE request
   */
  async delete<T>(url: string, token?: string): Promise<T> {
    const config = token ? { headers: getAuthHeaders(token) } : undefined;
    console.log('[apiService][DELETE]', url, 'Token:', token, 'Headers:', config?.headers);
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  }
};

export default apiService;

// Define the structure for a product rule from the /api/products/rules endpoint
export interface ApiProductRule {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  rules: number[];
}

// Define the structure for an order in the user's order list
export interface ApiUserOrder {
  id: string;
  product: {
    id: string;
    name: string;
  };
  amount_due: string;
  payment_status: 'Paid' | 'Pending' | 'Failed' | 'Cancelled' | 'Partial';
  created_at: string;
}

/**
 * Fetches the list of product rules.
 */
export async function getProducts(token: string): Promise<ApiProductRule[]> {
  // The endpoint returns the array directly, not nested under a 'data' property.
  return apiService.get<ApiProductRule[]>('/products/rules', token);
}

/**
 * Fetches the list of orders for the current user.
 */
export async function getOrders(token: string): Promise<ApiUserOrder[]> {
  const response = await apiService.get<{ data: ApiUserOrder[] }>('/orders', token);
  return response.data;
}

// Define the expected structure of the User object in the API response

// Define detailed UserProfile structure based on observed/expected data
export interface UserProfileData { // Export this
  id?: string; // Assuming these might be present
  user_id?: string;
  address?: string;
  vehicle_type?: string;
  nin?: string;
  guarantors_name?: string;
  guarantors_phone?: string;
  guarantors_address?: string;
  profile_pic_url?: string | null; // The profile picture URL from Cloudinary?
  barcode?: string | null;
  total_pickups?: number; // Added based on profile page usage
  current_debt?: number; // Added based on profile page usage
}

// Define Branch structure based on user object example
export interface BranchData {
  id: number;
  name: string;
  location?: string;
  branch_phone?: string;
  // Add other fields if needed
}

export interface ApiUser {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  verification_status: string;
  branch_id: string | null; // Keep ID if needed, but use branch object primarily
  branch?: BranchData | null; // Add the nested branch object, make it optional
  user_profile: UserProfileData | null;
  // Include other fields from example if needed (e.g., balance, banned_at)
  balance?: string;
  banned_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Define the structure for a payer (simplified user)
export interface ApiPayer {
  id: string;
  fullname: string;
  image?: string; // Optional image URL
}

// Define the structure for a product
export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
}

// Define the structure for an order
export interface ApiOrder {
  id: string;
  product: ApiProduct;
  amount_due: number;
  status: 'paid' | 'pending' | 'failed';
  payer: ApiPayer;
  branch: BranchData;
}

export interface DashboardSummaryResponse {
  total_income: number;
  total_debt: number;
  monthly_sales: { month: number; total_sales: number }[];
  recent_orders: ApiOrder[];
}


// Define the expected structure of the successful login response
export interface LoginResponse { // Export this
  message: string;
  token: string;
  token_type: string;
  user: ApiUser;
}

// Define the expected structure of the successful Rider Registration response
export interface RiderRegistrationResponse { // Export this
    message: string;
    access_token: string;
    token_type: string;
    user: ApiUser;
}

// Define the expected structure of the /me response
interface GetMeResponse {
  user: ApiUser;
}

// Define the expected structure of the /users/{id} response
export interface GetUserByIdResponse { // New interface
  user: ApiUser;
}

// Define interface for backend validation errors
export interface BackendValidationErrorResponse {
  message: string;
  errors?: Record<string, string[]>; // Common format: field name -> array of error messages
}

// Type guard for BackendValidationErrorResponse
export function isBackendValidationErrorResponse(data: unknown): data is BackendValidationErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data && typeof data.message === 'string' &&
    'errors' in data && typeof data.errors === 'object' // Further checks on errors object can be added if needed
  );
}

// Define the structure for user list API response (adjust based on actual API)
interface GetUsersResponse {
  data: ApiUser[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number; 
  // Add other pagination fields if provided by API (e.g., next_page_url)
}

// Define parameters for getUsers function
interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string; // To filter by role
  verification_status?: string; // Add verification status filter
  branchId?: string; // Optional filter
  // Add other potential filter/sort params
}

// Define interface for the response when fetching a list of branches
export interface GetBranchesResponse {
  data: BranchData[];
  // Add other pagination/meta fields if the API returns them
}

// Define request body for verification update
interface UpdateVerificationStatusRequest {
    status: 'verified' | 'rejected';
    rider_id: string;
}

// Define response (adjust based on actual API response)
interface UpdateVerificationStatusResponse {
    message: string;
    // Include other fields if the API returns more data
}

// Read Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not set in .env, using default http://localhost:8000/api');
}

/**
 * Performs a login request to the backend using email or phone.
 * @param {string} login_identifier - The user's email or phone number.
 * @param {string} password - The user's password.
 * @returns {Promise<LoginResponse>} - The parsed JSON response from the API.
 * @throws {Error} - Throws an error if the login fails or the response is not ok.
 */
export async function loginUser(login_identifier: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ login_identifier, password }),
  });

  let data;
  try {
    console.log('IIIIIIII', response);
      data = await response.json();
  } catch {
      // Handle cases where the response is not JSON (e.g., server error pages)
      throw new Error(`Failed to parse response. Status: ${response.status}`);
  }

  if (!response.ok || data.status !== 'success') {
    // Throw an error with the message from the API if available, otherwise a generic one
    console.error("Login API Error Response:", data);
    throw new Error(data.message || `Login failed. Status: ${response.status}`);
  }

  // We need to be sure the response matches LoginResponse structure
  // Add runtime checks if necessary, but for now trust the interface
  return data as LoginResponse;
}

/**
 * Performs a Rider registration request to the backend.
 * @param {FormData} formData - The form data including rider details and profile picture file.
 * @returns {Promise<RiderRegistrationResponse>} - The parsed JSON response from the API.
 * @throws {Error} - Throws an error if the registration fails or the response is not ok.
 */
export interface UserRegistrationResponse {
  message: string;
  user: ApiUser;
  token: string;
}

export async function registerUser(payload: Record<string, string>): Promise<UserRegistrationResponse> {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    let errorMessage = `Registration failed. Status: ${response.status}`;
    if (data && data.message) {
        errorMessage = data.message;
        if (data.errors) {
            errorMessage += `: ${JSON.stringify(data.errors)}`;
        }
    }
    console.error("User Registration API Error Response:", data);
    throw new Error(errorMessage);
  }

  return data as UserRegistrationResponse;
}

export async function registerRider(formData: FormData): Promise<RiderRegistrationResponse> {
  // Note: When using FormData with fetch, 'Content-Type' header is set automatically
  // to 'multipart/form-data' by the browser, DO NOT set it manually.
  const response = await fetch(`${BASE_URL}/register-rider`, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data', // Let the browser set this with boundary
      'Accept': 'application/json',
    },
    body: formData,
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse registration response. Status: ${response.status}`);
  }

  if (!response.ok) {
    // Handle potential validation errors (often status 422)
    let errorMessage = `Registration failed. Status: ${response.status}`;
    if (data && data.message) {
        errorMessage = data.message;
        if (data.errors) { // Append validation details if available
            errorMessage += `: ${JSON.stringify(data.errors)}`;
        }
    }
    console.error("Rider Registration API Error Response:", data);
    throw new Error(errorMessage);
  }

  // Assuming successful response structure matches RiderRegistrationResponse
  return data as RiderRegistrationResponse;
}

/**
 * Fetches the current authenticated user's details.
 * @param {string} token - The authentication token.
 * @returns {Promise<GetMeResponse>} - The user data response.
 * @throws {Error} - Throws error on network failure or non-ok response.
 */
/**
 * Update the currently authenticated user's profile.
 */
export async function updateUserProfile(token: string, userId: string, payload: { phone?: string; address?: string, fullname?: string }): Promise<ApiUser> {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const url = `${API_BASE_URL}/users/${userId}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile.');
  }

  return data.data as ApiUser;
}

export async function getMe(token: string): Promise<{ user: ApiUser | null }> {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const response = await fetch(`${BASE_URL}/me`, { // Endpoint for current user
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`, // Add Authorization header
    },
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse /me response. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error("GetMe API Error Response:", data);
    throw new Error(data.message || `/me request failed. Status: ${response.status}`);
  }

   // Assuming the response directly contains the user object or { user: ApiUser }
   if (data.user) {
       return data as GetMeResponse; // Assumes { user: ApiUser } structure
   } else {
        // Attempt to handle if user object is returned directly at top level
        return { user: data as ApiUser };
   }

}

/**
 * Fetches a specific user by their ID.
 * @param {string} token - The authentication token.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<GetUserByIdResponse>} - The user data response.
 * @throws {Error} - Throws error on network failure or non-ok response.
 */
export async function getUserById(token: string, userId: string): Promise<GetUserByIdResponse> {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }
  if (!userId) {
    throw new Error("User ID is missing.");
  }

  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  let data;
  try {
      data = await response.json();
  } catch (e) {
      console.error("Error parsing getUserById response JSON:", e, "Status:", response.status);
      throw new Error(`Failed to parse response for user ${userId}. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error(`GetUserById API Error for user ${userId}:`, data);
    throw new Error(data?.message || `Request for user ${userId} failed. Status: ${response.status}`);
  }

  // Assuming the response directly contains the user object or { user: ApiUser }
  // This handles both { user: {...} } and cases where the API returns the user object directly at the root
  if (data && data.user && typeof data.user === 'object') {
      return data as GetUserByIdResponse;
  } else if (data && typeof data === 'object' && data.id) { // Check if data itself is an ApiUser
      return { user: data as ApiUser };
  } else {
    // If the structure is unexpected, log and throw an error
    console.error("Unexpected response structure for getUserById:", data);
    throw new Error("Unexpected response structure from server.");
  }
}

/**
 * Fetches a list of users from the API, with optional filtering and pagination.
 * @param {string} token - The authentication token.
 * @param {GetUsersParams} params - Parameters for filtering and pagination.
 * @returns {Promise<GetUsersResponse>} - The user list response.
 * @throws {Error} - Throws error on network failure or non-ok response.
 */
export async function getUsers(token: string, params: GetUsersParams = {}): Promise<GetUsersResponse> {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  // Construct query parameters
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.role) queryParams.append('role', params.role);
  if (params.verification_status) queryParams.append('verification_status', params.verification_status); // Add status param
  if (params.branchId) queryParams.append('branch_id', params.branchId);
  // Add other params as needed

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/users${queryString ? '?' + queryString : ''}`;
  console.log('[apiService] Fetching users from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse user list response. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error("GetUsers API Error Response:", data);
    throw new Error(data.message || `Failed to fetch users. Status: ${response.status}`);
  }

  // Add runtime validation if necessary
  return data as GetUsersResponse;
}

/**
 * Updates the verification status of a rider.
 * @param {string} token - The authentication token.
 * @param {UpdateVerificationStatusRequest} payload - The request body containing rider_id and status.
 * @returns {Promise<UpdateVerificationStatusResponse>} - The response from the API.
 * @throws {Error} - Throws error on network failure or non-ok response.
 */
export async function updateRiderVerificationStatus(
    token: string,
    payload: UpdateVerificationStatusRequest
): Promise<UpdateVerificationStatusResponse> {
    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    const url = `${BASE_URL}/riders/verification`;
    console.log('[apiService] Updating rider verification status:', url, payload);

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error(`Failed to parse verification update response. Status: ${response.status}`);
    }

    if (!response.ok) {
        console.error("UpdateVerificationStatus API Error Response:", data);
        throw new Error(data.message || `Failed to update verification status. Status: ${response.status}`);
    }

    return data as UpdateVerificationStatusResponse;
}

// Add other API functions here as needed (e.g., registerUser, fetchUserData)

// Add a new function to fetch branches
export async function getBranches(token?: string | null): Promise<GetBranchesResponse> {
  const url = `${BASE_URL}/branches`;
  console.log('[apiService] Fetching branches from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse branches response. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error("GetBranches API Error Response:", data);
    throw new Error(data.message || `Failed to fetch branches. Status: ${response.status}`);
  }

  // Assuming the response directly contains { data: BranchData[] } or similar
  return data as GetBranchesResponse;
}

// Add a new function to create an admin
export async function createAdmin(
  token: string,
  payload: { fullname: string; email: string; phone: string; password: string; password_confirmation: string; branch_id: string; }
): Promise<ApiUser> { // Assuming it returns the created admin user
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const url = `${BASE_URL}/create-admin`;
  console.log('[apiService] Creating admin at:', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse create admin response. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error("CreateAdmin API Error Response:", data);
     // Check if it's a validation error with the specific structure
    if (data && typeof data === 'object' && 'errors' in data && typeof data.errors === 'object') {
       // You might want to throw a specific validation error type here
       throw new Error(data.message || 'Validation failed.');
    } else {
      throw new Error(data.message || `Failed to create admin. Status: ${response.status}`);
    }
  }

  // Assuming successful response returns the created user object
  return data as ApiUser; // Adjust if the response structure is different
}

// Add a new function to update a user (admin or other roles)
export async function updateUser(
  token: string,
  userId: string,
  payload: Partial<{ // Use Partial for optional fields
    fullname: string;
    email: string; // Email might be updatable
    phone: string;
    branch_id: string | null; // Allow assigning/unassigning branch
    // Do NOT include password fields here unless the API handles them separately
    // Do NOT include role or id as they are unlikely to be updatable this way
  }>
): Promise<ApiUser> { // Assuming it returns the updated user object
  if (!token) {
    throw new Error("Authentication token is missing.");
  }
  if (!userId) {
    throw new Error("User ID is missing.");
  }

  const url = `${BASE_URL}/users/${userId}`;
  console.log('[apiService] Updating user at:', url, 'with payload:', payload);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse update user response. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error("UpdateUser API Error Response:", data);
     // Check if it's a validation error with the specific structure
    if (data && typeof data === 'object' && 'errors' in data && typeof data.errors === 'object') {
       throw new Error(data.message || 'Validation failed.');
    } else {
      throw new Error(data.message || `Failed to update user. Status: ${response.status}`);
    }
  }

  // Assuming successful response returns the updated user object
  return data as ApiUser; // Adjust if the response structure is different
}

export async function getBranchDashboardData(token: string, branchId: number, period: string) {
  const url = `${BASE_URL}/branch-admin/dashboard/summary?branch_id=${branchId}&period=${period}`;
  console.log('[apiService] Fetching branch dashboard data from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch branch dashboard data' }));
    console.error('GetBranchDashboardData API Error:', errorData);
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
} 