import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Plus } from 'lucide-react-native';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { prepareProductForCart, handleAddToCart } from '../utils/cartUtils';

interface ProductCardProps {
  product: Product;
  index: number;
}

const { width } = Dimensions.get('window');
const cardWidth = width < 768 ? width / 2 - 24 : width / 3 - 32;

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const router = useRouter();
  const { addItem } = useCart();
  
  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };
  
  const onAddToCart = () => {
    handleAddToCart(
      addItem,
      product,
      1,
      undefined, // No success callback needed
      (errorMessage) => {
        // We could display an error message here if needed
        console.error(`Failed to add to cart: ${errorMessage}`);
      }
    );
  };

  return (
    <Animated.View 
      style={[styles.card, { width: cardWidth }]}
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.cardContent}
      >
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#FF0000" fill="#FF0000" />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews})</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <TouchableOpacity 
              onPress={onAddToCart} 
              style={styles.addButton}
              activeOpacity={0.7}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#111111',
    overflow: 'hidden',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#333333',
  },
  cardContent: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  reviews: {
    marginLeft: 2,
    fontSize: 12,
    color: '#666666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF0000',
  },
  addButton: {
    backgroundColor: '#FF0000',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;