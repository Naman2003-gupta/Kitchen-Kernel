import { Router } from 'express';

const router = Router();

interface UnsplashSearchResponse {
  results?: Array<{
    urls?: {
      small?: string;
    };
  }>;
}

router.get('/recipe', async (req, res) => {
  const recipeName = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!recipeName) {
    return res.status(400).json({ imageUrl: '' });
  }

  if (!unsplashAccessKey) {
    return res.status(500).json({ imageUrl: '' });
  }

  const query = encodeURIComponent(`${recipeName} food dish`);
  const url =
    `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${unsplashAccessKey}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ imageUrl: '' });
    }

    const data = (await response.json()) as UnsplashSearchResponse;
    const imageUrl = data.results?.[0]?.urls?.small || '';

    return res.json({ imageUrl });
  } catch (error) {
    console.error('Recipe image lookup failed:', error);
    return res.status(500).json({ imageUrl: '' });
  }
});

export default router;
