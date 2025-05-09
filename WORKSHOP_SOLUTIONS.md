# Unborked Mobile Workshop Solutions

This document contains information about the intentionally broken parts of the application and how to fix them. These issues are designed for teaching debugging techniques in a React Native application.

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
- First navigate to: `app/product/[id].tsx` - Contains the "Add to Cart" function
- Then navigate to: `contexts/CartContext.tsx` - Contains the cart functionality
- Also check: `components/CartItem.tsx` - For error handling in cart items

**Problem**: Adding products to the cart fails with an error "Cannot add product to cart: Missing SKU identifier". This happens because the cart functionality expects products to have a 'sku' property that doesn't exist in the Product type.

**Location**:
- `contexts/CartContext.tsx` - The addItem function checks for a non-existent 'sku' property
- `app/product/[id].tsx` - The product detail page tries to add products without the required property
- `components/CartItem.tsx` - When trying to update quantities in the cart, the same error can occur

**Error Details**:
In `CartContext.tsx`, the addItem function expects products to have a 'sku' property:

```javascript
// BROKEN: Check for a 'sku' property that doesn't exist in the Product type
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

The error will appear in multiple places:
1. When trying to add a product to the cart from the product detail page
2. When trying to increase the quantity of an item in the cart
3. Any other action that calls the `addItem` function

**Solution**:
There are two ways to fix this issue:

1. Remove the SKU check in `contexts/CartContext.tsx`:

```javascript
// Remove or comment out the SKU check
// if (!(product as any).sku) {
//   throw new Error('Cannot add product to cart: Missing SKU identifier');
// }
```

2. Add a SKU property to the product before adding it to the cart in `app/product/[id].tsx`:

```javascript
// Add a SKU property to the product
const productWithSku = { ...product, sku: `SKU-${product.id}` };
addItem(productWithSku, quantity);
```

**Error Handling Implementation**:
The application has been set up to handle this error gracefully in multiple places:

1. Product detail page (`app/product/[id].tsx`):
   - Try/catch block around the addItem call
   - Error state to display the error message to the user
   - Alert to make the error more visible

2. Cart item component (`components/CartItem.tsx`):
   - Try/catch blocks around quantity update actions
   - Passes errors up to the parent component via the onError callback

3. Cart page (`app/(tabs)/cart.tsx`):
   - Displays errors that bubble up from CartItem components
   - Provides a way to dismiss errors

## Checkout Issues
s
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
Fix the processApplePayPayment method in `services/PaymentService.ts` to properly fetch and use the address details:

```javascript
// Get the full address object from the ID
const address = this.getAddressById(addressId);
if (!address) {
  return {
    success: false,
    error: 'Invalid shipping address'
  };
}

// Process Apple Pay with the shipping address
const applePayPayload = {
  amount: total,
  shippingAddress: {
    streetAddress: [address.line1, address.line2].filter(Boolean).join(' '),
    city: address.city,
    state: address.state, 
    postalCode: address.postalCode,
    country: address.country
  }
};

// Success!
return {
  success: true,
  transactionId: `applepay-${Date.now()}`
};
```

## Navigation Issues

<!-- Add other broken parts of the application here as they are implemented -->

## Data Fetching Issues

<!-- Add other broken parts of the application here as they are implemented -->

## State Management Issues

<!-- Add other broken parts of the application here as they are implemented -->

## Performance Issues

<!-- Add other broken parts of the application here as they are implemented -->

---

This document will be updated as more debugging challenges are added to the application. Each section provides information about the issue, where to find it, and how to fix it. 