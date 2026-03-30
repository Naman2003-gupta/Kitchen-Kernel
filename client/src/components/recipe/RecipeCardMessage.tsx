import { Recipe } from '../../types';
import RecipeCard from './RecipeCard';

interface Props {
  recipes: Recipe[];
}

export default function RecipeCardMessage({ recipes }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 pt-1 px-1">
      {recipes.map((recipe, i) => (
        <RecipeCard key={recipe._id || i} recipe={recipe} />
      ))}
    </div>
  );
}