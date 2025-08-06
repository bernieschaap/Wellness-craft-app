
import React, { useState } from 'react';
import type { DailyMealPlan, ShoppingList } from '../types';
import { generateShoppingList } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import PrinterIcon from './icons/PrinterIcon';

interface ShoppingListGeneratorProps {
    mealPlan: DailyMealPlan[];
}

const ShoppingListGenerator: React.FC<ShoppingListGeneratorProps> = ({ mealPlan }) => {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleGenerateList = async () => {
        setIsLoading(true);
        setError(null);
        setShoppingList(null);
        setCheckedItems({});
        try {
            const list = await generateShoppingList(mealPlan);
            setShoppingList(list);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not generate shopping list.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleToggleItem = (key: string) => {
        setCheckedItems(prev => ({...prev, [key]: !prev[key]}));
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 print:border-none print:shadow-none print:p-0">
            <div className="flex items-center justify-between mb-4 print:hidden">
                <div className="flex items-center gap-3">
                    <ShoppingCartIcon className="w-7 h-7 text-green-400" />
                    <h3 className="text-xl font-bold text-gray-200">Weekly Shopping List</h3>
                </div>
                {shoppingList && (
                    <button onClick={() => window.print()} className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-transform hover:scale-110" aria-label="Print List" title="Print List">
                        <PrinterIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            {isLoading && <div className="py-8 print:hidden"><LoadingSpinner /></div>}
            {error && <p className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg print:hidden">{error}</p>}
            
            {!isLoading && !error && !shoppingList && (
                <div className="text-center py-8 print:hidden">
                    <p className="text-gray-400 mb-4">Generate a consolidated shopping list from your weekly meal plan.</p>
                    <button onClick={handleGenerateList} className="text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                        Generate List
                    </button>
                </div>
            )}

            {shoppingList && (
                <div className="animate-fade-in print:animate-none">
                    <h3 className="hidden print:block text-2xl font-bold text-black mb-6">Weekly Shopping List</h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 print:max-h-full print:overflow-visible">
                         {shoppingList.categories.map((category) => (
                             <div key={category.categoryName} className="print:break-inside-avoid">
                                <h4 className="text-lg font-bold text-green-400 border-b border-gray-700 pb-2 mb-2 print:text-black print:border-b-2 print:border-gray-300">{category.categoryName}</h4>
                                <ul className="space-y-2 list-none p-0">
                                    {category.items.map((item) => {
                                        const key = `${category.categoryName}-${item}`;
                                        const isChecked = checkedItems[key];
                                        return (
                                            <li key={key} onClick={() => handleToggleItem(key)} className="flex items-center cursor-pointer p-1 rounded-md hover:bg-gray-700/50 print:py-1 print:hover:bg-transparent">
                                                <div className="hidden print:block w-4 h-4 border-2 border-black rounded-sm mr-3 flex-shrink-0"></div>
                                                <input
                                                    type="checkbox"
                                                    readOnly
                                                    checked={isChecked}
                                                    className="print:hidden appearance-none h-5 w-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-0 cursor-pointer checked:bg-green-500 checked:border-transparent"
                                                    style={{ backgroundImage: isChecked ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")` : 'none'}}
                                                />
                                                <span className={`ml-3 text-gray-300 print:ml-0 print:text-black ${isChecked ? 'line-through text-gray-500' : ''}`}>{item}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                             </div>
                         ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingListGenerator;
