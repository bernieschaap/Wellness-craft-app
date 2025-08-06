
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { WorkoutLog, LoggedExercise, LoggedExerciseSet } from '../types';
import PlusCircleIcon from './icons/PlusCircleIcon';

interface LogWorkoutFormProps {
    onLogWorkout: (log: WorkoutLog) => void;
    onClose: () => void;
}

const LogWorkoutForm: React.FC<LogWorkoutFormProps> = ({ onLogWorkout, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [exercises, setExercises] = useState<LoggedExercise[]>([]);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAddExercise = () => {
        setExercises([...exercises, {
            id: uuidv4(),
            name: '',
            type: 'Strength',
            sets: [{ reps: 8, weight: 10 }],
            duration: 30,
            distance: 5
        }]);
    };

    const handleExerciseChange = (index: number, field: keyof LoggedExercise, value: any) => {
        const newExercises = [...exercises];
        (newExercises[index] as any)[field] = value;
        setExercises(newExercises);
    };

    const handleSetChange = (exIndex: number, setIndex: number, field: keyof LoggedExerciseSet, value: number) => {
        const newExercises = [...exercises];
        newExercises[exIndex].sets[setIndex][field] = value;
        setExercises(newExercises);
    };

    const handleAddSet = (exIndex: number) => {
        const newExercises = [...exercises];
        const currentSets = newExercises[exIndex].sets;
        const lastSet = currentSets.length > 0 ? currentSets[currentSets.length - 1] : { reps: 8, weight: 10 };
        newExercises[exIndex].sets.push({ ...lastSet });
        setExercises(newExercises);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (exercises.length === 0 || !exercises.every(ex => ex.name.trim())) {
            setError('Please add at least one exercise and give each one a name.');
            return;
        }
        setError(null);
        onLogWorkout({
            id: uuidv4(),
            date,
            exercises: exercises.map(ex => ({...ex, sets: ex.type === 'Strength' ? ex.sets : [], duration: ex.type === 'Cardio' ? ex.duration : 0, distance: ex.type === 'Cardio' ? ex.distance : 0})),
            notes
        });
        onClose();
    };
    
    const inputClasses = "w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition";
    const labelClasses = "block mb-1 text-xs font-medium text-gray-400";

    return (
        <div className="p-8 bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">Log a Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                    <label htmlFor="workout-date" className="block mb-2 text-sm font-medium text-gray-300">Date</label>
                    <input type="date" id="workout-date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} />
                </div>
                
                <div className="space-y-4">
                    {exercises.map((ex, exIndex) => (
                        <div key={ex.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 space-y-3">
                            <input type="text" placeholder="Exercise Name (e.g., Bench Press)" value={ex.name} onChange={e => handleExerciseChange(exIndex, 'name', e.target.value)} className={`${inputClasses} p-2 font-semibold`} />
                            <select value={ex.type} onChange={e => handleExerciseChange(exIndex, 'type', e.target.value)} className={inputClasses}>
                                <option>Strength</option>
                                <option>Cardio</option>
                            </select>

                            {ex.type === 'Strength' && (
                                <div className="space-y-2">
                                    {ex.sets.map((set, setIndex) => (
                                        <div key={setIndex} className="grid grid-cols-3 gap-2 items-center">
                                            <span className="text-gray-400 font-medium">Set {setIndex + 1}</span>
                                            <input type="number" placeholder="Reps" value={set.reps} onChange={e => handleSetChange(exIndex, setIndex, 'reps', +e.target.value)} className={inputClasses} />
                                            <input type="number" placeholder="Weight (kg)" value={set.weight} onChange={e => handleSetChange(exIndex, setIndex, 'weight', +e.target.value)} className={inputClasses} />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddSet(exIndex)} className="text-fuchsia-400 hover:text-fuchsia-300 text-sm font-semibold">+ Add Set</button>
                                </div>
                            )}

                             {ex.type === 'Cardio' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="number" placeholder="Duration (min)" value={ex.duration} onChange={e => handleExerciseChange(exIndex, 'duration', +e.target.value)} className={inputClasses} />
                                    <input type="number" placeholder="Distance (km)" value={ex.distance} onChange={e => handleExerciseChange(exIndex, 'distance', +e.target.value)} className={inputClasses} />
                                </div>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddExercise} className="flex items-center gap-2 w-full justify-center p-3 rounded-lg border-2 border-dashed border-gray-600 text-gray-400 hover:border-fuchsia-500 hover:text-fuchsia-500 transition">
                       <PlusCircleIcon className="w-6 h-6"/> Add Exercise
                    </button>
                </div>
                
                <div>
                    <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-300">Notes</label>
                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClasses} rows={3} placeholder="How did the workout feel? Any PRs?"></textarea>
                </div>
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <div className="flex items-center gap-4 pt-4">
                    <button type="button" onClick={onClose} className="w-1/3 text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors bg-gray-600 hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="w-2/3 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-fuchsia-500 to-rose-600 hover:from-fuchsia-600 hover:to-rose-700">Log Workout</button>
                </div>
            </form>
        </div>
    );
};

export default LogWorkoutForm;
