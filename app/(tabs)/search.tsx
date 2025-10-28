import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { FurnitureCard } from '../../components/FurnitureCard';
import { fetchFurniture, searchFurniture, Furniture } from '@/lib/furniture-service';


export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);

  // Memuat data awal dan menangani pencarian
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (searchQuery.trim() === '') {
          const data = await fetchFurniture();
          setFilteredData(data.data);
        } else {
          const data = await searchFurniture(searchQuery);
          setFilteredData(data);
        }
      } catch (error) {
        console.error('Error searching furniture:', error);
      } finally {
        setLoading(false);
      }
    };

    // Timeout untuk mengurangi jumlah request saat pengguna mengetik
    const timeoutId = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Navigasi ke halaman detail produk
  const handleSelectFurniture = (id: string) => {
    router.push(`/product/${id}`);
  };

  // Render item untuk FlatList
  const renderItem = ({ item }: { item: Furniture }) => (
    <TouchableOpacity onPress={() => handleSelectFurniture(item.id)}>
      <FurnitureCard item={item} onPress={() => handleSelectFurniture(item.id)} />
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cari Produk</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari furniture..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.resultsContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Tidak ada produk yang ditemukan</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 16,
    
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  resultsContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});