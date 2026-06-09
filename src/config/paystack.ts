import { ref } from 'vue';

export interface PaystackConfig {
  publicKey: string;
  currency: string;
  channels: string[];
  callbackUrl: string;
  metadata: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

// Paystack configuration
export const usePaystackConfig = () => {
  const config = ref<PaystackConfig>({
    // Public key from environment variables with a default test key
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_yours_here',
    
    // Default currency (NGN for Naira)
    currency: 'NGN',
    
    // Payment channels to display
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    
    // Callback URL after successful payment
    callbackUrl: `${window.location.origin}/payment/callback`,
    
    // Additional metadata to send to Paystack
    metadata: {
      custom_fields: [
        {
          display_name: 'Paid Via',
          variable_name: 'paid_via',
          value: 'Gasopay Web App',
        },
      ],
    },
  });

  return {
    config,
  };
};

export default usePaystackConfig;
