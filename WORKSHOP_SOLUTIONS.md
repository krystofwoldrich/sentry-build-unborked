# Unborked Mobile Workshop Solutions

This document contains information about the intentionally broken parts of the application and how to fix them. These issues are designed for teaching debugging techniques in a React Native application.

## Code Structure

Throughout the codebase, we've structured the intentional bugs in a consistent way to make them easy to identify and fix:

1. The working solution is commented out directly above the broken code:
   ```javascript
   // WORKING VERSION (uncomment to fix):
   // const demoUsername = 'demo';
   // const demoPassword = 'demo123';
   // await loginWithSSO(demoUsername, demoPassword);
   
   // BROKEN: Missing password parameter for SSO login
   const demoUsername = 'demo';
   await loginWithSSO(demoUsername);
   ```

2. The broken code includes comments explaining what's broken and why:
   ```javascript
   // BROKEN: This will throw an error because the product doesn't have a 'sku' property
   addItem(product, quantity);
   ```

3. In some cases, we've added explicit error messages to make the issue clearer:
   ```javascript
   if (!password) {
     throw new Error('SSO authentication failed: Missing credentials');
   }
   ```

4. For shared functionality, we've centralized the broken code and its fix in utility files:
   ```javascript
   // In utils/cartUtils.ts
   export const prepareProductForCart = (product: Product) => {
     // WORKING VERSION (uncomment to fix):
     // return { ...product, sku: `SKU-${product.id}` };
     
     // BROKEN: This will return the product without the required SKU property
     return product;
   };
   ```

This structure makes it easy to toggle between broken and working implementations by simply commenting/uncommenting code sections. It also ensures that all bugs have readily available solutions.

## Error Handling Implementation

All errors in the application are set up to:
1. Display user-friendly error messages in the UI
2. Log detailed error information to the console using `console.error()`
3. Throw actual errors that will appear in debuggers and crash reporting tools using `throw new Error()`

This implementation helps demonstrate real-world debugging scenarios where errors need to be caught, displayed to users, and logged for developers. The approach of throwing actual errors (rather than just logging them) makes the errors more visible in debuggers, crash reporting tools like Sentry, and React's error boundaries.

Examples of this pattern can be found throughout the app:

```javascript
try {
  // Some operation that might fail
} catch (error: any) {
  // 1. Display user-friendly error
  setError(error.message || 'A friendly error message');
  
  // 2. Log to console
  console.error('Descriptive context:', error);
  
  // 3. Rethrow with context for debuggers and monitoring tools
  throw new Error(`Operation failed: ${error.message || 'Unknown error'}`);
}
```

## Authentication Issues

### 1. SSO Login Failure

**Files to Navigate to:**
- First navigate to: `app/(auth)/login.tsx` - Contains the login handler
- Then navigate to: `contexts/AuthContext.tsx` - Contains the authentication context

**Problem**: The Single Sign-On (SSO) login fails with the error "Login failed. Please try again." This happens because the SSO login function is not receiving a required password parameter.

**Location**: 
- `app/(auth)/login.tsx` - The login handler isn't sending the password parameter
- `contexts/AuthContext.tsx` - The authentication context expects a password parameter

**Error Details**:
The error occurs because in `login.tsx`, the SSO login only passes the username:

```javascript
// BROKEN:
const demoUsername = 'demo';
await loginWithSSO(demoUsername);
```

Meanwhile, in `AuthContext.tsx`, the `loginWithSSO` function requires a password:

```javascript
// BROKEN: This will throw an error if password is missing
if (!password) {
  throw new Error('SSO authentication failed: Missing credentials');
}
```

**Solution**:
Update the login handler in `app/(auth)/login.tsx` to pass both username and password:

```javascript
const demoUsername = 'demo';
const demoPassword = 'demo123';
await loginWithSSO(demoUsername, demoPassword);
```

Alternatively, modify the `loginWithSSO` function in `contexts/AuthContext.tsx` to not require a password:

```javascript
// Remove the password check
// if (!password) {
//   throw new Error('SSO authentication failed: Missing credentials');
// }
```

## Shopping Cart Issues

### 1. Add to Cart Failure

**Files to Navigate to:**
- First navigate to: `utils/cartUtils.ts` - Contains the shared cart preparation logic
- Then navigate to: `contexts/CartContext.tsx` - Contains the cart functionality
- Related files: `app/product/[id].tsx` and `components/ProductCard.tsx` - Both use the shared utility

**Problem**: Adding products to the cart fails with an error "Cannot add product to cart: Missing SKU identifier". This happens because the cart functionality expects products to have a 'sku' property that doesn't exist in the Product type.

**Location**:
- `utils/cartUtils.ts` - The centralized utility for preparing products for the cart
- `contexts/CartContext.tsx` - The addItem function checks for a non-existent 'sku' property
- `app/product/[id].tsx` - Uses the utility to prepare products before adding to cart
- `components/ProductCard.tsx` - Also uses the utility for the "plus" button add to cart function

**Error Details**:
In `CartContext.tsx`, the addItem function expects products to have a 'sku' property:

```javascript
// Check for a 'sku' property that doesn't exist in the Product type
if (!(product as any).sku) {
  throw new Error('Cannot add product to cart: Missing SKU identifier');
}
```

However, in the Product type definition (in `types/product.ts`), there is no 'sku' field:

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'runtime' | 'syntax' | 'logic' | 'performance' | 'security';
  image: string;
  rating: number;
  reviews: number;
  compatibleWith: string[];
}
```

The centralized logic for preparing products is in `utils/cartUtils.ts`, which currently doesn't add the required SKU property:

```javascript
// In utils/cartUtils.ts
export const prepareProductForCart = (product: Product) => {
  // WORKING VERSION (uncomment to fix):
  // return { ...product, sku: `SKU-${product.id}` };
  
  // BROKEN: This will return the product without the required SKU property
  return product;
};
```

Both the product detail page and product card components use this shared utility:

```javascript
// In app/product/[id].tsx
const preparedProduct = prepareProductForCart(product);
addItem(preparedProduct, quantity);

// In components/ProductCard.tsx
const preparedProduct = prepareProductForCart(product);
addItem(preparedProduct, 1);
```

The error will appear in multiple places:
1. When trying to add a product to the cart from the product detail page
2. When trying to add a product to the cart using the "plus" button on the product card in the main screen
3. When trying to increase the quantity of an item in the cart
4. Any other action that calls the `addItem` function

**Solution**:
The fix only needs to be made in one place - the `utils/cartUtils.ts` file. Edit the file and uncomment the working solution:

```javascript
// In utils/cartUtils.ts
export const prepareProductForCart = (product: Product) => {
  // WORKING VERSION (uncomment to fix):
  return { ...product, sku: `SKU-${product.id}` };
  
  // BROKEN: This will return the product without the required SKU property
  // return product;
};
```

By centralizing the fix in the utility function, both the product detail page and the main screen's plus button will work correctly once the utility function is fixed. This approach demonstrates:

1. **Single Responsibility Principle**: The product preparation logic is in one place
2. **DRY (Don't Repeat Yourself) Principle**: The same code isn't duplicated across components
3. **Maintainability**: Future changes to product preparation only need to be made in one place
4. **Consistency**: All parts of the application handle products in the same way

This centralized approach is common in real-world applications where shared business logic is extracted into utility functions or services.

**Error Handling Implementation**:
The application has been set up to handle this error gracefully in multiple places:

1. Product detail page (`app/product/[id].tsx`):
   - Try/catch block around the addItem call
   - Error state to display the error message to the user
   - Alert to make the error more visible
   - Throws the error with additional context for debugging tools

2. Product card component (`components/ProductCard.tsx`):
   - Try/catch block around the addItem call
   - Logs error to console
   - Comment indicates where a user-friendly error message would be shown in a real app

3. Cart item component (`components/CartItem.tsx`):
   - Try/catch blocks around quantity update actions
   - Passes errors up to the parent component via the onError callback
   - Throws errors with additional context for better debugging visibility

4. Cart page (`app/(tabs)/cart.tsx`):
   - Displays errors that bubble up from CartItem components
   - Provides a way to dismiss errors

## Checkout Issues

### 1. Apple Pay Payment Failure

**Files to Navigate to:**
- First navigate to: `app/checkout.tsx` - Contains the checkout UI and payment process
- Then navigate to: `services/PaymentService.ts` - Contains the payment processing logic

**Problem**: Apple Pay payments fail with the error "Apple Pay transaction failed: Shipping address information is invalid or incomplete." This happens because the Apple Pay processor requires shipping address details, but they're not being correctly passed.

**Location**:
- `services/PaymentService.ts` - The processApplePayPayment method fails to properly use the address information
- `app/checkout.tsx` - The checkout page displays the error when Apple Pay is selected

**Error Details**:
In `PaymentService.ts`, the Apple Pay processor doesn't properly use the address information:

```javascript
// BROKEN: Even if addressId is provided, we're not fetching or using the actual address details
// The Apple Pay API requires the complete address object, not just the ID

// Instead, we just return an error
return {
  success: false,
  error: 'Apple Pay transaction failed: Shipping address information is invalid or incomplete.'
};
```

The issue is that we're only passing the address ID, but the Apple Pay API requires the complete address object with all shipping details.

**Solution**:
Fix the `processApplePayPayment` method in `services/PaymentService.ts` by uncommenting the working code and commenting out the broken code:

```javascript
// WORKING VERSION (uncomment to fix):
const address = this.getAddressById(addressId);
if (!address) {
  return {
    success: false,
    error: 'Invalid shipping address'
  };
}

// In a real app, we would use the address details to create a payload
// and send it to the Apple Pay API

// Success!
return {
  success: true,
  transactionId: `applepay-${Date.now()}`
};

// BROKEN: Comment out this code
// const addressError = new Error('Apple Pay transaction failed: Shipping address information is invalid or incomplete.');
// console.error(addressError);
// throw addressError;
```

The fix works because we're retrieving and validating the address using the address ID before processing the payment, which is required for Apple Pay transactions.

## Navigation Issues

<!-- Add other broken parts of the application here as they are implemented -->

## Data Fetching Issues

<!-- Add other broken parts of the application here as they are implemented -->

## State Management Issues

<!-- Add other broken parts of the application here as they are implemented -->

## Performance Issues

<!-- Add other broken parts of the application here as they are implemented -->

---

## Removed Components

The following components were removed from the application during development:

1. `contexts/ErrorContext.tsx` - A centralized error context was removed in favor of component-level error handling
2. `components/ErrorBanner.tsx` - The centralized error banner was removed in favor of component-specific error display mechanisms

This change was made to better demonstrate debugging techniques by having errors appear directly in the components where they occur, rather than being aggregated in a centralized location.

---

This document will be updated as more debugging challenges are added to the application. Each section provides information about the issue, where to find it, and how to fix it. 