/**
 * Product Rules Service
 * 
 * This service centralizes business rules for product pricing, 
 * purchase limitations, and dropdown options based on vehicle types
 * and other constraints.
 */

// Vehicle types
export enum VehicleType {
  KEKE = 'keke',
  CAR = 'car',
  OTHER = 'other'
}

// Product types
export enum ProductType {
  PMS = 'PMS',
  CNG = 'CNG',
  LPG = 'LPG',
}

// Interface for product amount rules
interface AmountRule {
  min: number;
  max: number;
  step: number;
}

// Rules configuration based on product and vehicle type
export const amountRules: Record<string, Record<string, AmountRule>> = {
  [ProductType.PMS]: {
    [VehicleType.KEKE]: { min: 5000, max: 10000, step: 1000 },
    [VehicleType.CAR]: { min: 10000, max: 20000, step: 1000 },
    [VehicleType.OTHER]: { min: 5000, max: 20000, step: 1000 }
  },
  [ProductType.CNG]: {
    [VehicleType.KEKE]: { min: 1000, max: 5000, step: 1000 },
    [VehicleType.CAR]: { min: 5000, max: 15000, step: 1000 },
    [VehicleType.OTHER]: { min: 1000, max: 15000, step: 1000 }
  },
  [ProductType.LPG]: {
    [VehicleType.KEKE]: { min: 3000, max: 8000, step: 1000 },
    [VehicleType.CAR]: { min: 5000, max: 15000, step: 1000 },
    [VehicleType.OTHER]: { min: 3000, max: 15000, step: 1000 }
  },
};

/**
 * Get the appropriate amount rule based on product and vehicle type
 */
export function getAmountRule(product: string, vehicleType: string): AmountRule {
  // Normalize the product and vehicle type
  const normalizedProduct = product.toUpperCase();
  const normalizedVehicleType = vehicleType.toLowerCase();

  // Get product rules, fallback to CNG if product not found
  const productRules = amountRules[normalizedProduct] || amountRules[ProductType.CNG];
  
  // Get vehicle rules, fallback to OTHER if vehicle type not found
  return productRules[normalizedVehicleType] || productRules[VehicleType.OTHER];
}

/**
 * Generate amount options based on product and vehicle type
 */
export function generateAmountOptions(product: string, vehicleType: string): number[] {
  const { min, max, step } = getAmountRule(product, vehicleType);
  const options: number[] = [];
  
  for (let amount = min; amount <= max; amount += step) {
    options.push(amount);
  }
  
  return options;
}

/**
 * Generate partial payment options based on full amount due
 */
export function generatePartialPaymentOptions(
  fullAmount: number, 
  product: string, 
  vehicleType: string
): number[] {
  const { min, step } = getAmountRule(product, vehicleType);
  const options: number[] = [];
  
  // For partial payments, start at the minimum and go up to 
  // the full amount minus the step (must leave some balance)
  const maxPartial = fullAmount - step;
  
  for (let amount = min; amount <= maxPartial; amount += step) {
    options.push(amount);
  }
  
  return options;
}

export default {
  getAmountRule,
  generateAmountOptions,
  generatePartialPaymentOptions
}; 