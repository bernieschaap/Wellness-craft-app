
import React from 'react';
import type { WellnessPlan, DailyExercisePlan } from '../types.ts';
import DumbbellIcon from './icons/DumbbellIcon.tsx';
import ForkKnifeIcon from './icons/ForkKnifeIcon.tsx';
import YogaIcon from './icons/YogaIcon.tsx';
import PrinterIcon from './icons/PrinterIcon.tsx';

interface PlanDisplayProps {
    plan: WellnessPlan;
    onToggleExercise: (day: string, exerciseName: string, isCompleted: boolean) => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onToggleExercise }) => {
  return (
    <div className="w-full mx-auto my-8 animate-fade-in relative print:my-0 print:animate-none">
        <h1 className="hidden print:block text-4xl font-bold text-center mb-6 text-black">
            Your Weekly Wellness Plan
        </h1>
        
        <button
            onClick={() => window.print()}
            className="absolute top-0 right-0 print:hidden p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-transform hover:scale-110"
            aria-label="Print Plan"
            title="Print Plan"
        >
            <PrinterIcon className="w-6 h-6" />
        </button>

        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 text-center border border-gray-700 print:bg-white print:border-b print:border-gray-300 print:rounded-none print:shadow-none">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-500 mb-2 print:text-black print:bg-none print:text-2xl">Your Personal Plan Summary</h2>
            <p className="text-gray-300 print:text-black">{plan.summary}</p>
             <p className="mt-2 text-lg font-semibold text-gray-200 print:text-black">Daily Calorie Goal: <span className="text-cyan-400 print:text-black print:font-bold">{plan.dailyCalorieGoal} kcal</span></p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 print:block">
        
        <div className="lg:col-span-5 print:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block">
                {/* MEAL PLAN */}
                <section className="print:mb-8 print:break-inside-avoid">
                  <div className="flex items-center gap-3 mb-4 print:hidden">
                    <ForkKnifeIcon className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-3xl font-bold text-gray-200">Meal Plan</h2>
                  </div>
                  <h2 className="hidden print:block text-2xl font-bold mb-4 text-black">Meal Plan</h2>
                  <div className="space-y-4">
                    {plan.mealPlan.map((dayPlan) => (
                      <div key={dayPlan.day} className="bg-gray-800 p-5 rounded-lg border border-gray-700 print:bg-white print:border print:border-gray-300 print:p-4 print:shadow-none print:mb-4">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold text-cyan-400 print:text-black">{dayPlan.day}</h3>
                            <span className="bg-cyan-900/50 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full print:border print:border-gray-400 print:text-black print:bg-gray-100">{dayPlan.meals.calories} kcal</span>
                        </div>
                        <ul className="space-y-2 text-gray-300 print:text-black">
                          <li><strong>Breakfast:</strong> {dayPlan.meals.breakfast}</li>
                          <li><strong>Lunch:</strong> {dayPlan.meals.lunch}</li>
                          <li><strong>Dinner:</strong> {dayPlan.meals.dinner}</li>
                          <li><strong>Snacks:</strong> {dayPlan.meals.snacks}</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* EXERCISE PLAN */}
                <section className="print:mb-8 print:break-inside-avoid">
                  <div className="flex items-center gap-3 mb-4 print:hidden">
                    <DumbbellIcon className="w-8 h-8 text-fuchsia-400" />
                    <h2 className="text-3xl font-bold text-gray-200">Exercise Plan</h2>
                  </div>
                   <h2 className="hidden print:block text-2xl font-bold mb-4 text-black">Exercise Plan</h2>
                  <div className="space-y-4">
                    {plan.exercisePlan.map((dayPlan: DailyExercisePlan) => (
                      <div key={dayPlan.day} className="bg-gray-800 p-5 rounded-lg border border-gray-700 print:bg-white print:border print:border-gray-300 print:p-4 print:shadow-none print:mb-4">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold text-fuchsia-400 print:text-black">{dayPlan.day}</h3>
                            <span className="bg-fuchsia-900/50 text-fuchsia-300 text-xs font-medium px-2.5 py-1 rounded-full print:border print:border-gray-400 print:text-black print:bg-gray-100">{dayPlan.workoutType}</span>
                        </div>
                        {dayPlan.exercises.length > 0 ? (
                             <ul className="space-y-3 text-gray-300 print:text-black">
                                {dayPlan.exercises.map(exercise => (
                                    <li key={exercise.name} className="flex items-start gap-3">
                                        <div className="hidden print:block w-4 h-4 border-2 border-black rounded-sm mr-2 mt-1 flex-shrink-0"></div>
                                        <input
                                            type="checkbox"
                                            id={`${dayPlan.day}-${exercise.name}`}
                                            checked={!!dayPlan.completedExercises?.[exercise.name]}
                                            onChange={(e) => onToggleExercise(dayPlan.day, exercise.name, e.target.checked)}
                                            className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-fuchsia-500 focus:ring-fuchsia-600 cursor-pointer print:hidden"
                                        />
                                        <label htmlFor={`${dayPlan.day}-${exercise.name}`} className="flex-1 cursor-pointer">
                                            <strong>{exercise.name}:</strong> {exercise.description}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 italic print:text-black">Rest day or light activity.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
            </div>
        </div>
        
         <div className="lg:col-span-2 print:col-span-7 print:break-before-page space-y-8">
            {/* STRETCHING PLAN */}
            <section className="print:break-inside-avoid">
              <div className="flex items-center gap-3 mb-4 print:hidden">
                <YogaIcon className="w-8 h-8 text-rose-400" />
                <h2 className="text-3xl font-bold text-gray-200">Stretches</h2>
              </div>
              <h2 className="hidden print:block text-2xl font-bold mb-4 text-black">Stretching Routine</h2>
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 sticky top-8 print:bg-white print:border print:border-gray-300 print:p-4 print:shadow-none print:sticky-0">
                <h3 className="text-xl font-semibold text-rose-400 mb-3 print:text-black">{plan.stretchingPlan.title}</h3>
                 <ul className="space-y-2 text-gray-300 print:text-black">
                    {plan.stretchingPlan.stretches.map(stretch => (
                        <li key={stretch.name}>
                            <strong>{stretch.name}:</strong> {stretch.description}
                        </li>
                    ))}
                </ul>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;