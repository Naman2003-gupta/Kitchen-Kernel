import api from './api';
import { Filters, Ingredient, Recipe } from '../types';

interface GenerateRecipesResponse {
  replyText: string;
  recipes: Recipe[];
}

export const generateRecipes = async (
  userMessage: string,
  inventory: Ingredient[],
  filters: Filters
): Promise<GenerateRecipesResponse> => {
  try {
    const response = await api.post<GenerateRecipesResponse>('/ai/recipes', {
      userMessage,
      inventory,
      filters,
    });

    return {
      replyText: response.data.replyText || "Here's what I found!",
      recipes: response.data.recipes || [],
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const replyText = error?.response?.data?.replyText;

    if (replyText) {
      return {
        replyText,
        recipes: [],
      };
    }

    if (status === 429) {
      return {
        replyText: 'Too many requests. Please wait a moment and try again.',
        recipes: [],
      };
    }

    return {
      replyText: 'Something went wrong while generating recipes. Please try again.',
      recipes: [],
    };
  }
};
