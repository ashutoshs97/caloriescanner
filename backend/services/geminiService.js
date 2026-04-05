const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API client
// In production, store API key in environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * System prompt for Gemini Vision API to ensure consistent JSON output
 * This prompt instructs the model to analyze food images and return structured nutrition data
 */
const FOOD_ANALYSIS_SYSTEM_PROMPT = `
You are an expert nutritionist and food analyst. Analyze the provided image of food and return a JSON object with the following exact structure:

{
  "foodType": "string describing the primary food item(s) detected",
  "portionSize": "string describing the estimated portion size (e.g., '1 cup', '200g', 'one medium piece')",
  "calories": number (estimated total calories in the portion),
  "protein": number (grams of protein in the portion),
  "carbs": number (grams of carbohydrates in the portion),
  "fats": number (grams of fat in the portion)
}

Important guidelines:
1. Only return valid JSON - no additional text, explanations, or formatting
2. If uncertain about values, provide your best estimate based on visible food
3. For mixed dishes, estimate the overall nutritional values for the entire visible portion
4. Use standard nutritional values for common foods
5. Portion size should be realistic and describable in common measurement units
6. All numeric values must be numbers (not strings)
7. If the image is unclear or not food, return null values for all fields
`;

const generationConfig = {
  temperature: 0.2, // Lower temperature for more consistent, factual responses
  topK: 32,
  topP: 0.9,
  maxOutputTokens: 1024,
};

/**
 * Analyze food image using Gemini Vision API
 * @param {string} base64Image - Base64 encoded image string
 * @param {string} mimeType - MIME type of the image (e.g., 'image/jpeg', 'image/png')
 * @returns {Promise<Object>} Parsed nutrition data or null if analysis fails
 */
const analyzeFoodImage = async (base64Image, mimeType = 'image/jpeg') => {
  try {
    // Get the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    // Generate content with system prompt and image
    const result = await model.generateContent([
      FOOD_ANALYSIS_SYSTEM_PROMPT,
      imagePart,
    ], generationConfig);

    // Extract the response text
    const response = await result.response;
    const text = response.text();

    // Attempt to parse JSON from the response
    // Clean the response to extract JSON (in case of extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in Gemini response');
    }

    const jsonString = jsonMatch[0];
    const nutritionData = JSON.parse(jsonString);

    // Validate required fields
    const requiredFields = ['foodType', 'portionSize', 'calories', 'protein', 'carbs', 'fats'];
    for (const field of requiredFields) {
      if (nutritionData[field] === undefined) {
        throw new Error(`Missing required field: ${field}`);
      }
      // Ensure numeric fields are numbers
      if (['calories', 'protein', 'carbs', 'fats'].includes(field) && typeof nutritionData[field] !== 'number') {
        nutritionData[field] = Number(nutritionData[field]);
        if (isNaN(nutritionData[field])) {
          throw new Error(`Field ${field} must be a valid number`);
        }
      }
    }

    return nutritionData;
  } catch (error) {
    console.error('Error analyzing food image with Gemini:', error);
    // Return null or throw error based on preference - here we throw to let caller handle
    throw error;
  }
};

module.exports = {
  analyzeFoodImage,
  FOOD_ANALYSIS_SYSTEM_PROMPT,
};