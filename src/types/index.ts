export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  unit: string;
}

export interface Order {
  id: string;
  total_amount: string;
  status: 'paid' | 'pending' | 'failed' | 'cancelled' | 'partial' | 'completed';
  created_at: string;
}

// Payment Flow Interfaces
export interface OrderDetails {
  quantity: string;
  address: string;
  phone: string;
  productId: string;
  amount: number;
}

export interface PaymentStep {
  step: 'order-details' | 'payment';
  title: string;
  description: string;
}

export interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
  redirecturl?: string;
}

export interface PaystackConfig {
  email: string;
  amount: number;
  reference: string;
  publicKey: string;
  currency?: string;
  channels?: string[];
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
}

export interface CreateOrderPayload extends Record<string, unknown> {
  product_id: string;
  quantity: number;
  amount_paid: number;
  payment_reference: string;
  delivery_address: string;
  phone: string;
}

export interface CreateOrderResponse {
  id: string;
  product_id: string;
  quantity: number;
  amount_paid: number;
  payment_reference: string;
  delivery_address: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// WhatsApp Integration
export interface WhatsAppMessage {
  phone: string;
  message: string;
}

// Loading States
export interface LoadingStates {
  orderDetails: boolean;
  payment: boolean;
  orderCreation: boolean;
  whatsappRedirect: boolean;
}

// Error States
export interface ErrorStates {
  orderDetails: string | null;
  payment: string | null;
  orderCreation: string | null;
  general: string | null;
}
