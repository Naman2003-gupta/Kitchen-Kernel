import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ingredient } from '../types';
import api from '../services/api';

interface InventoryContextType {
  inventory: Ingredient[];
  addIngredient: (item: Ingredient) => Promise<void>;
  updateIngredient: (id: string, item: Partial<Ingredient>) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
  getExpiringItems: () => Ingredient[];
  loading: boolean;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch {
      // fallback to localStorage if backend unavailable
      const stored = localStorage.getItem('kk_inventory');
      if (stored) setInventory(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  };

  const syncLocal = (items: Ingredient[]) => {
    localStorage.setItem('kk_inventory', JSON.stringify(items));
  };

  const addIngredient = async (item: Ingredient) => {
    try {
      const res = await api.post('/inventory', item);
      const updated = [...inventory, res.data];
      setInventory(updated);
      syncLocal(updated);
    } catch {
      const updated = [...inventory, { ...item, _id: Date.now().toString() }];
      setInventory(updated);
      syncLocal(updated);
    }
  };

  const updateIngredient = async (id: string, item: Partial<Ingredient>) => {
    try {
      const res = await api.put(`/inventory/${id}`, item);
      const updated = inventory.map(i => i._id === id ? res.data : i);
      setInventory(updated);
      syncLocal(updated);
    } catch {
      const updated = inventory.map(i => i._id === id ? { ...i, ...item } : i);
      setInventory(updated);
      syncLocal(updated);
    }
  };

  const removeIngredient = async (id: string) => {
    try {
      await api.delete(`/inventory/${id}`);
    } catch {}
    const updated = inventory.filter(i => i._id !== id);
    setInventory(updated);
    syncLocal(updated);
  };

  const getExpiringItems = () => {
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);
    return inventory.filter(i => i.expiryDate && new Date(i.expiryDate) <= threeDays);
  };

  return (
    <InventoryContext.Provider value={{
      inventory, addIngredient, updateIngredient,
      removeIngredient, getExpiringItems, loading
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
};