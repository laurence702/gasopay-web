import { API_BASE_URL, getAuthHeaders } from './apiConfig';
import type { ApiUser, LoginResponse } from './apiService';

import apiService from './apiService';
import postmanCollection from '../../guide/gasopay.json';

/**
 * Type definitions for Postman collection structure
 */
interface PostmanRequestUrl {
  raw: string;
  host: string[];
  path: string[];
  variable?: Array<{ key: string; value: string }>;
  query?: Array<{ key: string; value: string }>;
}

interface PostmanRequestBody {
  mode: string;
  raw?: string;
  formdata?: Array<{ key: string; type: string; value?: string; src?: any[] }>;
  options?: {
    raw?: {
      language: string;
    };
  };
}

interface PostmanRequest {
  method: string;
  url: PostmanRequestUrl;
  header: Array<{ key: string; value: string; type: string }>;
  body?: PostmanRequestBody;
  auth?: {
    type: string;
    bearer?: Array<{ key: string; value: string; type: string }>;
  };
}

interface PostmanEvent {
  listen: string;
  script: {
    exec: string[];
    type: string;
    packages: Record<string, unknown>;
  };
}

interface PostmanItem {
  name: string;
  request: PostmanRequest;
  response?: Array<{
    name: string;
    originalRequest: PostmanRequest;
    status: string;
    code: number;
    _postman_previewlanguage: string;
    body: string;
    header?: Array<{ key: string; value: string }>;
    cookie?: any[];
  }>;
  event?: PostmanEvent[];
  protocolProfileBehavior?: Record<string, unknown>;
}

interface PostmanFolder {
  name: string;
  item: Array<PostmanItem | PostmanFolder>;
  auth?: {
    type: string;
    bearer?: Array<{ key: string; value: string; type: string }>;
  };
  event?: PostmanEvent[];
}

interface PostmanCollection {
  info: {
    _postman_id: string;
    name: string;
    schema: string;
    _exporter_id: string;
  };
  item: Array<PostmanItem | PostmanFolder>;
  auth?: {
    type: string;
    bearer?: Array<{ key: string; value: string; type: string }>;
  };
  event?: PostmanEvent[];
  variable?: Array<{ key: string; value: string }>;
}

/**
 * Utility to extract path parameters from a URL
 * @param url URL with path parameters like /api/users/:id
 * @returns Array of parameter names
 */
function extractPathParams(url: string): string[] {
  const params: string[] = [];
  const regex = /:([a-zA-Z0-9_]+)/g;
  let match;
  
  while ((match = regex.exec(url)) !== null) {
    params.push(match[1]);
  }
  
  return params;
}

/**
 * Parse JSON body from a request
 * @param request Postman request object
 * @returns Parsed JSON object or null
 */
function parseRequestBody(request: PostmanRequest): Record<string, any> | null {
  if (!request.body || request.body.mode !== 'raw' || !request.body.raw) {
    return null;
  }
  
  try {
    return JSON.parse(request.body.raw);
  } catch (e) {
    console.error('Failed to parse request body:', e);
    return null;
  }
}

/**
 * Safely access a property in a nested object
 * @param obj The object to access
 * @param path The path to the property
 * @param defaultValue The default value if the property doesn't exist
 * @returns The property value or the default value
 */
function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current === undefined ? defaultValue : current as T;
}

/**
 * Parse JSON body from a response
 * @param responseBody Response body string
 * @returns Parsed JSON object or null
 */
function parseResponseBody(responseBody: string): Record<string, any> | null {
  try {
    return JSON.parse(responseBody);
  } catch (e) {
    console.error('Failed to parse response body:', e);
    return null;
  }
}

/**
 * Generate TypeScript interface from JSON object
 * @param obj JSON object
 * @param interfaceName Name of the interface
 * @returns TypeScript interface definition
 */
function generateInterface(obj: Record<string, any>, interfaceName: string): string {
  let interfaceStr = `export interface ${interfaceName} {\n`;
  
  for (const [key, value] of Object.entries(obj)) {
    const type = typeof value;
    
    if (type === 'object' && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const itemInterfaceName = `${interfaceName}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
          interfaceStr += `  ${key}: ${itemInterfaceName}[];\n`;
        } else {
          interfaceStr += `  ${key}: ${typeof value[0] || 'any'}[];\n`;
        }
      } else {
        const nestedInterfaceName = `${interfaceName}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        interfaceStr += `  ${key}: ${nestedInterfaceName};\n`;
      }
    } else {
      interfaceStr += `  ${key}: ${type === 'undefined' ? 'any' : type};\n`;
    }
  }
  
  interfaceStr += '}\n';
  return interfaceStr;
}

/**
 * Generate API function for a Postman request
 * @param item Postman item
 * @param folderName Parent folder name
 * @returns Generated TypeScript function
 */
function generateApiFunction(item: PostmanItem, folderName: string): string {
  const { name, request } = item;
  const method = request.method.toLowerCase();
  const pathParams = extractPathParams(request.url.raw);
  const requestBody = parseRequestBody(request);
  
  // Generate function name
  const functionName = `${method}${folderName}${name.replace(/[^a-zA-Z0-9]/g, '')}`;
  
  // Generate function parameters
  let params = '';
  let urlConstruction = '';
  
  if (pathParams.length > 0) {
    params += pathParams.map(param => `${param}: string`).join(', ');
    urlConstruction = `const url = \`${API_BASE_URL}/${request.url.path.join('/')}\`.replace(/:([a-zA-Z0-9_]+)/g, (_, p) => params[p]);`;
  } else {
    urlConstruction = `const url = \`${API_BASE_URL}/${request.url.path.join('/')}\`;`;
  }
  
  // Add token parameter if needed
  if (params) {
    params += ', token?: string';
  } else {
    params = 'token?: string';
  }
  
  // Add request body parameter if needed
  if (requestBody) {
    const bodyInterfaceName = `${folderName}${name.replace(/[^a-zA-Z0-9]/g, '')}Request`;
    if (params) {
      params += `, data: ${bodyInterfaceName}`;
    } else {
      params = `data: ${bodyInterfaceName}`;
    }
  }
  
  // Generate response type
  let responseType = 'any';
  if (item.response && item.response.length > 0) {
    const successResponse = item.response.find(res => res.code >= 200 && res.code < 300);
    if (successResponse && successResponse.body) {
      const responseBody = parseResponseBody(successResponse.body);
      if (responseBody) {
        responseType = `${folderName}${name.replace(/[^a-zA-Z0-9]/g, '')}Response`;
      }
    }
  }
  
  // Generate function body
  let functionBody = '';
  
  if (method === 'get' || method === 'delete') {
    functionBody = `
  /**
   * ${name}
   * ${request.url.raw}
   */
  export async function ${functionName}(${params}): Promise<${responseType}> {
    ${urlConstruction}
    return apiService.${method}<${responseType}>(url, token);
  }`;
  } else {
    functionBody = `
  /**
   * ${name}
   * ${request.url.raw}
   */
  export async function ${functionName}(${params}): Promise<${responseType}> {
    ${urlConstruction}
    return apiService.${method}<${responseType}, typeof data>(url, data, token);
  }`;
  }
  
  return functionBody;
}

/**
 * Process Postman collection items recursively
 * @param items Collection items
 * @param folderName Parent folder name
 * @returns Generated TypeScript code
 */
function processItems(items: Array<PostmanItem | PostmanFolder>, folderName: string = ''): string {
  let code = '';
  
  for (const item of items) {
    if ('item' in item) {
      // This is a folder
      const newFolderName = item.name.replace(/[^a-zA-Z0-9]/g, '');
      code += processItems(item.item, newFolderName);
    } else {
      // This is an endpoint
      code += generateApiFunction(item, folderName);
    }
  }
  
  return code;
}

/**
 * Generate API client from Postman collection
 * @returns Generated TypeScript code
 */
export function generateApiClient(): string {
  const collection = postmanCollection as unknown as PostmanCollection;
  let code = `
import { API_BASE_URL } from './apiConfig';
import apiService from './apiService';

/**
 * Auto-generated API client from Postman collection
 * DO NOT EDIT DIRECTLY - Regenerate using apiGenerator
 */
`;
  
  code += processItems(collection.item);
  
  return code;
}

/**
 * Create a mock data provider that can switch between real API and mock data
 * @param mockData Mock data object
 * @param apiFunction Real API function
 * @returns Function that can switch between real and mock data
 */
export function createMockableApi<T, P extends any[]>(
  mockData: T,
  apiFunction: (...args: P) => Promise<T>,
  useMockData: boolean = false
): (...args: P) => Promise<T> {
  return async (...args: P): Promise<T> => {
    if (useMockData) {
      return Promise.resolve(mockData);
    }
    return apiFunction(...args);
  };
}

/**
 * Interface to track API endpoint integration status
 */
export interface EndpointStatus {
  path: string;
  method: string;
  name: string;
  folder: string;
  integrated: boolean;
  mockDataAvailable: boolean;
  lastUsed?: Date;
  description?: string;
}

/**
 * API client with automatic switching between mock and real data
 * and tracking of endpoint integration status
 */
export class ApiClient {
  private useMockData: boolean;
  private endpointStatuses: Map<string, EndpointStatus> = new Map();
  
  constructor(useMockData: boolean = false) {
    this.useMockData = useMockData;
    this.initializeEndpointStatuses();
  }
  
  /**
   * Initialize endpoint statuses from the Postman collection
   */
  private initializeEndpointStatuses(): void {
    try {
      const collection = postmanCollection as unknown as PostmanCollection;
      this.processItemsForStatus(collection.item);
    } catch (error) {
      console.error('Failed to initialize endpoint statuses:', error);
    }
  }
  
  /**
   * Process Postman collection items to track endpoint statuses
   */
  private processItemsForStatus(items: Array<PostmanItem | PostmanFolder>, folderName: string = ''): void {
    for (const item of items) {
      if ('item' in item) {
        // This is a folder
        const newFolderName = item.name.replace(/[^a-zA-Z0-9]/g, '');
        this.processItemsForStatus(item.item, newFolderName);
      } else if (item.request) {
        // This is an endpoint
        const { name, request } = item;
        const method = request.method.toLowerCase();
        const path = request.url.path.join('/');
        const key = `${method}:${path}`;
        
        // Check if mock data is available for this endpoint
        const mockDataAvailable = this.checkMockDataAvailability(path, method);
        
        this.endpointStatuses.set(key, {
          path,
          method,
          name,
          folder: folderName,
          integrated: false, // Default to false, will be updated when used
          mockDataAvailable,
          description: ''
        });
      }
    }
  }
  
  /**
   * Check if mock data is available for an endpoint
   */
  private checkMockDataAvailability(path: string, method: string): boolean {
    // This is a heuristic and may need refinement based on your project structure
    const pathParts = path.split('/');
    const resourceName = pathParts[pathParts.length - 1];
    
    // Check if there's a matching mock data file
    const mockDataFiles = ['users', 'products', 'transactions'];
    return mockDataFiles.some(file => resourceName.toLowerCase().includes(file));
  }
  
  /**
   * Set whether to use mock data
   * @param useMock Whether to use mock data
   */
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }
  
  /**
   * Create a mockable API function
   * @param mockData Mock data
   * @param apiFunction Real API function
   * @param endpointInfo Information about the endpoint
   * @returns Function that uses either mock or real data
   */
  createMockableApi<T, P extends any[]>(
    mockData: T,
    apiFunction: (...args: P) => Promise<T>,
    endpointInfo?: { method: string; path: string; name: string }
  ): (...args: P) => Promise<T> {
    // Update endpoint status if info is provided
    if (endpointInfo) {
      const key = `${endpointInfo.method}:${endpointInfo.path}`;
      const status = this.endpointStatuses.get(key) || {
        path: endpointInfo.path,
        method: endpointInfo.method,
        name: endpointInfo.name,
        folder: '',
        integrated: true,
        mockDataAvailable: true,
        lastUsed: new Date()
      };
      
      status.integrated = true;
      status.mockDataAvailable = true;
      this.endpointStatuses.set(key, status);
    }
    
    return async (...args: P): Promise<T> => {
      // Update last used timestamp if info is provided
      if (endpointInfo) {
        const key = `${endpointInfo.method}:${endpointInfo.path}`;
        const status = this.endpointStatuses.get(key);
        if (status) {
          status.lastUsed = new Date();
          this.endpointStatuses.set(key, status);
        }
      }
      
      if (this.useMockData) {
        return Promise.resolve(mockData);
      }
      return apiFunction(...args);
    };
  }
  
  /**
   * Get all endpoint statuses
   * @returns Array of endpoint statuses
   */
  getAllEndpointStatuses(): EndpointStatus[] {
    return Array.from(this.endpointStatuses.values());
  }
  
  /**
   * Get integrated endpoints
   * @returns Array of integrated endpoint statuses
   */
  getIntegratedEndpoints(): EndpointStatus[] {
    return this.getAllEndpointStatuses().filter(status => status.integrated);
  }
  
  /**
   * Get non-integrated endpoints
   * @returns Array of non-integrated endpoint statuses
   */
  getNonIntegratedEndpoints(): EndpointStatus[] {
    return this.getAllEndpointStatuses().filter(status => !status.integrated);
  }
  
  /**
   * Mark an endpoint as integrated
   * @param method HTTP method
   * @param path API path
   * @param integrated Whether the endpoint is integrated
   */
  markEndpointIntegration(method: string, path: string, integrated: boolean): void {
    const key = `${method}:${path}`;
    const status = this.endpointStatuses.get(key);
    if (status) {
      status.integrated = integrated;
      this.endpointStatuses.set(key, status);
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export utility to generate the API client
export function generateApiClientFile(): void {
  const code = generateApiClient();
  console.log('Generated API client code:', code);
  // In a real implementation, this would write to a file
  // But for browser usage, we'll just log it
}
