import { useState, useEffect } from 'react';
import { Recipe } from '../../types';
import RecipeDetailDrawer from './RecipeDetailDrawer';

interface Props {
  onClose: () => void;
}

export default function SavedRecipes({ onClose }: Props) {
  const [saved, setSaved] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Recipe | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kk_saved_recipes');
    if (stored) setSaved(JSON.parse(stored));
  }, []);

  const removeRecipe = (index: number) => {
    const updated = saved.filter((_, i) => i !== index);
    setSaved(updated);
    localStorage.setItem('kk_saved_recipes', JSON.stringify(updated));
  };

  const difficultyColor: Record<string, string> = {
    easy: 'bg-kitchen-green/20 text-kitchen-green',
    medium: 'bg-kitchen-yellow/30 text-yellow-700',
    hard: 'bg-kitchen-red/20 text-kitchen-red',
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={onClose}>
        <div
          className="bg-kitchen-cream w-full max-w-sm h-full flex flex-col shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-kitchen-orange p-5 text-white flex justify-between items-center">
            <div>
              <h2 className="font-display font-bold text-xl">❤️ Saved Recipes</h2>
              <p className="text-white/70 text-sm">{saved.length} recipes saved</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">✕</button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {saved.length === 0 && (
              <div className="text-center mt-12">
                <p className="text-4xl mb-3">❤️</p>
                <p className="text-kitchen-tan">No saved recipes yet</p>
                <p className="text-kitchen-tan text-sm mt-1">Click the heart on any recipe card to save it</p>
              </div>
            )}
            {saved.map((recipe, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-card border border-kitchen-tan/20 cursor-pointer hover:shadow-card-hover transition-all"
                onClick={() => setSelected(recipe)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-kitchen-brown text-sm flex-1 pr-2">{recipe.title}</h3>
                  <button
                    onClick={e => { e.stopPropagation(); removeRecipe(i); }}
                    className="text-kitchen-tan hover:text-kitchen-red text-sm flex-shrink-0"
                  >✕</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`badge ${difficultyColor[recipe.difficulty]}`}>{recipe.difficulty}</span>
                  <span className="badge bg-kitchen-tan/20 text-kitchen-brown">🕐 {recipe.cookTime}m</span>
                  <span className="badge bg-kitchen-tan/20 text-kitchen-brown capitalize">{recipe.cuisine}</span>
                </div>
                <div className="flex justify-between text-xs text-kitchen-tan mt-2 pt-2 border-t border-kitchen-tan/20">
                  <span>🔥 {recipe.nutrition.calories} cal</span>
                  <span>💪 {recipe.nutrition.protein}g protein</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <RecipeDetailDrawer recipe={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}