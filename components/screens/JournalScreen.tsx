
import React, { useState } from 'react';
import type { Profile, MealLog, WorkoutLog } from '../../types.ts';
import LogMealForm from '../LogMealForm.tsx';
import LogWorkoutForm from '../LogWorkoutForm.tsx';
import ForkKnifeIcon from '../icons/ForkKnifeIcon.tsx';
import DumbbellIcon from '../icons/DumbbellIcon.tsx';

const CalorieTracker = ({
    current,
    goal
}: {
    current: number,
    goal: number
}) => {
    const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-8">
            <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-200">Today's Calories</h3>
                <p className="text-lg font-bold text-white">
                    {current} <span className="text-sm text-gray-400">/ {goal} kcal</span>
                </p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-cyan-500 to-sky-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
};


interface JournalScreenProps {
    profile: Profile;
    onLogMeal: (log: MealLog) => void;
    onLogWorkout: (log: WorkoutLog) => void;
}

const JournalScreen: React.FC<JournalScreenProps> = ({ profile, onLogMeal, onLogWorkout }) => {
    const [loggingType, setLoggingType] = useState<'meal' | 'workout' | null>(null);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysCalories = profile.mealLogs
        .filter(log => log.date === todayStr && log.calories)
        .reduce((total, log) => total + (log.calories || 0), 0);

    const combinedLogs = [
        ...profile.mealLogs.map(log => ({ ...log, type: 'meal' as const })),
        ...profile.workoutLogs.map(log => ({ ...log, type: 'workout' as const })),
    ].sort((a, b) => {
        const dateTimeB = new Date(`${b.date}T${b.type === 'meal' ? b.time : '00:00'}`).getTime();
        const dateTimeA = new Date(`${a.date}T${a.type === 'meal' ? a.time : '00:00'}`).getTime();
        return dateTimeB - dateTimeA;
    });

    return (
        <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in">
             <CalorieTracker current={todaysCalories} goal={profile.plan?.dailyCalorieGoal || 2000} />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
                <button type="button" onClick={() => setLoggingType('meal')} className="flex items-center gap-2 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700">
                    <ForkKnifeIcon className="w-5 h-5" /> Log Meal
                </button>
                <button type="button" onClick={() => setLoggingType('workout')} className="flex items-center gap-2 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 bg-gradient-to-r from-fuchsia-500 to-rose-600 hover:from-fuchsia-600 hover:to-rose-700">
                    <DumbbellIcon className="w-5 h-5" /> Log Workout
                </button>
            </div>

            {/* Log History */}
            <div className="space-y-6">
                {combinedLogs.length > 0 ? (
                    combinedLogs.map(log => (
                        <div key={log.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                            {log.type === 'meal' && (
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 pt-1"><ForkKnifeIcon className="w-8 h-8 text-cyan-400" /></div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm text-gray-400">{new Date(log.date).toLocaleDateString()} at {log.time}</p>
                                                <h3 className="text-lg font-bold text-cyan-300">{log.mealType}</h3>
                                            </div>
                                            {log.calories && <span className="bg-cyan-900/50 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">{log.calories} kcal</span>}
                                        </div>
                                        <p className="text-gray-300 mt-1">{log.description}</p>
                                    </div>
                                </div>
                            )}
                             {log.type === 'workout' && (
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 pt-1"><DumbbellIcon className="w-8 h-8 text-fuchsia-400" /></div>
                                    <div>
                                        <p className="text-sm text-gray-400">{new Date(log.date).toLocaleDateString()}</p>
                                        <h3 className="text-lg font-bold text-fuchsia-300">Workout Session</h3>
                                        <ul className="mt-2 space-y-1">
                                            {log.exercises.map(ex => (
                                                <li key={ex.id} className="text-gray-300">
                                                    <strong>{ex.name}</strong>: {ex.type === 'Strength' 
                                                        ? `${ex.sets.length} sets (${ex.sets.map(s => `${s.reps}x${s.weight}kg`).join(', ')})`
                                                        : `${ex.duration} min / ${ex.distance} km`}
                                                </li>
                                            ))}
                                        </ul>
                                        {log.notes && <p className="mt-2 text-sm text-gray-400 italic">Notes: {log.notes}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 px-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-300">Your Journal is Empty</h3>
                        <p className="mt-2 text-gray-400">Log your first meal or workout to get started!</p>
                    </div>
                )}
            </div>
            
            {/* Modals */}
            {loggingType && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setLoggingType(null)}>
                     <div onClick={e => e.stopPropagation()}>
                        {loggingType === 'meal' && <LogMealForm onLogMeal={onLogMeal} onClose={() => setLoggingType(null)} />}
                        {loggingType === 'workout' && <LogWorkoutForm onLogWorkout={onLogWorkout} onClose={() => setLoggingType(null)} />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalScreen;