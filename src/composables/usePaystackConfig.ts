import { computed } from 'vue';

export interface PaystackConfig {
  publicKey: string;
  channels: string[];
  currency: string;
  plan: string;
  quantity: number;
  subaccount: string;
  split_code: string;
  split: Record<string, unknown>;
  bearer: string;
  metadata: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string | number | boolean;
    }>;
  };
  transaction_charge: number;
}

export interface UsePaystackConfigReturn {
  config: PaystackConfig;
  isTestMode: boolean;
  configRef: {
    value: PaystackConfig;
  };
  isTestModeRef: {
    value: boolean;
  };
}

export function usePaystackConfig(): UsePaystackConfigReturn {
  const isTestMode = computed<boolean>(() => {
    const envValue = import.meta.env.VITE_PAYSTACK_TEST_MODE;
    if (typeof envValue === 'string') {
      return envValue === 'true' || 
             envValue === '1' || 
             (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '').startsWith('pk_test_');
    }
    return (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '').startsWith('pk_test_');
  });
  
  // Default test key if not set
  const defaultTestKey = isTestMode.value 
    ? 'pk_test_your_test_key_here' 
    : 'pk_live_your_live_key_here';

  const config = computed(() => ({
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || defaultTestKey,
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    currency: 'NGN',
    plan: '',
    quantity: 1,
    subaccount: '',
    split_code: '',
    split: {},
    bearer: 'account',
    metadata: {
      custom_fields: [
        ...(isTestMode.value ? [
          // Test metadata for bank transfer
          { display_name: 'Test Mode', variable_name: 'test_mode', value: 'true' },
          { display_name: 'Test Bank', variable_name: 'test_bank', value: 'test-bank' },
          { display_name: 'Test Account', variable_name: 'test_account', value: 'test-account' }
        ] : [])
      ]
    },
    transaction_charge: 0,
  }));

  // Return both the computed refs and their unwrapped values for convenience
  return {
    config: config.value,
    isTestMode: isTestMode.value,
    configRef: config,
    isTestModeRef: isTestMode
  };
}
