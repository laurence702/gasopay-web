# Gasopay API Integration System

This directory contains utilities for automatically generating API client code from the Postman collection in `/guide/gasopay.json`. The generated code provides type-safe access to all API endpoints defined in the collection.

## Components

- **apiGenerator.ts**: Core utility for parsing the Postman collection and generating TypeScript API client code
- **generateApi.ts**: Utility for downloading the generated API client code
- **apiConfig.ts**: Configuration for API requests
- **apiService.ts**: Base API service for making HTTP requests

## UI Components

- **ApiGenerator.vue**: UI component for generating API client code
- **ApiIntegrationExample.vue**: Example component demonstrating how to use the API client

## How It Works

The API integration system works by:

1. Parsing the Postman collection in `/guide/gasopay.json`
2. Generating TypeScript interfaces for request and response types
3. Generating typed API functions for each endpoint
4. Providing a mechanism to switch between real API calls and mock data

## Usage

### Generating API Client Code

You can generate API client code in two ways:

1. **Using the UI**: Add the `ApiGenerator` component to any page and use the UI to generate and download the code.

```vue
<template>
  <ApiGenerator />
</template>

<script setup>
import ApiGenerator from '@/components/common/ApiGenerator.vue';
</script>
```

2. **Programmatically**: Import and call the `generateApiClient` function.

```typescript
import { generateApiClient } from '@/services/apiGenerator';
import { generateApiClientFile } from '@/services/generateApi';

// Generate code
const code = generateApiClient();
console.log(code);

// Or download the generated code
generateApiClientFile();
```

### Using the Generated API Client

Once you've generated the API client code, you can use it to make API calls:

```typescript
import { getAuthUsers, postAuthLogin } from '@/services/generatedApi';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Get users
const users = await getAuthUsers(authStore.token);

// Login
const loginData = {
  login_identifier: 'user@example.com',
  password: 'password123'
};
const loginResponse = await postAuthLogin(loginData);
```

### Using Mock Data

The API client supports switching between real API calls and mock data:

```typescript
import { apiClient } from '@/services/apiGenerator';
import mockUsers from '@/mockData/users.json';

// Create a mockable API function
const getUsers = apiClient.createMockableApi(
  mockUsers,
  async (token) => {
    // Real API call
    const response = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
);

// Use real API
apiClient.setUseMockData(false);
const realUsers = await getUsers('token123');

// Use mock data
apiClient.setUseMockData(true);
const mockUsers = await getUsers('token123');
```

## Adding to Router

To add the API Generator to your application, add a route to your router configuration:

```typescript
// In router/index.ts
{
  path: '/api-generator',
  name: 'ApiGenerator',
  component: () => import('../components/common/ApiGenerator.vue'),
  meta: {
    title: 'API Generator',
    requiresAuth: true,
    allowedRoles: [Role.SUPER_ADMIN] // Restrict to super admins
  }
}
```

## Benefits

- **Type Safety**: All API functions are fully typed, providing autocomplete and type checking
- **Consistency**: Ensures consistent API usage across the application
- **Documentation**: Generated code includes documentation from the Postman collection
- **Flexibility**: Easily switch between real API and mock data for testing
- **Maintainability**: Automatically update API client when the Postman collection changes
