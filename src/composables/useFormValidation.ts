import { ref } from 'vue';
import type { OrderDetails, FormValidationResult, ValidationError } from '@/types';

export function useFormValidation() {
  const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
    const error = errors.find(e => e.field === fieldName);
    return error ? error.message : null;
  };

  const formatPhoneNumber = (phone: string): string => {
    if (phone.startsWith('0')) {
      return `+234${phone.substring(1)}`;
    }
    if (phone.startsWith('234')) {
      return `+${phone}`;
    }
    return phone;
  };

  const validateOrderDetails = (orderDetails: OrderDetails): FormValidationResult => {
    const errors: ValidationError[] = [];

    if (!orderDetails.quantity) {
      errors.push({ field: 'quantity', message: 'Please select a quantity.' });
    }

    if (!orderDetails.address.trim()) {
      errors.push({ field: 'address', message: 'Delivery address is required.' });
    }

    if (!orderDetails.phone.trim()) {
      errors.push({ field: 'phone', message: 'Phone number is required.' });
    } else if (!/^(\+234|0)[789][01]\d{8}$/.test(orderDetails.phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid Nigerian phone number.' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return {
    getFieldError,
    formatPhoneNumber,
    validateOrderDetails,
  };
}