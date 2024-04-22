const axios = require("axios");

// Hardcoded Edamam Nutrition API credentials (Not recommended for production)
const EDAMAM_APP_ID = '97e61480';
const EDAMAM_APP_KEY = '77792ae0062a98a1e4af33ce23d0adf9'; 
const EDAMAM_API_URL = "https://api.edamam.com/api/nutrition-details";

/**
 * Fetch nutrient data for an ingredient from Edamam Nutrition API.
 * @param {string} ingredient - The ingredient for which to fetch nutrient data.
 * @returns {Promise<object>} - Nutrient data for the ingredient.
 */
async function fetchNutrientData(ingredient) {
  try {
    const response = await axios.post(
      EDAMAM_API_URL,
      {
        ingr: [ingredient],
      },
      {
        params: {
          app_id: EDAMAM_APP_ID,
          app_key: EDAMAM_APP_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching nutrient data:", error);
    throw new Error("Error fetching nutrient data.");
  }
}

module.exports = fetchNutrientData;
