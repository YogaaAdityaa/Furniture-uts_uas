import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useShoppingStore, Item } from '../../store/shopping-list';
import { fetchFurnitureById, Furniture} from '@/lib/furniture-service';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useShoppingStore();
  const [product, setProduct] = useState<Furniture | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (typeof id === 'string') {
          const data = await fetchFurnitureById(id);
          setProduct(data);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    const cartItem: Item = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      quantity: quantity,
      purchased: false
    };
    
    addItem(cartItem);
    router.push('/cart');
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
          
          <Text style={styles.description}>{product.description}</Text>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.quantityValue}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.stock}>Stock: {product.stock} items</Text>
          
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: width * 0.8,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 18,
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  stock: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});