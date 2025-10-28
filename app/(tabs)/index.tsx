import { ThemedText } from '@/components/themed-text';
import { fetchFurniture, Furniture } from '@/lib/furniture-service';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { FurnitureCard} from '../../components/FurnitureCard';


export default function HomeScreen() {
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFurniture = async () => {
      try {
        const { data, error } = await fetchFurniture();
        if (error) {
          console.error('Error loading furniture:', error);
        } else {
          setFurniture(data);
        }
      } catch (error) {
        console.error('Unexpected error loading furniture:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFurniture();
  }, []);

  const handleSelectFurniture = (item: Furniture) => {
    router.push(`/product/${item.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <ThemedText style={styles.title}>Furniture Shop</ThemedText>
        <Link href="/cart" asChild>
          <Text style={styles.cartButton}>🛒</Text>
        </Link>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={furniture}
          renderItem={({ item }) => (
            <FurnitureCard item={item} onPress={handleSelectFurniture} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartButton: {
    fontSize: 24,
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
