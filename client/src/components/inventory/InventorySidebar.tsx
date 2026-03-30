import { useState } from 'react';
import { Ingredient } from '../../types';
import { useInventory } from '../../context/InventoryContext';
import ExpiryBadge from './ExpiryBadge';
import AddIngredientModal from './AddIngredientModal';

const categoryEmoji: Record<string, string> = {
  dairy: '🥛',
  vegetables: '🥦',
  fruits: '🍎',
  meat: '🥩',
  spices: '🌶️',
  grains: '🌾',
  oils: '🫙',
  other: '📦',
};

export default function InventorySidebar() {
  const { inventory, removeIngredient, loading } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [search, setSearch] = useState('');

  const filtered = inventory.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-72 bg-kitchen-warm dark:bg-gray-900 border-r border-kitchen-tan/30 dark:border-gray-700 flex flex-col flex-shrink-0 h-full transition-colors duration-200">
      <div className="p-4 border-b border-kitchen-tan/30 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-display font-bold text-kitchen-brown dark:text-gray-100">
            My Inventory
          </h2>
          <span className="badge bg-kitchen-orange/20 text-kitchen-orange">
            {inventory.length} items
          </span>
        </div>
        <input
          className="input-field text-sm"
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {loading && (
          <p className="text-kitchen-tan text-sm text-center mt-4">Loading inventory...</p>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-3xl mb-2">🧺</p>
            <p className="text-kitchen-tan text-sm">Your inventory is empty</p>
            <p className="text-kitchen-tan text-xs mt-1">Add ingredients to get started</p>
          </div>
        )}
        {filtered.map((ingredient) => (
          <div
            key={ingredient._id}
            className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-kitchen-tan/20 dark:border-gray-700 shadow-sm group transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span>{categoryEmoji[ingredient.category] || '📦'}</span>
                <div>
                  <p className="text-sm font-medium text-kitchen-brown dark:text-gray-100 capitalize">
                    {ingredient.name}
                  </p>
                  <p className="text-xs text-kitchen-tan dark:text-gray-400">
                    {ingredient.quantity} {ingredient.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingIngredient(ingredient)}
                  className="text-kitchen-tan hover:text-kitchen-orange text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => ingredient._id && removeIngredient(ingredient._id)}
                  className="text-kitchen-tan hover:text-kitchen-red text-sm"
                >
                  x
                </button>
              </div>
            </div>
            {ingredient.expiryDate && (
              <div className="mt-2">
                <ExpiryBadge expiryDate={ingredient.expiryDate} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-kitchen-tan/30 dark:border-gray-700">
        <button onClick={() => setShowModal(true)} className="btn-primary w-full text-sm">
          + Add Ingredient
        </button>
      </div>

      {showModal && <AddIngredientModal onClose={() => setShowModal(false)} />}
      {editingIngredient && (
        <AddIngredientModal
          ingredient={editingIngredient}
          onClose={() => setEditingIngredient(null)}
        />
      )}
    </aside>
  );
}
