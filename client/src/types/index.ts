export interface Ingredient {
  _id?: string;
  userId?: string;
  name: string;
  quantity: number;
  unit: 'grams' | 'ml' | 'pieces' | 'cups' | 'tbsp' | 'tsp' | 'kg' | 'liters';
  category: 'dairy' | 'vegetables' | 'fruits' | 'meat' | 'spices' | 'grains' | 'oils' | 'other';
  expiryDate?: string;
  addedAt?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Substitution {
  original: string;
  substitute: string;
  note?: string;
}

export interface Recipe {
  _id?: string;
  userId?: string;
  title: string;
  cuisine: string;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  dietType: string[];
  ingredientsNeeded: { name: string; quantity: number; unit: string }[];
  missingIngredients: string[];
  steps: string[];
  nutrition: Nutrition;
  substitutions: Substitution[];
  isSaved?: boolean;
  generatedAt?: string;
  matchScore?: 'full' | 'partial';
}

export interface Filters {
  diet: 'any' | 'veg' | 'non-veg' | 'vegan' | 'keto' | 'high-protein';
  cuisine: 'any' | 'indian' | 'italian' | 'chinese' | 'mexican' | 'american';
  maxTime: number;
  difficulty: 'any' | 'easy' | 'medium' | 'hard';
  mode: 'normal' | 'leftover' | 'expiring';
}

export type ChatMessageType = 'user' | 'ai-text' | 'ai-recipes' | 'ai-loading';

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  text?: string;
  recipes?: Recipe[];
  timestamp: Date;
}

export interface ShoppingItem {
  _id?: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}