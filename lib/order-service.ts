import { supabase } from './supabase';
import { Item } from '../store/shopping-list';

interface OrderData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total_price: number;
}

interface CheckoutResult {
  success: boolean;
  message: string;
  order?: any;
}

// Membuat order baru
export const createOrder = async (orderData: OrderData, orderItems: Item[]): Promise<CheckoutResult> => {
  // 1. Buat order baru
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    return { success: false, message: 'Gagal membuat pesanan' };
  }
  
  // 2. Buat order items
  const orderItemsWithOrderId = orderItems.map(item => ({
    order_id: order.id,
    furniture_id: item.id,
    quantity: item.quantity,
    price: item.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsWithOrderId);
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return { success: false, message: 'Gagal membuat item pesanan' };
  }
  
  // 3. Update stok furniture
  for (const item of orderItems) {
    const { data: result, error: updateError } = await supabase
      .rpc('decrement_stock', { 
        furniture_id: item.id, 
        quantity: item.quantity 
      });
    
    if (updateError || result === false) {
      console.error('Error updating stock:', updateError);
      return { success: false, message: `Stok tidak mencukupi untuk ${item.name}` };
    }
  }
  
  return { success: true, message: 'Checkout berhasil!', order };
};

// Mengambil riwayat order
export const fetchOrders = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  return data;
};

// Mengambil detail order
export const fetchOrderById = async (orderId: string): Promise<any> => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (orderError) {
    console.error('Error fetching order:', orderError);
    return null;
  }
  
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*, furniture(*)')
    .eq('order_id', orderId);
  
  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return { ...order, items: [] };
  }
  
  return { ...order, items };
};