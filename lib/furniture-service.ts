import { supabase } from './supabase';

// Interface untuk data furniture
export interface Furniture {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

// Mengambil semua furniture
export const fetchFurniture = async (): Promise<{ data: Furniture[], error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('furniture')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching furniture:', error);
      return { data: [], error: error.message };
    }
    
    return { data: data as Furniture[], error: null };
  } catch (err) {
    console.error('Unexpected error fetching furniture:', err);
    return { data: [], error: 'Terjadi kesalahan saat mengambil data furniture' };
  }
};

// Mengambil detail furniture berdasarkan ID
export const fetchFurnitureById = async (id: string): Promise<Furniture | null> => {
  const { data, error } = await supabase
    .from('furniture')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching furniture details:', error);
    return null;
  }
  
  return data as Furniture;
};

// Mencari furniture berdasarkan query
export const searchFurniture = async (query: string): Promise<Furniture[]> => {
  const { data, error } = await supabase
    .from('furniture')
    .select('*')
    .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
    .order('name');
  
  if (error) {
    console.error('Error searching furniture:', error);
    return [];
  }
  
  return data as Furniture[];
};