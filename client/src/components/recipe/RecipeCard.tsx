import { useState } from 'react';
import { Recipe } from '../../types';
import { useRecipeImage } from '../../hooks/useRecipeImage';
import RecipeDetailDrawer from './RecipeDetailDrawer';

interface Props {
  recipe: Recipe;
}

const difficultyColor = {
  easy: 'bg-kitchen-green/20 text-kitchen-green',
  medium: 'bg-kitchen-yellow/30 text-yellow-700',
  hard: 'bg-kitchen-red/20 text-kitchen-red',
};

export default function RecipeCard({ recipe }: Props) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [saved, setSaved] = useState(() => {
    const stored = localStorage.getItem('kk_saved_recipes');
    if (!stored) return false;
    const list: Recipe[] = JSON.parse(stored);
    return list.some(r => r.title === recipe.title);
  });


  const { imageUrl, loading: imgLoading } = useRecipeImage(recipe.title);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const stored = localStorage.getItem('kk_saved_recipes');
    const list: Recipe[] = stored ? JSON.parse(stored) : [];
    let updated;
    if (saved) {
      updated = list.filter(r => r.title !== recipe.title);
    } else {
      updated = [...list, recipe];
    }
    localStorage.setItem('kk_saved_recipes', JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <>
      <div
        onClick={() => setShowDrawer(true)}
        className="card cursor-pointer hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 w-64 flex-shrink-0"
      >
        {/* ✅ ADD THIS — Recipe Image */}
        <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-kitchen-warm flex items-center justify-center">
          {imgLoading ? (
            <div className="w-full h-full bg-kitchen-warm animate-pulse rounded-xl" />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">🍳</span>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-bold text-kitchen-brown text-sm leading-tight flex-1 pr-2">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={toggleSave}
              className="text-lg hover:scale-110 transition-transform"
              title={saved ? 'Unsave recipe' : 'Save recipe'}
            >
              {saved ? '❤️' : '🤍'}
            </button>
            {recipe.matchScore === 'full'
              ? <span className="badge bg-kitchen-green/20 text-kitchen-green">✅ Full</span>
              : <span className="badge bg-kitchen-yellow/30 text-yellow-700">⚡ Partial</span>
            }
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className={`badge ${difficultyColor[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
          <span className="badge bg-kitchen-tan/20 text-kitchen-brown">
            🕐 {recipe.cookTime}m
          </span>
          <span className="badge bg-kitchen-tan/20 text-kitchen-brown capitalize">
            {recipe.cuisine}
          </span>
          {recipe.dietType.map(d => (
            <span key={d} className="badge bg-kitchen-orange/10 text-kitchen-orange capitalize">{d}</span>
          ))}
        </div>

        {/* Nutrition strip */}
        <div className="flex justify-between text-xs text-kitchen-tan border-t border-kitchen-tan/20 pt-2 mb-3">
          <span>🔥 {recipe.nutrition.calories} cal</span>
          <span>💪 {recipe.nutrition.protein}g</span>
          <span>🌾 {recipe.nutrition.carbs}g</span>
          <span>🫙 {recipe.nutrition.fats}g</span>
        </div>

        {/* Missing ingredients */}
        {recipe.missingIngredients.length > 0 && (
          <div className="bg-kitchen-yellow/10 rounded-lg p-2 mb-2">
            <p className="text-xs text-yellow-700 font-medium mb-1">Missing:</p>
            <p className="text-xs text-yellow-600">
              {recipe.missingIngredients.join(', ')}
            </p>
          </div>
        )}

        <button className="btn-primary w-full text-xs mt-1">
          View Recipe →
        </button>
      </div>

      {showDrawer && (
        <RecipeDetailDrawer recipe={recipe} onClose={() => setShowDrawer(false)} />
      )}
    </>
  );
}