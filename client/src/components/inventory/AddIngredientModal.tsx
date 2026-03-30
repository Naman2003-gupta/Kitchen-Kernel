import { useState } from 'react';
import { Ingredient } from '../../types';
import { useInventory } from '../../context/InventoryContext';

interface Props {
  onClose: () => void;
  ingredient?: Ingredient;
}

const units = ['pieces', 'grams', 'kg', 'ml', 'liters', 'cups', 'tbsp', 'tsp'];

const categories = [
  { value: 'vegetables', emoji: '🥦', label: 'Vegetables' },
  { value: 'fruits', emoji: '🍎', label: 'Fruits' },
  { value: 'dairy', emoji: '🥛', label: 'Dairy' },
  { value: 'meat', emoji: '🥩', label: 'Meat' },
  { value: 'spices', emoji: '🌶️', label: 'Spices' },
  { value: 'grains', emoji: '🌾', label: 'Grains' },
  { value: 'oils', emoji: '🫙', label: 'Oils' },
  { value: 'other', emoji: '📦', label: 'Other' },
];

export default function AddIngredientModal({ onClose, ingredient }: Props) {
  const { addIngredient, updateIngredient } = useInventory();
  const isEditing = Boolean(ingredient?._id);
  const [form, setForm] = useState<Omit<Ingredient, '_id' | 'userId' | 'addedAt'>>({
    name: ingredient?.name || '',
    quantity: ingredient?.quantity ?? 1,
    unit: ingredient?.unit || 'pieces',
    category: ingredient?.category || 'vegetables',
    expiryDate: ingredient?.expiryDate || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);

    if (isEditing && ingredient?._id) {
      await updateIngredient(ingredient._id, form);
    } else {
      await addIngredient(form);
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-kitchen-orange px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="font-display font-bold text-xl text-white">
              {isEditing ? 'Edit Ingredient' : 'Add Ingredient'}
            </h2>
            <p className="text-white/70 text-sm mt-0.5">
              {isEditing ? 'Update the details for this ingredient' : "What's in your kitchen?"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-kitchen-tan uppercase tracking-wider mb-2 block">
              Ingredient Name
            </label>
            <input
              className="input-field text-sm"
              placeholder="e.g. Onion, Milk, Chicken..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-kitchen-tan uppercase tracking-wider mb-2 block">
              Quantity
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                className="input-field w-28 text-sm"
                placeholder="Amount"
                min={0}
                step={0.1}
                value={form.quantity === 0 ? '' : form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: e.target.value === '' ? 0 : Number(e.target.value),
                  })
                }
                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
              />
              <div className="flex flex-wrap gap-2 flex-1">
                {units.map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setForm({ ...form, unit: unit as Ingredient['unit'] })}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150 ${
                      form.unit === unit
                        ? 'bg-kitchen-orange text-white shadow-sm'
                        : 'bg-kitchen-warm text-kitchen-tan hover:text-kitchen-brown border border-kitchen-tan/30'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-kitchen-tan uppercase tracking-wider mb-2 block">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() =>
                    setForm({ ...form, category: category.value as Ingredient['category'] })
                  }
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-medium transition-all duration-150 border ${
                    form.category === category.value
                      ? 'bg-kitchen-orange/10 border-kitchen-orange text-kitchen-orange'
                      : 'bg-kitchen-warm border-kitchen-tan/20 text-kitchen-tan hover:border-kitchen-tan hover:text-kitchen-brown'
                  }`}
                >
                  <span className="text-xl">{category.emoji}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-kitchen-tan uppercase tracking-wider mb-2 block">
              Expiry Date <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="date"
              className="input-field text-sm"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.name.trim() || loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEditing ? 'Saving...' : 'Adding...') : isEditing ? 'Save Changes' : '+ Add Ingredient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
