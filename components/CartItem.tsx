import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CartItem as CartItemType } from '../types/product';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { useCart } from '../contexts/CartContext';
import Animated, { FadeInRight, FadeOutRight, Layout } from 'react-native-reanimated';

interface CartItemProps {
  item: CartItemType;
  onError?: (message: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onError }) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const handleIncrease = () => {
    try {
      updateQuantity(product.id, quantity + 1);
    } catch (error: any) {
      if (onError) {
        onError(error.message || 'Failed to update quantity');
      }
      // Rethrow the error for better debugging visibility
      throw new Error(`Failed to increase quantity: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDecrease = () => {
    try {
      if (quantity > 1) {
        updateQuantity(product.id, quantity - 1);
      } else {
        removeItem(product.id);
      }
    } catch (error: any) {
      if (onError) {
        onError(error.message || 'Failed to update quantity');
      }
      // Rethrow the error for better debugging visibility
      throw new Error(`Failed to decrease quantity: ${error.message || 'Unknown error'}`);
    }
  };

  const handleRemove = () => {
    try {
      removeItem(product.id);
    } catch (error: any) {
      if (onError) {
        onError(error.message || 'Failed to remove item');
      }
      // Rethrow the error for better debugging visibility
      throw new Error(`Failed to remove item: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInRight}
      exiting={FadeOutRight}
      layout={Layout.springify()}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.controls}>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            onPress={handleDecrease} 
            style={styles.quantityButton}
          >
            <Minus size={16} color="#FF0000" />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{quantity}</Text>
          
          <TouchableOpacity 
            onPress={handleIncrease} 
            style={styles.quantityButton}
          >
            <Plus size={16} color="#FF0000" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <Trash2 size={18} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#333333',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'capitalize',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF0000',
  },
  controls: {
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#333333',
  },
  quantity: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  removeButton: {
    padding: 4,
  },
});

export default CartItem;