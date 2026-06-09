/**
 * API Configuration Service
 * 
 * This service centralizes API URL handling and configuration
 * based on the current environment.
 */

// Get the API URL based on environment
const getApiBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || '';
  }
  // In development, we use a relative path that will be caught by the Vite proxy.
  return '/api';
};

// The base URL for API requests
export const API_BASE_URL = getApiBaseUrl();

// Create full URL for an API endpoint
export const getApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with a slash if it doesn't already
  // The base URL already includes /api, and the endpoint should be relative to that.
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${formattedEndpoint}`;
};

/**
 * Configuration for axios requests
 */
export const getAuthHeaders = (token: string) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

export default {
  API_BASE_URL,
  getApiUrl,
  getAuthHeaders
}; 