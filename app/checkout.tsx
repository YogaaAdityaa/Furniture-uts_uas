import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import { useShoppingStore } from '../store/shopping-list';
import { router } from 'expo-router';
import { createOrder } from '@/lib/order-service';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

export default function CheckoutScreen() {
  const { items, clearCart } = useShoppingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
    }
  });

  // Hitung total harga
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Proses checkout
      const orderData = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postal_code: data.postalCode,
        total_price: totalPrice
      };
      
      const result = await createOrder(orderData, items);
      
      if (result.success) {
        // Bersihkan keranjang setelah checkout berhasil
        clearCart();
        
        Alert.alert(
          "Checkout Berhasil",
          "Pesanan Anda telah berhasil diproses. Terima kasih telah berbelanja!",
          [
            { 
              text: "OK", 
              onPress: () => router.replace('/(tabs)') 
            }
          ]
        );
      } else {
        Alert.alert(
          "Checkout Gagal",
          result.message || "Terjadi kesalahan saat memproses pesanan Anda.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert(
        "Checkout Gagal",
        "Terjadi kesalahan saat memproses pesanan Anda.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Keranjang belanja Anda kosong</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Kembali ke Toko</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      
      {/* Form Checkout */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Informasi Pengiriman</Text>
        
        <Text style={styles.label}>Nama Lengkap</Text>
        <Controller
          control={control}
          rules={{
            required: 'Nama lengkap wajib diisi',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Masukkan nama lengkap"
            />
          )}
          name="fullName"
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
        
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          rules={{
            required: 'Email wajib diisi',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Format email tidak valid',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Masukkan email"
              keyboardType="email-address"
            />
          )}
          name="email"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        
        <Text style={styles.label}>Nomor Telepon</Text>
        <Controller
          control={control}
          rules={{
            required: 'Nomor telepon wajib diisi',
            minLength: {
              value: 10,
              message: 'Nomor telepon minimal 10 digit',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Masukkan nomor telepon"
              keyboardType="phone-pad"
            />
          )}
          name="phone"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
        
        <Text style={styles.label}>Alamat</Text>
        <Controller
          control={control}
          rules={{
            required: 'Alamat wajib diisi',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Masukkan alamat lengkap"
              multiline
            />
          )}
          name="address"
        />
        {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
        
        <Text style={styles.label}>Kota</Text>
        <Controller
          control={control}
          rules={{
            required: 'Kota wajib diisi',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Masukkan kota"
            />
          )}
          name="city"
        />
        {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
        
        <Text style={styles.label}>Kode Pos</Text>
        <Controller
          control={control}
          rules={{
            required: 'Kode pos wajib diisi',
            pattern: {
              value: /^[0-9]{5}$/,
              message: 'Kode pos harus 5 digit angka',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.postalCode && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Masukkan kode pos"
              keyboardType="numeric"
            />
          )}
          name="postalCode"
        />
        {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode.message}</Text>}
      </View>
      
      {/* Ringkasan Pesanan */}
      <View style={styles.orderSummary}>
        <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
        
        {items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.orderItemName}>{item.name}</Text>
            <Text style={styles.orderItemQuantity}>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</Text>
            <Text style={styles.orderItemPrice}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</Text>
          </View>
        ))}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.checkoutButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.checkoutButtonText}>
          {isSubmitting ? 'Memproses...' : 'Selesaikan Pesanan'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  orderSummary: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderItemName: {
    flex: 2,
    fontSize: 16,
  },
  orderItemQuantity: {
    flex: 2,
    fontSize: 16,
    textAlign: 'center',
  },
  orderItemPrice: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a9d8f',
  },
  checkoutButton: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#2a9d8f',
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});