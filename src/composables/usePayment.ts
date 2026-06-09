import type {
  CreateOrderPayload,
  CreateOrderResponse,
  ErrorStates,
  LoadingStates,
  OrderDetails,
  PaystackResponse
} from '@/types';
import { computed, ref } from 'vue';

import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export function usePayment() {
  const authStore = useAuthStore();
  const router = useRouter();

  const loadingStates = ref<LoadingStates>({
    orderDetails: false,
    payment: false,
    orderCreation: false,
    whatsappRedirect: false,
  });

  const errorStates = ref<ErrorStates>({
    orderDetails: null,
    payment: null,
    orderCreation: null,
    general: null,
  });

  const isAnyLoading = computed(() => Object.values(loadingStates.value).some(state => state));
  const currentError = computed(() => 
    errorStates.value.orderDetails || 
    errorStates.value.payment || 
    errorStates.value.orderCreation || 
    errorStates.value.general
  );

  const calculateAmount = (quantity: string, pricePerKg: number): number => {
    const numericQuantity = parseFloat(quantity);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      return 0;
    }
    return numericQuantity * pricePerKg;
  };

  const formatAmountForPaystack = (amount: number): number => {
    return amount * 100; // Convert to kobo
  };

  const generatePaymentReference = (): string => {
    return `gasopay_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  };

  const handlePaymentSuccess = async (
    response: PaystackResponse, 
    orderDetails: OrderDetails,
    onSuccess?: (orderId: string) => void
  ): Promise<CreateOrderResponse> => {
    loadingStates.value.orderCreation = true;
    errorStates.value.orderCreation = null;

    try {
      // Log the full response for debugging
      console.log('Paystack payment response:', response);

      // Check if we're in test mode
      const isTestMode = import.meta.env.VITE_PAYSTACK_TEST_MODE === 'true';
      
      // Prepare order payload with payment details
      const orderPayload: CreateOrderPayload = {
        ...orderDetails,
        payment_reference: response.reference || `gasopay_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        payment_method: 'card',
        // Set status to paid in test mode, otherwise use the response status
        payment_status: isTestMode ? 'paid' : (response.status === 'success' ? 'paid' : 'pending'),
        payment_response: JSON.stringify(response),
        // Add any additional fields required by your API
      };

      try {
        // In test mode, we'll force success regardless of the actual response
        if (isTestMode) {
          console.log('Test mode: Forcing successful order creation');
          // Create a mock order ID if not provided
          const mockOrderId = `test_order_${Date.now()}`;
          
          // Trigger WhatsApp message with order details
          if (orderDetails.phone) {
            triggerWhatsAppMessage(orderDetails.quantity.toString(), mockOrderId);
          }
          
          // Send email notification
          try {
            await apiService.post('/notifications/order-confirmation', {
              orderId: mockOrderId,
              customerEmail: authStore.currentUser?.email,
              amount: orderDetails.amount,
              quantity: orderDetails.quantity,
              reference: orderPayload.payment_reference
            });
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
          }
          
          // Call the success callback if provided
          onSuccess?.(mockOrderId);
          
          // Show success message
          toast.success('Payment successful! Your test order has been placed.');
          
          // Return the mock order data
          return {
            id: mockOrderId,
            ...orderPayload,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as unknown as CreateOrderResponse;
        }
        
        // For production, process the order normally
        const newOrder = await apiService.post<CreateOrderResponse>(
          '/orders', 
          orderPayload, 
          authStore.token
        );

        // Clear loading state
        loadingStates.value.orderCreation = false;

        // Call success callback with order ID if provided
        if (newOrder?.id) {
          // Trigger WhatsApp message with order details
          if (orderDetails.phone) {
            triggerWhatsAppMessage(orderDetails.quantity.toString(), newOrder.id);
          }
          
          // Send email notification
          try {
            await apiService.post('/notifications/order-confirmation', {
              orderId: newOrder.id,
              customerEmail: authStore.currentUser?.email,
              amount: orderDetails.amount,
              quantity: orderDetails.quantity,
              reference: orderPayload.payment_reference
            });
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
          }
          
          // Call the success callback if provided
          onSuccess?.(newOrder.id);
          
          // Show success message
          toast.success('Payment successful! Your order has been placed.');
          
          return newOrder;
        }
        
        throw new Error('Failed to create order: No order ID returned');
        
      } catch (apiError) {
        console.error('Order creation failed:', apiError);
        // Even if order creation fails, we'll still show success to the user
        // since the payment was already processed by Paystack
        toast.success('Payment successful! Your order is being processed.');
        
        // Try to send a notification to admin about the partial success
        try {
          await apiService.post('/notifications/admin', {
            type: 'order_creation_failed',
            message: `Order creation failed after successful payment. Reference: ${response.reference}`,
            data: {
              error: apiError instanceof Error ? apiError.message : 'Unknown error',
              orderDetails,
              paymentResponse: response
            }
          });
        } catch (notifError) {
          console.error('Failed to send admin notification:', notifError);
        }
        
        // Re-throw the error to be handled by the caller
        throw new Error('Payment successful, but there was an issue creating your order. Our team has been notified.');
      }
    } catch (error) {
      loadingStates.value.orderCreation = false;
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment';
      errorStates.value.orderCreation = errorMessage;
      throw error;
    }
  };

  const handlePaymentCancel = (): void => {
    errorStates.value.payment = 'Payment was cancelled.';
  };

  const handlePaymentError = (error: unknown): void => {
    console.error('Payment error:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred during payment processing';
      
    errorStates.value.payment = errorMessage;
    errorStates.value.general = errorMessage;
    loadingStates.value.payment = false;
    
    // Log the error for monitoring
    if (import.meta.env.PROD) {
      // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
      // logErrorToService('payment_error', error);
    }
  };

  const triggerWhatsAppMessage = (quantity: string, orderId?: string): void => {
    try {
      loadingStates.value.whatsappRedirect = true;
      const phoneNumber = import.meta.env.VITE_WHATSAPP_SUPPORT_NUMBER || '+2348123456789';
      const message = `Hello, I just placed an order for ${quantity}kg of gas.${orderId ? ` My order reference is ${orderId}.` : ''}`;
      const encodedMessage = encodeURIComponent(message);
      
      // Open WhatsApp in a new tab
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Handle cases where popup might be blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback to direct URL if popup is blocked
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('Failed to open WhatsApp:', error);
      // Provide alternative contact method if WhatsApp fails
      errorStates.value.general = 'Could not open WhatsApp. Please contact support directly.';
    } finally {
      loadingStates.value.whatsappRedirect = false;
    }
  };

  const resetStates = (): void => {
    loadingStates.value = {
      orderDetails: false,
      payment: false,
      orderCreation: false,
      whatsappRedirect: false,
    };
    errorStates.value = {
      orderDetails: null,
      payment: null,
      orderCreation: null,
      general: null,
    };
  };

  const clearErrors = (): void => {
    errorStates.value.orderDetails = null;
    errorStates.value.payment = null;
    errorStates.value.orderCreation = null;
    errorStates.value.general = null;
  };

  return {
    loadingStates,
    errorStates,
    isAnyLoading,
    currentError,
    calculateAmount,
    formatAmountForPaystack,
    generatePaymentReference,
    handlePaymentSuccess,
    handlePaymentCancel,
    handlePaymentError,
    triggerWhatsAppMessage,
    resetStates,
    clearErrors,
  };
}