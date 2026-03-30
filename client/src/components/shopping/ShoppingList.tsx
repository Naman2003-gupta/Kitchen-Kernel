import { useState } from 'react';
import { ShoppingItem } from '../../types';

interface Props {
  onClose: () => void;
}

const categoryEmoji: Record<string, string> = {
  dairy: '🥛', vegetables: '🥦', fruits: '🍎', meat: '🥩',
  spices: '🌶️', grains: '🌾', oils: '🫙', other: '📦',
};

export default function ShoppingList({ onClose }: Props) {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const stored = localStorage.getItem('kk_shopping');
    return stored ? JSON.parse(stored) : [];
  });
  const [newItem, setNewItem] = useState('');

  const sync = (updated: ShoppingItem[]) => {
    setItems(updated);
    localStorage.setItem('kk_shopping', JSON.stringify(updated));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    const item: ShoppingItem = {
      _id: Date.now().toString(),
      name: newItem.trim(),
      quantity: 1,
      unit: 'pieces',
      category: 'other',
      checked: false,
    };
    sync([...items, item]);
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    sync(items.map(i => i._id === id ? { ...i, checked: !i.checked } : i));
  };

  const removeItem = (id: string) => {
    sync(items.filter(i => i._id !== id));
  };

  const clearChecked = () => {
    sync(items.filter(i => !i.checked));
  };

  const unchecked = items.filter(i => !i.checked);
  const checked = items.filter(i => i.checked);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={onClose}>
      <div
        className="bg-kitchen-cream w-full max-w-sm h-full flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-kitchen-brown p-5 text-white flex justify-between items-center">
          <div>
            <h2 className="font-display font-bold text-xl">🛒 Shopping List</h2>
            <p className="text-white/70 text-sm">{unchecked.length} items remaining</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">✕</button>
        </div>

        {/* Add item */}
        <div className="p-4 border-b border-kitchen-tan/30 bg-white flex gap-2">
          <input
            className="input-field text-sm flex-1"
            placeholder="Add item..."
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem} className="btn-primary px-4">+</button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {items.length === 0 && (
            <div className="text-center mt-12">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-kitchen-tan">Your shopping list is empty</p>
              <p className="text-kitchen-tan text-sm mt-1">Items missing from recipes will appear here</p>
            </div>
          )}

          {unchecked.map(item => (
            <div key={item._id} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-kitchen-tan/20">
              <button
                onClick={() => toggleItem(item._id!)}
                className="w-5 h-5 rounded-full border-2 border-kitchen-tan hover:border-kitchen-orange transition-colors flex-shrink-0"
              />
              <span className="text-sm">{categoryEmoji[item.category] || '📦'}</span>
              <span className="text-sm text-kitchen-brown flex-1 capitalize">{item.name}</span>
              <button
                onClick={() => removeItem(item._id!)}
                className="text-kitchen-tan hover:text-kitchen-red text-sm"
              >✕</button>
            </div>
          ))}

          {checked.length > 0 && (
            <>
              <div className="flex justify-between items-center mt-3 mb-1">
                <p className="text-xs text-kitchen-tan font-medium">Checked ({checked.length})</p>
                <button onClick={clearChecked} className="text-xs text-kitchen-red hover:underline">
                  Clear all
                </button>
              </div>
              {checked.map(item => (
                <div key={item._id} className="bg-white/60 rounded-xl p-3 flex items-center gap-3 border border-kitchen-tan/10">
                  <button
                    onClick={() => toggleItem(item._id!)}
                    className="w-5 h-5 rounded-full bg-kitchen-green border-2 border-kitchen-green flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-white text-xs">✓</span>
                  </button>
                  <span className="text-sm">{categoryEmoji[item.category] || '📦'}</span>
                  <span className="text-sm text-kitchen-tan line-through flex-1 capitalize">{item.name}</span>
                  <button
                    onClick={() => removeItem(item._id!)}
                    className="text-kitchen-tan hover:text-kitchen-red text-sm"
                  >✕</button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}