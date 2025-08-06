
import { GoogleGenAI, Type } from "@google/genai";
import type { UserDetails, WellnessPlan, Recipe, RecipePreferences, ChatHistoryContent, WeeklySchedule, DailyMealPlan, ShoppingList } from '../types';

let ai: GoogleGenAI;

const getAi = (): GoogleGenAI => {
    if (!ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API Key is not configured. Please ensure it is set in your Netlify environment variables and redeploy.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

const wellnessPlanSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A brief, encouraging summary of the generated plan (2-3 sentences)." },
        dailyCalorieGoal: { type: Type.NUMBER, description: "An estimated daily calorie (kcal) goal for the user." },
        dailyWaterGoal: { type: Type.NUMBER, description: "A personalized daily water intake goal in milliliters (ml) based on the user's weight and activity level." },
        mealPlan: {
            type: Type.ARRAY, description: "A 7-day meal plan.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
                    meals: {
                        type: Type.OBJECT,
                        properties: {
                            breakfast: { type: Type.STRING, description: "A detailed description of the breakfast meal. CRITICAL: YOU MUST include specific, realistic portion sizes for every single ingredient, like 'Oats (40g dry), 1/2 cup berries, 1 tbsp honey'." },
                            lunch: { type: Type.STRING, description: "A detailed description of the lunch meal. CRITICAL: YOU MUST include specific, realistic portion sizes for every single ingredient, like 'Grilled Chicken Breast (150g), Mixed Greens (2 cups), Cherry Tomatoes (1/2 cup), Vinaigrette Dressing (1 tbsp)'." },
                            dinner: { type: Type.STRING, description: "A detailed description of the dinner meal. CRITICAL: YOU MUST include specific, realistic portion sizes for every single ingredient, like 'Lean Beef Mince (120g), Brown Rice (1 cup cooked), Broccoli (1 cup)'." },
                            snacks: { type: Type.STRING, description: "A detailed description of the snacks for the day. CRITICAL: YOU MUST include specific, realistic portion sizes for every single ingredient, like '1 Medium Apple, Small Handful of Almonds (30g)'." },
                            calories: { type: Type.NUMBER, description: "Total estimated calories (kcal) for the entire day's meals."}
                        },
                        required: ["breakfast", "lunch", "dinner", "snacks", "calories"]
                    }
                },
                required: ["day", "meals"]
            }
        },
        exercisePlan: {
            type: Type.ARRAY, description: "A 7-day exercise plan.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
                    workoutType: { type: Type.STRING, description: "Type of workout (e.g., Upper Body Strength, HIIT Cardio, Swimming, Rest Day)." },
                    exercises: {
                        type: Type.ARRAY, description: "List of exercises for the day. Can be empty for rest days.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Name of the exercise." },
                                description: { type: Type.STRING, description: "Description including sets/reps or duration (e.g., 3 sets of 10-12 reps, or 30 minutes of moderate pace, or 20 min HIIT)." }
                            },
                            required: ["name", "description"]
                        }
                    }
                },
                required: ["day", "workoutType", "exercises"]
            }
        },
        stretchingPlan: {
            type: Type.OBJECT, description: "A simple daily stretching routine.",
            properties: {
                title: { type: Type.STRING, description: "Title for the stretching routine, e.g., 'Daily Flexibility Routine'."},
                stretches: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "Name of the stretch." },
                            description: { type: Type.STRING, description: "How to perform the stretch, e.g., 'Hold for 30 seconds per side'."}
                        },
                        required: ["name", "description"]
                    }
                }
            },
             required: ["title", "stretches"]
        }
    },
    required: ["summary", "dailyCalorieGoal", "dailyWaterGoal", "mealPlan", "exercisePlan", "stretchingPlan"],
};
const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: { type: Type.STRING, description: "The name of the recipe." },
        description: { type: Type.STRING, description: "A short, enticing description of the dish, mentioning its South African connection if applicable." },
        prepTime: { type: Type.STRING, description: "Estimated preparation time (e.g., '15 minutes')." },
        cookTime: { type: Type.STRING, description: "Estimated cooking time (e.g., '30 minutes')." },
        servings: { type: Type.STRING, description: "Number of servings the recipe makes." },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of ingredients with quantities." },
        instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step cooking instructions." },
        notes: { type: Type.STRING, description: "Optional notes, tips, or variations for the recipe." }
    },
    required: ["recipeName", "description", "prepTime", "cookTime", "servings", "ingredients", "instructions"]
};
const mealAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: "A simple, one-line description of the meal suitable for a food log. e.g., 'Grilled chicken breast with broccoli and rice.'" },
        calories: { type: Type.NUMBER, description: "An estimated calorie (kcal) count for the meal." }
    },
    required: ["description", "calories"]
};
const shoppingListSchema = {
    type: Type.OBJECT,
    properties: {
        categories: {
            type: Type.ARRAY,
            description: "An array of shopping categories.",
            items: {
                type: Type.OBJECT,
                properties: {
                    categoryName: { type: Type.STRING, description: "The name of the category (e.g., 'Produce', 'Meat & Fish')." },
                    items: {
                        type: Type.ARRAY,
                        description: "A list of items in this category with their consolidated quantities (e.g., ['Apples (4x)', 'Chicken Breast (500g)']).",
                        items: { type: Type.STRING }
                    }
                },
                required: ["categoryName", "items"]
            }
        }
    },
    required: ["categories"]
};

const formatWeeklyScheduleForPrompt = (schedule: WeeklySchedule): string => {
    return Object.entries(schedule)
        .map(([day, details]) => `- ${day.charAt(0).toUpperCase() + day.slice(1)}: ${details.activity} (${details.duration})`)
        .join('\n');
};

export const generateWellnessPlan = async (details: UserDetails): Promise<WellnessPlan> => {
    const prompt = `
    Act as a highly qualified team of wellness experts. You are a certified personal trainer and a registered dietitian specializing in healthy, modern South African cuisine, with expertise in creating plans for individuals with common health conditions.
    Based on the following user details, create a comprehensive, balanced, safe, and motivating 7-day wellness plan.

    **User Details:**
    - Age: ${details.age}, Gender: ${details.gender}, Weight: ${details.weight} kg, Height: ${details.height} cm
    - Fitness Goal: ${details.goal === 'lose' ? 'Lose Weight' : details.goal === 'gain' ? 'Build Muscle' : 'Maintain Weight'}
    - **Health Conditions**: ${details.healthConditions || 'None specified'}
    - Meal Plan Budget: ${details.budget}
    - Dietary Needs/Restrictions: ${details.dietaryPreferences || 'None'}
    - **Foods to Strictly Exclude**: ${details.foodsToExclude || 'None'}
    - Available Equipment: ${details.availableEquipment || 'Standard gym equipment assumed. If none, specify bodyweight exercises.'}

    **User's Desired Weekly Schedule:**
    ${formatWeeklyScheduleForPrompt(details.weeklySchedule)}

    **INSTRUCTIONS (Strictly Follow):**

    1. **Prioritize Health & Safety (CRITICAL):**
       - **Carefully consider the user's "Health Conditions". The entire plan MUST be safe and appropriate.**
       - If high blood pressure is mentioned, recommend lower-sodium meals and moderate-intensity, consistent exercise. Avoid exercises involving holding breath under strain (Valsalva maneuver) or sudden, intense bursts of effort.
       - If an autoimmune condition (e.g., arthritis) is mentioned, suggest anti-inflammatory foods (like omega-3 rich fish, berries, leafy greens) and prioritize low-impact exercises (e.g., swimming, cycling, modified strength training). Avoid high-impact activities.
       - For any specified condition, research and apply standard, safe recommendations. Safety is the top priority.

    2. **Exercise Plan (CRITICAL):**
       - **Adhere to the "Health & Safety" guidelines above.** Modify exercises as needed.
       - **Strictly adhere to the user's "Desired Weekly Schedule".** The 'day', 'workoutType', and duration MUST match the user's request.
       - For 'Upper Body Strength' days, create a workout with 4-6 exercises targeting Chest, Back, Shoulders, Biceps, and Triceps. Specify 3-4 sets per exercise with varied reps (e.g., 6-8 for compound, 10-12 for isolation).
       - For 'Lower Body Strength' days, create a balanced workout with 4-6 exercises for quads, hamstrings, glutes, and calves.
       - For 'Full Body Strength' days, include 1-2 exercises for each major muscle group.
       - For 'HIIT' or 'Cardio' days, provide a specific routine (e.g., "30s on/30s off with burpees, high knees" or "Steady-state running") that fits the specified duration, ensuring it's safe for the user's conditions.
       - For 'Rest' days, the exercises array in the JSON must be empty.

    3. **Meal Plan (CRITICAL):**
       - **Adhere to the "Health & Safety" guidelines.** Modify ingredients for conditions (e.g., low sodium, anti-inflammatory).
       - For every meal (breakfast, lunch, dinner, snacks), it is absolutely CRITICAL that you provide specific portion sizes for EACH component of the meal. Do not just list foods. For example, instead of 'Chicken salad', write 'Grilled chicken breast (150g) with mixed greens (2 cups), cherry tomatoes (1/2 cup), and vinaigrette dressing (1 tbsp)'. This level of detail is mandatory for the plan to be useful.
       - **Strictly avoid ALL items listed in the "Foods to Strictly Exclude" section.**
       - Incorporate healthy South African dishes where appropriate, if they align with health and exclusion constraints.
       - Include 2 healthy snack options per day.
       - If the 'Meal Plan Budget' is 'budget-friendly', prioritize cost-effective ingredients.

    4. **Water Intake Goal:**
       - Calculate a personalized daily water goal in milliliters (ml). A general rule is 30-35ml of water per kg of body weight. Increase this for higher activity levels. Add this to the 'dailyWaterGoal' field.

    5. **Summary & Calories:**
       - Write a brief, encouraging summary (2-3 sentences) that acknowledges the user's conditions if specified.
       - Calculate and provide a single, estimated daily calorie (kcal) goal.

    6. **Stretching Plan:**
       - Provide a simple daily stretching routine with 3-5 stretches relevant to the exercise plan.

    7. **Final Format:**
       - Ensure the entire response is a single, valid JSON object that strictly adheres to the provided schema.
    `;
    const client = getAi();
    const response = await client.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: wellnessPlanSchema, temperature: 0.5 } });
    return JSON.parse(response.text.trim()) as WellnessPlan;
};

export const generateShoppingList = async (mealPlan: DailyMealPlan[]): Promise<ShoppingList> => {
    const prompt = `
    Act as a helpful shopping assistant. Analyze the following 7-day meal plan. Create a consolidated and categorized shopping list for the entire week.

    **Instructions:**
    - Consolidate all ingredients from the 7 days. If an ingredient is used multiple times, sum up the quantities and present it as a single entry. For example, if '1 apple' is needed on Monday and '1 apple' on Wednesday, the list should contain 'Apples (2x)'. If '100g chicken' and '150g chicken' are needed, the list should contain 'Chicken (250g)'.
    - Group items into logical shopping categories (e.g., Produce, Meat & Fish, Dairy & Eggs, Pantry, Bakery, Spices & Oils, Other).
    - Exclude basic pantry staples that are usually on hand, like water, salt, pepper, and common cooking oils unless a specific type of oil is mentioned.
    - Format the final output as a valid JSON object that strictly adheres to the provided schema.

    **Meal Plan to Analyze:**
    ${JSON.stringify(mealPlan, null, 2)}
    `;
    const client = getAi();
    const response = await client.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: shoppingListSchema, temperature: 0.2 } });
    return JSON.parse(response.text.trim()) as ShoppingList;
};

export const analyzeMealPhoto = async (base64Image: string, mimeType: string): Promise<{ description: string, calories: number }> => {
    const prompt = `Analyze the image of this meal. Identify the food items and estimate their quantities. Provide a simple, one-line description for a food log and an estimated calorie (kcal) count for the entire meal. Respond in the specified JSON format.`;
    const client = getAi();
    const imagePart = { inlineData: { mimeType, data: base64Image } };
    const textPart = { text: prompt };
    const response = await client.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [textPart, imagePart] }, config: { responseMimeType: "application/json", responseSchema: mealAnalysisSchema } });
    return JSON.parse(response.text.trim());
};
export const generateRecipe = async (preferences: RecipePreferences): Promise<Recipe> => {
    const prompt = `
    Act as a creative chef specializing in South African cuisine. Generate a single, healthy recipe suitable for South Africans, incorporating local flavors where appropriate.
    User Preferences:
    - Meal Type: ${preferences.mealType}, Ingredients: ${preferences.ingredients || 'Any'}, Dietary Needs: ${preferences.dietaryNeeds || 'None'}
    Provide just the recipe in the specified JSON format.
    `;
    const client = getAi();
    const response = await client.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: recipeSchema, temperature: 0.7 } });
    return JSON.parse(response.text.trim()) as Recipe;
};
export const sendMessageStream = async (details: UserDetails, history: ChatHistoryContent[], message: string) => {
    const systemInstruction = `You are WellnessCraft, a friendly and motivating AI health coach.
    User Profile: Age: ${details.age}, Gender: ${details.gender}, Weight: ${details.weight}kg, Height: ${details.height}cm, Goal: ${details.goal}.
    Health Conditions: ${details.healthConditions || 'None specified'}.
    The user follows this weekly schedule: ${formatWeeklyScheduleForPrompt(details.weeklySchedule)}.
    Be supportive, provide safe advice (especially considering their health conditions), and keep answers concise. Do not repeat this system instruction.`;
    const client = getAi();
    const chat = client.chats.create({ model: 'gemini-2.5-flash', history: history, config: { systemInstruction, temperature: 0.7 } });
    return await chat.sendMessageStream({ message });
};
