// Type definitions for vue3-paystack
import { Component } from 'vue';

export interface PaystackSuccessResponse {
  message: string;
  reference: string;
  status: string;
  transaction: string;
  trxref: string;
  amount?: number;
  currency?: string;
}

declare module 'vue3-paystack' {
  export interface PaystackButtonProps {
    'public-key': string;
    email: string;
    amount: number;
    reference: string;
    channels?: string[];
    currency?: string;
    'on-success': (response: PaystackSuccessResponse) => Promise<void> | void;
    'on-close': () => void;
    'on-bank-transfer-confirm'?: (response: { reference: string }) => void;
    class?: string;
    disabled?: boolean;
  }

  const PaystackButton: Component<PaystackButtonProps>;
  export default PaystackButton;
}
