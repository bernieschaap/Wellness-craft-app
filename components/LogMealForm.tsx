
import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { MealLog } from '../types';
import { analyzeMealPhoto } from '../services/geminiService';
import CameraIcon from './icons/CameraIcon';

interface LogMealFormProps {
    onLogMeal: (log: MealLog) => void;
    onClose: () => void;
}

const LogMealForm: React.FC<LogMealFormProps> = ({ onLogMeal, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toTimeString().substring(0, 5));
    const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
    const [description, setDescription] = useState('');
    const [calories, setCalories] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Please describe what you ate.');
            return;
        }
        setError(null);
        onLogMeal({ 
            id: uuidv4(), 
            date, 
            time, 
            mealType, 
            description,
            calories: calories ? parseInt(calories, 10) : undefined
        });
        onClose();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setAnalysisError(null);
        
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = (reader.result as string).split(',')[1];
                const mimeType = file.type;
                const result = await analyzeMealPhoto(base64String, mimeType);
                setDescription(result.description);
                setCalories(String(result.calories));
                setIsAnalyzing(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            setAnalysisError(message);
            setIsAnalyzing(false);
        }
    };

    const inputClasses = "w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
    const labelClasses = "block mb-2 text-sm font-medium text-gray-300";

    return (
        <>
            <div className="p-8 bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-auto border border-gray-700">
                <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">Log a Meal</h2>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className={labelClasses}>Date</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="time" className={labelClasses}>Time</label>
                            <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClasses} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="mealType" className={labelClasses}>Meal Type</label>
                        <select id="mealType" value={mealType} onChange={(e) => setMealType(e.target.value as any)} className={inputClasses}>
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                            <option>Snack</option>
                        </select>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="description" className={labelClasses}>What did you eat?</label>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => fileInputRef.current?.click()} title="Analyze with AI" className="p-1 text-gray-400 hover:text-cyan-400 transition">
                                    <CameraIcon className="w-5 h-5"/>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>
                        </div>
                        <div className="relative">
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClasses} rows={3} placeholder="e.g., Oatmeal with berries, protein shake" />
                             {isAnalyzing && (
                                <div className="absolute inset-0 bg-gray-700/80 flex items-center justify-center rounded-lg">
                                    <p className="text-cyan-300 animate-pulse">Analyzing...</p>
                                </div>
                            )}
                        </div>
                         {analysisError && <p className="text-red-400 text-sm mt-1">{analysisError}</p>}
                    </div>
                    <div>
                        <label htmlFor="calories" className={labelClasses}>Calories (kcal)</label>
                        <input type="number" id="calories" value={calories} onChange={(e) => setCalories(e.target.value)} className={inputClasses} placeholder="e.g., 450"/>
                    </div>
                    
                    {error && <p className="text-red-400 text-sm mt-1 text-center">{error}</p>}

                    <div className="flex items-center gap-4 pt-2">
                        <button type="button" onClick={onClose} className="w-1/3 text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors bg-gray-600 hover:bg-gray-500">Cancel</button>
                        <button type="submit" disabled={isAnalyzing} className="w-2/3 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 disabled:opacity-50">Log Meal</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LogMealForm;
