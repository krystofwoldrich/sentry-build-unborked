import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { products } from '@/data/products';
import { ChevronLeft, Star, ShoppingCart, Minus, Plus } from 'lucide-react-native';
import Button from '@/components/Button';
import { useCart } from '@/contexts/CartContext';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addItem(product, quantity);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(800)}>
          <Image source={{ uri: product.image }} style={styles.image} />
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={styles.contentContainer}
          entering={FadeInDown.duration(800).delay(200)}
        >
          <Text style={styles.name}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={20} color="#FF0000" fill="#FF0000" />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          </View>
          
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          
          <Text style={styles.description}>{product.description}</Text>
          
          <Text style={styles.compatibleTitle}>Compatible with:</Text>
          <View style={styles.compatibleContainer}>
            {product.compatibleWith.map((item, index) => (
              <View key={index} style={styles.compatibleBadge}>
                <Text style={styles.compatibleText}>{item}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus size={20} color={quantity <= 1 ? '#666666' : '#FF0000'} />
              </TouchableOpacity>
              
              <Text style={styles.quantity}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Plus size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Button
            title="Add to Cart"
            onPress={handleAddToCart}
            style={styles.addButton}
            icon={<ShoppingCart size={20} color="#FFFFFF" style={{ marginRight: 8 }} />}
            iconPosition="left"
          />
        </Animated.View>
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  contentContainer: {
    padding: 24,
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderColor: '#333333',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  reviews: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FF0000',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 24,
    marginBottom: 24,
  },
  compatibleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  compatibleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  compatibleBadge: {
    backgroundColor: '#1A0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  compatibleText: {
    color: '#FF0000',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A0000',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#333333',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  addButton: {
    height: 56,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});