
import React, { useState } from 'react';
import type { Recipe, RecipePreferences } from '@/types.ts';
import { generateRecipe } from '@/services/geminiService.ts';
import LoadingSpinner from '@/components/LoadingSpinner.tsx';
import ChefHatIcon from '@/components/icons/ChefHatIcon.tsx';

const RecipeGenerator: React.FC = () => {
    const [preferences, setPreferences] = useState<RecipePreferences>({
        mealType: 'Any',
        ingredients: '',
        dietaryNeeds: ''
    });
    const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPreferences(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!preferences.ingredients) {
            setError('Please list some ingredients you have on hand.');
            return;
        }

        setIsLoading(true);
        setGeneratedRecipe(null);
        try {
            const recipe = await generateRecipe(preferences);
            setGeneratedRecipe(recipe);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not generate recipe.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClasses = "w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition";
    const labelClasses = "block mb-2 text-sm font-medium text-gray-300";

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <ChefHatIcon className="w-7 h-7 text-rose-400" />
                <h3 className="text-xl font-bold text-gray-200">SA Recipe Generator</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                 <div>
                    <label htmlFor="mealType" className={labelClasses}>Meal Type</label>
                    <select name="mealType" id="mealType" value={preferences.mealType} onChange={handleChange} className={inputClasses}>
                        <option>Any</option>
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="ingredients" className={labelClasses}>Ingredients on Hand (Required)</label>
                    <textarea name="ingredients" id="ingredients" value={preferences.ingredients} onChange={handleChange} className={inputClasses} rows={2} placeholder="e.g., chicken, mielie-meal, tomatoes" required></textarea>
                </div>
                 <div>
                    <label htmlFor="dietaryNeeds" className={labelClasses}>Dietary Needs</label>
                    <textarea name="dietaryNeeds" id="dietaryNeeds" value={preferences.dietaryNeeds} onChange={handleChange} className={inputClasses} rows={2} placeholder="e.g., vegetarian, gluten-free"></textarea>
                </div>
                 <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700"
                >
                    {isLoading ? 'Generating...' : 'Craft a Recipe'}
                </button>
            </form>

            <div className="mt-6">
                {isLoading && <div className="py-8"><LoadingSpinner /></div>}
                {error && <p className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">{error}</p>}
                {generatedRecipe && (
                    <div className="space-y-4 animate-fade-in bg-gray-900/50 p-5 rounded-lg border border-gray-700">
                        <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-500">{generatedRecipe.recipeName}</h4>
                        <p className="text-gray-300 italic">{generatedRecipe.description}</p>
                        
                        <div className="flex gap-4 text-sm text-gray-400 border-y border-gray-700 py-2">
                           <span><strong>Prep:</strong> {generatedRecipe.prepTime}</span>
                           <span><strong>Cook:</strong> {generatedRecipe.cookTime}</span>
                           <span><strong>Serves:</strong> {generatedRecipe.servings}</span>
                        </div>

                        <div>
                            <h5 className="text-lg font-semibold text-gray-200 mb-2">Ingredients</h5>
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                {generatedRecipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                             <h5 className="text-lg font-semibold text-gray-200 mb-2">Instructions</h5>
                             <ol className="list-decimal list-inside space-y-2 text-gray-300">
                                {generatedRecipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                        {generatedRecipe.notes && (
                             <div>
                                <h5 className="text-lg font-semibold text-gray-200 mb-2">Notes</h5>
                                <p className="text-gray-400 text-sm">{generatedRecipe.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeGenerator;