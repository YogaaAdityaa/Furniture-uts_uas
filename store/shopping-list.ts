import { create } from 'zustand'

export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  quantity: number;
  purchased: boolean;
}

interface ShoppingListState {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  clearCart: () => void;
}

export const useShoppingStore = create<ShoppingListState>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),

  clearCart: () => set({ items: [] }),
}));