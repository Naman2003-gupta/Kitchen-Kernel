import { useState } from 'react';
import { Recipe } from '../../types';

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeDetailDrawer({ recipe, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'steps' | 'nutrition' | 'subs'>('steps');

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={onClose}>
      <div
        className="bg-kitchen-cream w-full max-w-lg h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-kitchen-orange p-6 text-white">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-display font-bold text-xl flex-1 pr-4">{recipe.title}</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">✕</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="badge bg-white/20 text-white capitalize">{recipe.cuisine}</span>
            <span className="badge bg-white/20 text-white">🕐 {recipe.cookTime} mins</span>
            <span className="badge bg-white/20 text-white capitalize">{recipe.difficulty}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-kitchen-tan/30 bg-white">
          {(['steps', 'nutrition', 'subs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-kitchen-orange border-b-2 border-kitchen-orange'
                  : 'text-kitchen-tan hover:text-kitchen-brown'
              }`}
            >
              {tab === 'steps' ? '👨‍🍳 Steps' : tab === 'nutrition' ? '📊 Nutrition' : '🔄 Substitutions'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Steps Tab */}
          {activeTab === 'steps' && (
            <div>
              {/* Ingredients needed */}
              <div className="mb-6">
                <h3 className="font-bold text-kitchen-brown mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredientsNeeded.map((ing, i) => (
                    <span key={i} className="badge bg-kitchen-warm text-kitchen-brown border border-kitchen-tan/30">
                      {ing.name} — {ing.quantity} {ing.unit}
                    </span>
                  ))}
                </div>
                {recipe.missingIngredients.length > 0 && (
                  <div className="mt-3 bg-kitchen-yellow/10 rounded-xl p-3">
                    <p className="text-sm font-medium text-yellow-700">⚠️ You're missing:</p>
                    <p className="text-sm text-yellow-600 mt-1">{recipe.missingIngredients.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Step by step */}
              <h3 className="font-bold text-kitchen-brown mb-3">
                Step {step + 1} of {recipe.steps.length}
              </h3>
              <div className="bg-white rounded-2xl p-5 shadow-card mb-4 min-h-24">
                <div className="flex items-start gap-3">
                  <span className="bg-kitchen-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step + 1}
                  </span>
                  <p className="text-kitchen-brown leading-relaxed">{recipe.steps[step]}</p>
                </div>
              </div>

              {/* Step progress dots */}
              <div className="flex gap-2 justify-center mb-4">
                {recipe.steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === step ? 'bg-kitchen-orange w-4' : 'bg-kitchen-tan/40'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(s => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="btn-secondary flex-1 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setStep(s => Math.min(recipe.steps.length - 1, s + 1))}
                  disabled={step === recipe.steps.length - 1}
                  className="btn-primary flex-1 disabled:opacity-40"
                >
                  {step === recipe.steps.length - 1 ? '✅ Done!' : 'Next →'}
                </button>
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal', emoji: '🔥', color: 'bg-kitchen-red/10 text-kitchen-red' },
                { label: 'Protein', value: recipe.nutrition.protein, unit: 'g', emoji: '💪', color: 'bg-kitchen-green/10 text-kitchen-green' },
                { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g', emoji: '🌾', color: 'bg-kitchen-yellow/20 text-yellow-700' },
                { label: 'Fats', value: recipe.nutrition.fats, unit: 'g', emoji: '🫙', color: 'bg-kitchen-tan/20 text-kitchen-brown' },
              ].map(n => (
                <div key={n.label} className={`rounded-2xl p-5 ${n.color} text-center`}>
                  <p className="text-3xl mb-1">{n.emoji}</p>
                  <p className="text-2xl font-bold">{n.value}</p>
                  <p className="text-xs">{n.unit}</p>
                  <p className="text-sm font-medium mt-1">{n.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Substitutions Tab */}
          {activeTab === 'subs' && (
            <div className="flex flex-col gap-3">
              {recipe.substitutions.length === 0 && (
                <p className="text-kitchen-tan text-center mt-8">No substitutions needed!</p>
              )}
              {recipe.substitutions.map((sub, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-kitchen-tan mb-1">Missing</p>
                      <span className="badge bg-kitchen-red/10 text-kitchen-red capitalize">{sub.original}</span>
                    </div>
                    <span className="text-kitchen-tan text-xl">→</span>
                    <div className="text-center">
                      <p className="text-xs text-kitchen-tan mb-1">Use instead</p>
                      <span className="badge bg-kitchen-green/10 text-kitchen-green capitalize">{sub.substitute}</span>
                    </div>
                  </div>
                  {sub.note && (
                    <p className="text-xs text-kitchen-tan mt-2 italic">{sub.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}   