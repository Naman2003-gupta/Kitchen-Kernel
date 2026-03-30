import { Router } from 'express';

const router = Router();

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
}

interface Filters {
  diet: string;
  cuisine: string;
  maxTime: number;
  difficulty: string;
  mode: string;
}

interface GenerateRecipesRequest {
  userMessage?: string;
  inventory?: Ingredient[];
  filters?: Filters;
}

interface GeminiApiResponse {
  candidates?: Array<{
    finishReason?: string;
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}

interface ParsedRecipeResponse {
  replyText?: string;
  recipes?: unknown[];
}

interface GeminiErrorResponse {
  error?: {
    code?: number;
    status?: string;
    message?: string;
  };
}

const buildPrompt = (
  userMessage: string,
  inventory: Ingredient[],
  filters: Filters
) => {
  const ingredientList = inventory
    .map((ingredient) => `${ingredient.name} (${ingredient.quantity} ${ingredient.unit})`)
    .join(', ');

  const expiringSoon = inventory
    .filter((ingredient) => {
      if (!ingredient.expiryDate) return false;
      const diff = new Date(ingredient.expiryDate).getTime() - Date.now();
      return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
    })
    .map((ingredient) => ingredient.name)
    .join(', ');

  return `
You are Kitchen Kernel, a smart and warm kitchen assistant.
User message: "${userMessage}"
Current inventory (use ONLY these exact ingredients, do not interpret or rename them): ${ingredientList || 'empty'}
${expiringSoon ? `Warning: Expiring soon (use these first): ${expiringSoon}` : ''}
${filters.mode === 'expiring' && expiringSoon
    ? `IMPORTANT: User selected Expiring Mode. You MUST prioritize recipes that use these expiring ingredients: ${expiringSoon}. Only suggest recipes containing at least one expiring item.`
    : ''}
${filters.mode === 'expiring' && !expiringSoon
    ? 'User selected Expiring Mode but no items are expiring soon. Let them know and suggest normal recipes instead.'
    : ''}

Filters (STRICTLY enforce all of these):
- Diet: ${filters.diet} ${filters.diet !== 'any' ? `- ONLY suggest ${filters.diet} recipes. Reject any recipe that doesn't match.` : ''}
- Cuisine: ${filters.cuisine} ${filters.cuisine !== 'any' ? `- ONLY suggest ${filters.cuisine} cuisine recipes.` : ''}
- Max cook time: ${filters.maxTime} mins - NEVER suggest a recipe with cookTime exceeding ${filters.maxTime} minutes.
- Difficulty: ${filters.difficulty} ${filters.difficulty !== 'any' ? `- ONLY suggest ${filters.difficulty} difficulty recipes.` : ''}
- Mode: ${filters.mode}

Instructions:
- NEVER start replyText with greetings like "Hello", "Hi", "Hey", "Hello there" etc.
- replyText should be 1-2 sentences, direct and helpful, no filler phrases.
- STRICT: Only use ingredients EXACTLY as named in the inventory. Never interpret, expand, or guess what an ingredient might be.
- STRICT: If an ingredient name is unclear or incomplete (e.g. "b", "x", "abc"), ignore it entirely. Do not guess.
- STRICT: Only suggest recipes that are actually possible with the listed ingredients. Do not invent ingredients the user didn't mention.
- If no recipes are possible within the given filter constraints, set replyText to explain why and return empty recipes array. Never break filter rules just to return results.
- If the user is asking for recipes or what to cook, return up to 4 recipes as JSON.
- If the user is asking a general question (substitutions, tips, etc.), just reply conversationally.
- If the inventory is empty or has no recognizable ingredients, set replyText to "I couldn't find any recognizable ingredients in your inventory. Please add some ingredients first!" and return empty recipes array.
- For recipe requests, respond with this exact JSON structure:

{
  "replyText": "A friendly 1-2 sentence response",
  "recipes": [
    {
      "title": "Recipe Name",
      "cuisine": "Indian",
      "cookTime": 20,
      "difficulty": "easy",
      "dietType": ["veg"],
      "ingredientsNeeded": [{"name": "onion", "quantity": 2, "unit": "pieces"}],
      "missingIngredients": [],
      "steps": ["Step 1...", "Step 2..."],
      "nutrition": {"calories": 350, "protein": 12, "carbs": 45, "fats": 8},
      "substitutions": [],
      "matchScore": "full"
    }
  ]
}

- For non-recipe responses: { "replyText": "your response", "recipes": [] }
- Return ONLY valid JSON. No markdown, no code blocks, no extra text.
- Keep each recipe's steps to maximum 6 steps.
- Keep step descriptions under 20 words each.
- Maximum 4 recipes.
- Be concise to avoid hitting token limits.
`;
};

const extractJsonObject = (raw: string): ParsedRecipeResponse | null => {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as ParsedRecipeResponse;
  } catch {
    // Fall through to fenced / embedded JSON recovery.
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1]?.trim() || trimmed;
  const jsonMatch = candidate.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return null;
  }

  const embedded = jsonMatch[0].trim();

  try {
    return JSON.parse(embedded) as ParsedRecipeResponse;
  } catch {
    return null;
  }
};

router.post('/recipes', async (req, res) => {
  const { userMessage, inventory = [], filters }: GenerateRecipesRequest = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!geminiApiKey) {
    return res.status(500).json({
      replyText: 'The AI service is not configured on the server.',
      recipes: [],
    });
  }

  if (!userMessage || !filters) {
    return res.status(400).json({
      replyText: 'Missing required recipe generation data.',
      recipes: [],
    });
  }

  const prompt = buildPrompt(userMessage, inventory, filters);
  const geminiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      let providerMessage = '';

      try {
        const parsedError = JSON.parse(errorText) as GeminiErrorResponse;
        providerMessage = parsedError.error?.message || '';
      } catch {
        providerMessage = '';
      }

      if (response.status === 429) {
        return res.status(429).json({
          replyText: 'Too many requests. Please wait a moment and try again.',
          recipes: [],
        });
      }

      if (response.status === 403) {
        return res.status(403).json({
          replyText: providerMessage || 'The AI provider rejected this request (403). Check API key permissions, API enablement, or provider restrictions.',
          recipes: [],
        });
      }

      return res.status(response.status).json({
        replyText: providerMessage || `Something went wrong (${response.status}). Please try again.`,
        recipes: [],
      });
    }

    const data = (await response.json()) as GeminiApiResponse;
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = extractJsonObject(raw);

    if (!parsed) {
      if (data.promptFeedback?.blockReason || data.candidates?.[0]?.finishReason) {
        console.error('Gemini response was not parseable:', {
          blockReason: data.promptFeedback?.blockReason,
          finishReason: data.candidates?.[0]?.finishReason,
          raw,
        });
      }

      return res.json({ replyText: raw, recipes: [] });
    }

    return res.json({
      replyText: parsed.replyText || "Here's what I found!",
      recipes: parsed.recipes || [],
    });
  } catch (error) {
    console.error('Recipe generation failed:', error);
    return res.status(500).json({
      replyText: 'I found some ideas but had trouble formatting them. Please try again!',
      recipes: [],
    });
  }
});

export default router;
