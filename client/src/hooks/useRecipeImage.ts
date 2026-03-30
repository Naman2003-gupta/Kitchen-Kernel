import { useState, useEffect } from 'react';
import api from '../services/api';

const cache: Record<string, string> = {};

export const useRecipeImage = (recipeName: string) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipeName) return;

    // Return cached image if already fetched
    if (cache[recipeName]) {
      setImageUrl(cache[recipeName]);
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ imageUrl: string }>('/images/recipe', {
          params: { q: recipeName },
        });
        const url = res.data.imageUrl || '';
        cache[recipeName] = url;
        setImageUrl(url);
      } catch {
        setImageUrl('');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [recipeName]);

  return { imageUrl, loading };
};
