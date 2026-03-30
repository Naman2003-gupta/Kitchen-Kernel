import { Router } from 'express';
import mongoose from 'mongoose';
import IngredientModel from '../models/Ingredient';

const router = Router();

interface IngredientPayload {
  userId?: string;
  name?: string;
  quantity?: number;
  unit?: string;
  category?: string;
  expiryDate?: string;
  addedAt?: string;
}

interface InventoryItem {
  _id: string;
  userId?: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string;
  addedAt?: string;
}

const memoryInventory = new Map<string, InventoryItem>();

const isDbConnected = () => mongoose.connection.readyState === 1;

const normalizeIngredient = (payload: IngredientPayload): Omit<InventoryItem, '_id'> => ({
  userId: payload.userId?.trim() || undefined,
  name: (payload.name || '').trim(),
  quantity: typeof payload.quantity === 'number' ? payload.quantity : Number(payload.quantity || 0),
  unit: (payload.unit || '').trim(),
  category: (payload.category || '').trim(),
  expiryDate: payload.expiryDate || '',
  addedAt: payload.addedAt || new Date().toISOString(),
});

const validateIngredient = (ingredient: Omit<InventoryItem, '_id'>) => {
  if (!ingredient.name) return 'Ingredient name is required.';
  if (!ingredient.unit) return 'Ingredient unit is required.';
  if (!ingredient.category) return 'Ingredient category is required.';
  if (Number.isNaN(ingredient.quantity) || ingredient.quantity < 0) {
    return 'Ingredient quantity must be a valid non-negative number.';
  }

  return null;
};

router.get('/', async (_req, res) => {
  try {
    if (isDbConnected()) {
      const inventory = await IngredientModel.find().sort({ addedAt: -1 }).lean();
      return res.json(inventory);
    }

    return res.json(Array.from(memoryInventory.values()));
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return res.status(500).json({ message: 'Failed to fetch inventory.' });
  }
});

router.post('/', async (req, res) => {
  const normalized = normalizeIngredient(req.body as IngredientPayload);
  const validationError = validateIngredient(normalized);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    if (isDbConnected()) {
      const created = await IngredientModel.create(normalized);
      return res.status(201).json(created.toObject());
    }

    const item: InventoryItem = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...normalized,
    };
    memoryInventory.set(item._id, item);
    return res.status(201).json(item);
  } catch (error) {
    console.error('Failed to create inventory item:', error);
    return res.status(500).json({ message: 'Failed to create inventory item.' });
  }
});

router.put('/:id', async (req, res) => {
  const normalized = normalizeIngredient(req.body as IngredientPayload);
  const validationError = validateIngredient(normalized);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    if (isDbConnected()) {
      const updated = await IngredientModel.findByIdAndUpdate(req.params.id, normalized, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) {
        return res.status(404).json({ message: 'Inventory item not found.' });
      }

      return res.json(updated);
    }

    const existing = memoryInventory.get(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    const updated: InventoryItem = {
      ...existing,
      ...normalized,
      _id: existing._id,
    };
    memoryInventory.set(req.params.id, updated);
    return res.json(updated);
  } catch (error) {
    console.error('Failed to update inventory item:', error);
    return res.status(500).json({ message: 'Failed to update inventory item.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await IngredientModel.findByIdAndDelete(req.params.id).lean();
      if (!deleted) {
        return res.status(404).json({ message: 'Inventory item not found.' });
      }

      return res.status(204).send();
    }

    const existed = memoryInventory.delete(req.params.id);
    if (!existed) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete inventory item:', error);
    return res.status(500).json({ message: 'Failed to delete inventory item.' });
  }
});

export default router;
