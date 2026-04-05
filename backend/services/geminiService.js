/**
 * Food Image Analysis Service using OpenRouter API
 * OpenRouter provides access to many AI models through one unified API.
 * We use a vision-capable model to analyze food images.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Use a vision-capable model available on OpenRouter's free tier
// google/gemini-2.0-flash-001 supports vision and is free
const VISION_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

const FOOD_ANALYSIS_SYSTEM_PROMPT = `You are an expert nutritionist and food analyst. Analyze the provided image of food and return a JSON object with the following exact structure:

{
  "foodType": "string describing the primary food item(s) detected",
  "portionSize": "string describing the estimated portion size (e.g., '1 cup', '200g', 'one medium piece')",
  "calories": number (estimated total calories in the portion),
  "protein": number (grams of protein in the portion),
  "carbs": number (grams of carbohydrates in the portion),
  "fats": number (grams of fat in the portion)
}

Important guidelines:
1. Only return valid JSON - no additional text, explanations, markdown code blocks or formatting
2. If uncertain about values, provide your best estimate based on visible food
3. For mixed dishes, estimate the overall nutritional values for the entire visible portion
4. Use standard nutritional values for common foods
5. Portion size should be realistic and describable in common measurement units
6. All numeric values must be numbers (not strings)
7. If the image is unclear or not food, return null values for all fields`;

/**
 * Analyze food image using OpenRouter API
 * @param {string} base64Image - Base64 encoded image string (without data: prefix)
 * @param {string} mimeType - MIME type of the image (e.g., 'image/jpeg', 'image/png')
 * @returns {Promise<Object>} Parsed nutrition data
 */
const analyzeFoodImage = async (base64Image, mimeType = 'image/jpeg') => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
      'X-Title': 'NitroScan Calorie Tracker',
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [
        {
          role: 'system',
          content: FOOD_ANALYSIS_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: 'text',
              text: 'Analyze this food image and return the nutrition data as JSON.',
            },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Extract the text content from the API response
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from OpenRouter API');
  }

  // Strip markdown code blocks if model wraps JSON in ```json ... ```
  const cleaned = text.replace(/```(?:json)?\n?/gi, '').trim();

  // Extract JSON object from the response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON object found in response: ${text}`);
  }

  const nutritionData = JSON.parse(jsonMatch[0]);

  // Validate and coerce required fields
  const requiredFields = ['foodType', 'portionSize', 'calories', 'protein', 'carbs', 'fats'];
  for (const field of requiredFields) {
    if (nutritionData[field] === undefined) {
      throw new Error(`Missing required field in AI response: ${field}`);
    }
    if (['calories', 'protein', 'carbs', 'fats'].includes(field)) {
      nutritionData[field] = Number(nutritionData[field]);
      if (isNaN(nutritionData[field])) {
        throw new Error(`Field ${field} must be a valid number`);
      }
    }
  }

  return nutritionData;
};

module.exports = {
  analyzeFoodImage,
  FOOD_ANALYSIS_SYSTEM_PROMPT,
};
