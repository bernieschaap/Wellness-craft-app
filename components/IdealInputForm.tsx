
import React, { useState } from 'react';
import type { UserDetails, WeeklySchedule, DaySchedule } from '../types.ts';

interface ProfileFormProps {
  onGeneratePlan: (name: string, details: UserDetails) => void;
  isLoading: boolean;
  onClose: () => void;
}

const activityOptions: DaySchedule['activity'][] = ['Rest', 'Upper Body Strength', 'Lower Body Strength', 'Full Body Strength', 'HIIT', 'Cardio (Running)', 'Cardio (Swimming)', 'Cardio (Cycling)'];
const durationOptions: DaySchedule['duration'][] = ['No Workout', '15-30 minutes', '30-45 minutes', '45-60 minutes', '60-90 minutes'];
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;


const ProfileForm: React.FC<ProfileFormProps> = ({ onGeneratePlan, isLoading, onClose }) => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState<Omit<UserDetails, 'weeklySchedule'>>({
    age: '30',
    gender: 'male',
    weight: '75',
    height: '180',
    goal: 'maintain',
    activityLevel: 'moderate',
    healthConditions: '',
    budget: 'standard',
    dietaryPreferences: '',
    foodsToExclude: '',
    availableEquipment: '',
  });

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    monday: { activity: 'Upper Body Strength', duration: '45-60 minutes' },
    tuesday: { activity: 'HIIT', duration: '30-45 minutes' },
    wednesday: { activity: 'Lower Body Strength', duration: '45-60 minutes' },
    thursday: { activity: 'Cardio (Running)', duration: '30-45 minutes' },
    friday: { activity: 'Upper Body Strength', duration: '45-60 minutes' },
    saturday: { activity: 'Rest', duration: 'No Workout' },
    sunday: { activity: 'Rest', duration: 'No Workout' },
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (day: keyof WeeklySchedule, field: keyof DaySchedule, value: string) => {
    setWeeklySchedule(prev => ({
        ...prev,
        [day]: {
            ...prev[day],
            [field]: value,
             // Sync duration with activity
            ...(field === 'activity' && value === 'Rest' && { duration: 'No Workout' }),
            ...(field === 'activity' && value !== 'Rest' && prev[day].duration === 'No Workout' && { duration: '30-45 minutes' }),
        }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        setError('Profile Name is required.');
        return;
    }
    if (!details.age || !details.weight || !details.height) {
        setError('Age, Weight, and Height are required.');
        return;
    }
    setError(null);
    
    const finalDetails: UserDetails = {
        ...details,
        weeklySchedule,
    };

    onGeneratePlan(name, finalDetails);
  };

  const inputClasses = "w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition";
  const labelClasses = "block mb-2 text-sm font-medium text-gray-300";

  return (
    <div className="p-8 bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">Create New Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Personal Details Section */}
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                    <label htmlFor="name" className={labelClasses}>Profile Name</label>
                    <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} placeholder="e.g., John's Fitness Journey" />
                </div>
                <div>
                    <label htmlFor="age" className={labelClasses}>Age</label>
                    <input type="number" name="age" id="age" value={details.age} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="gender" className={labelClasses}>Gender</label>
                    <select name="gender" id="gender" value={details.gender} onChange={handleChange} className={inputClasses}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="weight" className={labelClasses}>Weight (kg)</label>
                    <input type="number" name="weight" id="weight" value={details.weight} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="height" className={labelClasses}>Height (cm)</label>
                    <input type="number" name="height" id="height" value={details.height} onChange={handleChange} className={inputClasses} />
                </div>
                <div className="md:col-span-2">
                     <label htmlFor="activityLevel" className={labelClasses}>Overall Activity (non-exercise)</label>
                    <select name="activityLevel" id="activityLevel" value={details.activityLevel} onChange={handleChange} className={inputClasses}>
                        <option value="sedentary">Sedentary (desk job)</option>
                        <option value="light">Lightly Active (some walking)</option>
                        <option value="moderate">Moderately Active (active job)</option>
                        <option value="very">Very Active (physical job)</option>
                    </select>
                </div>
            </fieldset>
            
            {/* Health & Goals Section */}
            <fieldset className="space-y-4 rounded-lg border border-gray-700 p-4">
                 <legend className="text-lg font-semibold text-gray-200 px-2">Health & Goals</legend>
                 <div>
                    <label htmlFor="goal" className={labelClasses}>Primary Fitness Goal</label>
                    <select name="goal" id="goal" value={details.goal} onChange={handleChange} className={inputClasses}>
                        <option value="lose">Lose Weight</option>
                        <option value="gain">Build Muscle</option>
                        <option value="maintain">Maintain Weight</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="healthConditions" className={labelClasses}>Health Conditions (Optional)</label>
                    <textarea name="healthConditions" id="healthConditions" value={details.healthConditions} onChange={handleChange} className={inputClasses} rows={2} placeholder="e.g., high blood pressure, type 2 diabetes, rheumatoid arthritis. Leave blank if none."/>
                </div>
            </fieldset>


            {/* Meal Plan Section */}
            <fieldset className="space-y-4 rounded-lg border border-gray-700 p-4">
                 <legend className="text-lg font-semibold text-gray-200 px-2">Meal Preferences</legend>
                 <div>
                    <label htmlFor="budget" className={labelClasses}>Meal Plan Budget</label>
                    <select name="budget" id="budget" value={details.budget} onChange={handleChange} className={inputClasses}>
                        <option value="standard">Standard</option>
                        <option value="budget-friendly">Budget-Friendly</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="dietaryPreferences" className={labelClasses}>Dietary Needs or Restrictions</label>
                    <textarea name="dietaryPreferences" id="dietaryPreferences" value={details.dietaryPreferences} onChange={handleChange} className={inputClasses} rows={2} placeholder="e.g., vegetarian, no gluten, allergic to nuts"></textarea>
                </div>
                 <div>
                    <label htmlFor="foodsToExclude" className={labelClasses}>Foods to Avoid/Dislike</label>
                    <textarea name="foodsToExclude" id="foodsToExclude" value={details.foodsToExclude} onChange={handleChange} className={inputClasses} rows={2} placeholder="e.g., pilchards, mielie pap, broccoli"></textarea>
                </div>
            </fieldset>

            {/* Exercise Plan Section */}
            <fieldset className="space-y-4 rounded-lg border border-gray-700 p-4">
                <legend className="text-lg font-semibold text-gray-200 px-2">Design Your Weekly Workout Schedule</legend>
                <div className="space-y-3">
                    {daysOfWeek.map(day => (
                        <div key={day} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                           <label htmlFor={`${day}-activity`} className="text-gray-300 font-medium capitalize sm:col-span-1">{day}</label>
                           <select 
                                name={`${day}-activity`} 
                                id={`${day}-activity`}
                                value={weeklySchedule[day].activity}
                                onChange={(e) => handleScheduleChange(day, 'activity', e.target.value)}
                                className={`${inputClasses} p-2 sm:col-span-1`}
                            >
                               {activityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                           </select>
                           <select 
                                name={`${day}-duration`}
                                id={`${day}-duration`}
                                value={weeklySchedule[day].duration}
                                onChange={(e) => handleScheduleChange(day, 'duration', e.target.value)}
                                className={`${inputClasses} p-2 sm:col-span-1`}
                                disabled={weeklySchedule[day].activity === 'Rest'}
                            >
                               {durationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                           </select>
                        </div>
                    ))}
                </div>
                 <div>
                    <label htmlFor="availableEquipment" className={labelClasses}>Available Equipment</label>
                    <textarea name="availableEquipment" id="availableEquipment" value={details.availableEquipment} onChange={handleChange} className={inputClasses} rows={2} placeholder="e.g., basic home gym (bench, dumbbells), resistance bands, kettlebell"/>
                </div>
            </fieldset>

             {error && (
                <div className="text-center p-2 bg-red-900/20 text-red-400 rounded-lg">
                    {error}
                </div>
            )}
            <div className="flex items-center gap-4">
                 <button type="button" onClick={onClose} className="w-1/3 text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors bg-gray-600 hover:bg-gray-500">
                    Cancel
                 </button>
                 <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-2/3 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700"
                >
                    {isLoading ? 'Generating Plan...' : 'Create Profile & Generate Plan'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default ProfileForm;