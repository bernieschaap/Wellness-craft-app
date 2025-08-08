
import type { UserDetails, WellnessPlan, Recipe, RecipePreferences, ChatHistoryContent, DailyMealPlan, ShoppingList } from '../types.ts';

const API_ENDPOINT = '/.netlify/functions/gemini';

async function postRequest(action: string, payload: any) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    return response.json();
}

export const generateWellnessPlan = async (details: UserDetails): Promise<WellnessPlan> => {
    return postRequest('generateWellnessPlan', details);
};

export const generateShoppingList = async (mealPlan: DailyMealPlan[]): Promise<ShoppingList> => {
    return postRequest('generateShoppingList', mealPlan);
};

export const analyzeMealPhoto = async (base64Image: string, mimeType: string): Promise<{ description: string, calories: number }> => {
    return postRequest('analyzeMealPhoto', { base64Image, mimeType });
};
export const generateRecipe = async (preferences: RecipePreferences): Promise<Recipe> => {
    return postRequest('generateRecipe', preferences);
};

export const sendMessageStream = async (details: UserDetails, history: ChatHistoryContent[], message: string) => {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendMessageStream', payload: { details, history, message } }),
    });
    
    if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    async function* streamGenerator() {
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    break;
                }
                // The yielded value needs to have a .text property to match the UI component's expectation
                yield { text: decoder.decode(value) };
            }
        } catch (error) {
            console.error("Error reading response stream:", error);
            throw new Error("Failed to process stream from server. The connection may have been interrupted.");
        }
    }
    
    return streamGenerator();
};