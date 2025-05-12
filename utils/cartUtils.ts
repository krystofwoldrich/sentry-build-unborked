import { Product } from '../types/product';
import { Alert } from 'react-native';

/**
 * Utility function to prepare a product for adding to cart
 * This centralizes the SKU addition logic so it only needs to be fixed in one place
 */
export const prepareProductForCart = (product: Product) => {
  // WORKING VERSION (uncomment to fix):
  // // Add a SKU property to the product (the only way to fix this issue)
  //   return { ...product, sku: `SKU-${product.id}` };
  
  // BROKEN: This will return the product without the required SKU property
  return product;
}; 

/**
 * Centralized function to handle adding a product to cart
 * This simplifies debugging by ensuring cart additions are handled consistently
 * 
 * @param addItemFn - Function to add item to cart (from useCart hook)
 * @param product - The product to add to cart
 * @param quantity - The quantity to add (defaults to 1)
 * @param onSuccess - Optional callback to run after successful addition
 * @param onError - Optional callback to handle errors
 * @returns void
 */
export const handleAddToCart = (
  addItemFn: (product: Product, quantity: number) => void,
  product: Product, 
  quantity: number = 1,
  onSuccess?: () => void,
  onError?: (errorMessage: string) => void
) => {
  try {
    // Use the shared utility function to prepare the product
    const preparedProduct = prepareProductForCart(product);
    addItemFn(preparedProduct, quantity);
    
    // If successful and callback provided, call it
    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    // Handle the error
    const errorMessage = error.message || 'Failed to add item to cart';
    
    // If error callback provided, call it
    if (onError) {
      onError(errorMessage);
    } else {
      // Default error handling
      console.error('Add to cart failed:', error);
      Alert.alert('Error', errorMessage);
    }
    
    // Rethrow the error for better debugging visibility
    throw new Error(`Add to cart failed: ${errorMessage}`);
  }
}; 