import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/CartItem';
import Button from '@/components/Button';
import { ArrowRight, ShoppingBag } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function Cart() {
  const { items, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      router.push('/checkout');
      setIsCheckingOut(false);
    }, 1000);
  };

  const navigateToShop = () => {
    router.navigate('/(tabs)');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.duration(800)}
        >
          <Text style={styles.title}>Your Cart</Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.emptyContainer}
          entering={FadeIn.delay(300).duration(800)}
        >
          <View style={styles.emptyIconContainer}>
            <ShoppingBag size={64} color="#FF0000" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyMessage}>
            Browse our error fixes and add some items to your cart
          </Text>
          <Button 
            title="Start Shopping" 
            onPress={navigateToShop}
            style={styles.shopButton}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(800)}
      >
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
      />
      
      <Animated.View 
        style={styles.footer}
        entering={FadeInDown.delay(300).duration(800)}
      >
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${(total * 0.08).toFixed(2)}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${(total * 1.08).toFixed(2)}</Text>
        </View>
        
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          style={styles.checkoutButton}
          loading={isCheckingOut}
          icon={<ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 4 }} />}
          iconPosition="right"
        />
      </Animated.View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  clearText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF0000',
  },
  cartList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  footer: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 16,
    borderTopWidth: 1,
    borderColor: '#333333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FF0000',
  },
  checkoutButton: {
    height: 56,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  shopButton: {
    width: '80%',
  },
});