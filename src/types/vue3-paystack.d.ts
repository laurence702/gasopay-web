declare module 'vue3-paystack' {
  import { DefineComponent } from 'vue';
  
  interface PaystackOptions {
    publicKey: string;
    email: string;
    amount: number;
    reference: string;
    currency?: string;
    channels?: string[];
    label?: string;
    plan?: string;
    quantity?: number;
    subaccount?: string;
    splitCode?: string;
    transactionCharge?: number;
    bearer?: string;
    'data-custom-button'?: string;
    onSuccess: (response: any) => void;
    onCancel: () => void;
  }

  const Paystack: DefineComponent<{
    'button-class'?: string;
    'button-text'?: string;
    'public-key': string;
    email: string;
    amount: number;
    reference: string;
    'on-success': (response: any) => void;
    'on-cancel': () => void;
    'currency'?: string;
    'channels'?: string[];
    'label'?: string;
    'plan'?: string;
    'quantity'?: number;
    'subaccount'?: string;
    'split-code'?: string;
    'transaction-charge'?: number;
    'bearer'?: string;
    'data-custom-button'?: string;
  }>;

  export default Paystack;
}
