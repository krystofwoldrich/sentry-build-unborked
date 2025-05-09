import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, MapPin, Check, Radio as RadioIcon } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/Button';
import { paymentMethods, addresses } from '@/data/products';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { PaymentService } from '@/services/PaymentService';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        clearCart();
        router.push('/(tabs)');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Process payment with our service
      const result = await PaymentService.processPayment(
        selectedPayment,
        selectedAddress,
        items,
        total
      );
      
      if (result.success) {
        // Payment succeeded
        setStep(3);
      } else {
        // Payment failed
        setError(result.error || 'Payment failed. Please try again.');
        Alert.alert('Payment Failed', result.error || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const renderPaymentMethod = (method: any) => {
    let icon;
    let label;
    
    switch (method.type) {
      case 'card':
        icon = <CreditCard size={20} color="#FF0000" />;
        label = `${method.cardType} •••• ${method.last4}`;
        break;
      case 'paypal':
        icon = <Text style={styles.paymentIcon}>P</Text>;
        label = 'PayPal';
        break;
      case 'applepay':
        icon = <Text style={styles.paymentIcon}>A</Text>;
        label = 'Apple Pay';
        break;
      default:
        icon = <CreditCard size={20} color="#FF0000" />;
        label = 'Card';
    }
    
    return (
      <TouchableOpacity
        key={method.id}
        style={[
          styles.paymentMethod,
          selectedPayment === method.id && styles.selectedPaymentMethod,
        ]}
        onPress={() => setSelectedPayment(method.id)}
      >
        <View style={styles.paymentMethodIcon}>{icon}</View>
        <View style={styles.paymentMethodDetails}>
          <Text style={styles.paymentMethodText}>{label}</Text>
          {method.expiryDate && (
            <Text style={styles.paymentMethodSubtext}>Expires {method.expiryDate}</Text>
          )}
        </View>
        <View style={[styles.radioButton, selectedPayment === method.id && styles.radioButtonSelected]}>
          {selectedPayment === method.id && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderAddressItem = (address: any) => {
    return (
      <TouchableOpacity
        key={address.id}
        style={[
          styles.addressItem,
          selectedAddress === address.id && styles.selectedAddressItem,
        ]}
        onPress={() => setSelectedAddress(address.id)}
      >
        <View style={styles.addressIcon}>
          <MapPin size={20} color="#FF0000" />
        </View>
        <View style={styles.addressDetails}>
          <Text style={styles.addressName}>{address.name}</Text>
          <Text style={styles.addressText}>{address.line1}</Text>
          {address.line2 && <Text style={styles.addressText}>{address.line2}</Text>}
          <Text style={styles.addressText}>
            {address.city}, {address.state} {address.postalCode}
          </Text>
        </View>
        <View style={[styles.radioButton, selectedAddress === address.id && styles.radioButtonSelected]}>
          {selectedAddress === address.id && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderStep1 = () => (
    <Animated.View entering={FadeIn.duration(400)}>
      <Text style={styles.sectionTitle}>Shipping Address</Text>
      {addresses.map(renderAddressItem)}
      
      <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>Payment Method</Text>
      {paymentMethods.map(renderPaymentMethod)}
      
      <Button
        title="Continue to Review"
        onPress={() => setStep(2)}
        style={styles.continueButton}
      />
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View entering={FadeIn.duration(400)}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      
      <View style={styles.orderSummary}>
        {items.map(item => (
          <View key={item.product.id} style={styles.orderItem}>
            <Text style={styles.orderItemName}>{item.product.name}</Text>
            <View style={styles.orderItemDetails}>
              <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${(total * 0.08).toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${(total * 1.08).toFixed(2)}</Text>
        </View>
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <Button
        title="Place Order"
        onPress={handlePayment}
        loading={isProcessing}
        style={styles.payButton}
      />
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={styles.confirmationContainer} entering={FadeIn.duration(600)}>
      <View style={styles.successIcon}>
        <Check size={40} color="#FF0000" />
      </View>
      <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
      <Text style={styles.confirmationText}>
        Your order has been placed successfully. You'll receive an email confirmation shortly.
      </Text>
      <Text style={styles.orderNumber}>Order #2025-04-{Math.floor(Math.random() * 10000)}</Text>
      <Text style={styles.thankYou}>Thank you for your purchase!</Text>
      
      <Animated.View entering={FadeInDown.delay(500)}>
        <Text style={styles.redirectText}>Redirecting to home...</Text>
      </Animated.View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {step < 3 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {step === 1 ? 'Checkout' : step === 2 ? 'Review Order' : 'Confirmation'}
        </Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sectionTitleSpacing: {
    marginTop: 24,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  selectedPaymentMethod: {
    borderColor: '#FF0000',
    backgroundColor: '#1A0000',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1A0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentIcon: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF0000',
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  paymentMethodSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FF0000',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  selectedAddressItem: {
    borderColor: '#FF0000',
    backgroundColor: '#1A0000',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1A0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  continueButton: {
    marginTop: 24,
  },
  orderSummary: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderItemName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  orderItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemQuantity: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginRight: 8,
  },
  orderItemPrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF0000',
    minWidth: 70,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF0000',
  },
  payButton: {
    marginTop: 8,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  confirmationTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  confirmationText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  orderNumber: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FF0000',
    marginBottom: 8,
  },
  thankYou: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  redirectText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: '#1A0000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FF0000',
    textAlign: 'center',
  },
});