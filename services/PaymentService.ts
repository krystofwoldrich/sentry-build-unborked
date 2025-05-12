import { Address, PaymentMethod, CartItem } from '../types/product';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class PaymentService {
  /**
   * Process a payment using the selected payment method
   */
  static async processPayment(
    paymentMethodId: string,
    addressId: string | null,
    items: CartItem[],
    total: number
  ): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find selected payment method
    const paymentMethod = this.getPaymentMethodById(paymentMethodId);
    
    if (!paymentMethod) {
      return {
        success: false,
        error: 'Payment method not found'
      };
    }
    
    // Process payment based on type
    switch (paymentMethod.type) {
      case 'card':
        return this.processCardPayment(paymentMethod, total);
      case 'paypal':
        return this.processPayPalPayment(total);
      case 'applepay':
        return this.processApplePayPayment(addressId, total);
      default:
        return {
          success: false,
          error: 'Unsupported payment method'
        };
    }
  }
  
  /**
   * Process a credit card payment
   */
  private static processCardPayment(
    paymentMethod: PaymentMethod,
    total: number
  ): PaymentResult {
    // Simulate successful card payment
    return {
      success: true,
      transactionId: `card-${Date.now()}`
    };
  }
  
  /**
   * Process a PayPal payment
   */
  private static processPayPalPayment(total: number): PaymentResult {
    // Simulate successful PayPal payment
    return {
      success: true,
      transactionId: `paypal-${Date.now()}`
    };
  }
  
  /**
   * Process an Apple Pay payment
   * BROKEN: Requires shipping address but doesn't properly pass it
   */
  private static processApplePayPayment(
    addressId: string | null,
    total: number
  ): PaymentResult {
    // BROKEN: Apple Pay requires a shipping address to process the payment
    // but the address isn't being correctly passed to the payment processor
    
    // This is intentionally broken - in a real app, we would validate and use
    // the address information, but here we're creating an error condition
    
    if (addressId === null) {
      const error = new Error('Shipping address is required for Apple Pay');
      console.error(error);
      throw error; // Actually throw the error
    }
    
    // WORKING VERSION (uncomment to fix):
    // if (addressId === null) {
    //   return {
    //     success: false,
    //     error: 'Shipping address is required for Apple Pay'
    //   };
    // }
    //
    // // Success!
    // return {
    //   success: true,
    //   transactionId: `applepay-${Date.now()}`
    // };
    
    const addressError = new Error('Apple Pay transaction failed: Shipping address information is invalid or incomplete.');
    console.error(addressError);
    throw addressError; // Actually throw the error
  }
  
  /**
   * Helper method to get a payment method by ID
   */
  private static getPaymentMethodById(id: string): PaymentMethod | undefined {
    // Import here to avoid circular dependencies
    const { paymentMethods } = require('../data/products');
    return paymentMethods.find((method: PaymentMethod) => method.id === id);
  }
  
  /**
   * Helper method to get an address by ID
   */
  private static getAddressById(id: string): Address | undefined {
    // Import here to avoid circular dependencies
    const { addresses } = require('../data/products');
    return addresses.find((address: Address) => address.id === id);
  }
} 