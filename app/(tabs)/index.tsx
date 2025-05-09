import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  FlatList, 
  SafeAreaView, 
  Platform, 
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { Product } from '@/types/product';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory]);

  const filterProducts = () => {
    let result = [...products];
    
    if (searchQuery) {
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(800)}
      >
        <Text style={styles.title}>Unborked</Text>
        <Text style={styles.subtitle}>Fix your code, not your patience</Text>
      </Animated.View>
      
      <SearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
      />
      
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No results found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try changing your search or filter criteria
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item, index }) => (
            <ProductCard product={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF0000"
              colors={["#FF0000"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  productList: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
});