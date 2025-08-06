
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import ProfileSelectionScreen from './components/screens/ProfileSelectionScreen';
import Dashboard from './components/screens/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { generateWellnessPlan } from './services/geminiService';
import type { UserDetails, WellnessPlan, Profile, WeightLog, MealLog, WorkoutLog, MeasurementLog, WaterLog, ChatHistoryContent } from './types';

const App = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('wellnessCraftProfiles');
      if (savedProfiles) {
        const parsedProfiles: Profile[] = JSON.parse(savedProfiles);

        const hydratedProfiles = parsedProfiles.filter(Boolean).map(p => {
          const profileWithLogs = {
            ...p,
            measurements: p.measurements || [],
            mealLogs: p.mealLogs || [],
            workoutLogs: p.workoutLogs || [],
            waterLogs: p.waterLogs || [],
            chatHistory: p.chatHistory || [],
          };

          if (profileWithLogs.plan) {
            // CRITICAL FIX: Ensure exercise plan has the completedExercises property on old profiles
            if (profileWithLogs.plan.exercisePlan) {
              profileWithLogs.plan.exercisePlan = profileWithLogs.plan.exercisePlan.map(day => ({
                ...day,
                completedExercises: day.completedExercises || {},
              }));
            }
            // Add defaults for new plan properties if they don't exist
            if (!profileWithLogs.plan.dailyCalorieGoal) {
                profileWithLogs.plan.dailyCalorieGoal = 2000;
            }
            if (!profileWithLogs.plan.dailyWaterGoal) {
                profileWithLogs.plan.dailyWaterGoal = 2500;
            }
             if (!profileWithLogs.plan.stretchingPlan) {
                profileWithLogs.plan.stretchingPlan = { title: 'Daily Stretches', stretches: [] };
            }
          }


          return profileWithLogs;
        });
        
        setProfiles(hydratedProfiles);
      }
      const savedActiveId = localStorage.getItem('wellnessCraftActiveProfileId');
      if (savedActiveId) {
          setActiveProfileId(savedActiveId);
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
      localStorage.removeItem('wellnessCraftProfiles');
      localStorage.removeItem('wellnessCraftActiveProfileId');
    }
  }, []);

  useEffect(() => {
    try {
        if (profiles.length > 0) {
            localStorage.setItem('wellnessCraftProfiles', JSON.stringify(profiles));
        } else {
            // If profiles are empty (e.g., last one deleted), remove the key
            localStorage.removeItem('wellnessCraftProfiles');
        }
        if (activeProfileId) {
            localStorage.setItem('wellnessCraftActiveProfileId', activeProfileId);
        }
    } catch (e) {
        console.error("Failed to save data to localStorage", e);
    }
  }, [profiles, activeProfileId]);


  const handleCreateProfile = useCallback(async (name: string, details: UserDetails) => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateWellnessPlan(details);
      
      const planWithCompletion: WellnessPlan = {
          ...generatedPlan,
          exercisePlan: generatedPlan.exercisePlan.map(day => ({...day, completedExercises: {}}))
      };

      const newProfile: Profile = {
        id: uuidv4(),
        name,
        avatar: `https://api.dicebear.com/8.x/bottts/svg?seed=${name}`,
        userDetails: details,
        plan: planWithCompletion,
        progress: [{ date: new Date().toISOString().split('T')[0], weight: details.weight }],
        measurements: [],
        mealLogs: [],
        workoutLogs: [],
        waterLogs: [],
        chatHistory: [],
      };

      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      setActiveProfileId(newProfile.id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [profiles]);
  
  const handleDeleteProfile = (profileId: string) => {
      setProfiles(prevProfiles => prevProfiles.filter(p => p.id !== profileId));
      if (activeProfileId === profileId) {
          setActiveProfileId(null);
          localStorage.removeItem('wellnessCraftActiveProfileId');
      }
  };

  const handleSwitchProfile = () => {
      setActiveProfileId(null);
      localStorage.removeItem('wellnessCraftActiveProfileId');
  };
  
  const handleToggleExercise = (day: string, exerciseName: string, isCompleted: boolean) => {
    setProfiles(prevProfiles => prevProfiles.map(p => {
        if (p.id === activeProfileId && p.plan) {
            const updatedExercisePlan = p.plan.exercisePlan.map(d => {
                if (d.day === day) {
                    const updatedCompleted = {...d.completedExercises};
                    if (isCompleted) {
                        updatedCompleted[exerciseName] = true;
                    } else {
                        delete updatedCompleted[exerciseName];
                    }
                    return {...d, completedExercises: updatedCompleted};
                }
                return d;
            });
            return {...p, plan: {...p.plan, exercisePlan: updatedExercisePlan}};
        }
        return p;
    }));
  };

  const updateProfile = (updateFn: (profile: Profile) => Profile) => {
      setProfiles(prev => prev.map(p => p.id === activeProfileId ? updateFn(p) : p));
  };

  const handleLogWeight = (weightLog: WeightLog) => {
      updateProfile(p => ({
          ...p,
          progress: [...p.progress, weightLog].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }));
  };
  
  const handleLogMeasurements = (measurementLog: MeasurementLog) => {
      updateProfile(p => ({
          ...p,
          measurements: [...p.measurements, measurementLog].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }));
  };
  
  const handleLogMeal = (mealLog: MealLog) => {
      updateProfile(p => ({
          ...p,
          mealLogs: [...p.mealLogs, mealLog].sort((a,b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime())
      }));
  };
  
  const handleLogWorkout = (workoutLog: WorkoutLog) => {
       updateProfile(p => ({
          ...p,
          workoutLogs: [...p.workoutLogs, workoutLog].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }));
  };

  const handleLogWater = (date: string, amountToAdd: number) => {
    updateProfile(p => {
        const existingLogIndex = p.waterLogs.findIndex(log => log.date === date);
        let newWaterLogs = [...p.waterLogs];

        if (existingLogIndex > -1) {
            newWaterLogs[existingLogIndex] = {
                ...newWaterLogs[existingLogIndex],
                amount: newWaterLogs[existingLogIndex].amount + amountToAdd,
            };
        } else {
            newWaterLogs.push({ date, amount: amountToAdd });
        }
        return { ...p, waterLogs: newWaterLogs };
    });
  };
  
  const handleSaveChatHistory = (userMessage: string, modelResponse: string) => {
      const userContent: ChatHistoryContent = { role: 'user', parts: [{ text: userMessage }] };
      const modelContent: ChatHistoryContent = { role: 'model', parts: [{ text: modelResponse }] };

      updateProfile(p => ({
          ...p,
          chatHistory: [...p.chatHistory, userContent, modelContent]
      }));
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div className="min-h-screen bg-gray-900 bg-grid-gray-700/[0.2] text-white print:bg-white">
      <main className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="mt-10">
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="text-center py-10 px-4 max-w-2xl mx-auto bg-red-900/50 border border-red-700 rounded-lg print:hidden">
              <h3 className="text-2xl font-semibold text-red-300">An Error Occurred</h3>
              <p className="mt-2 text-red-400">{error}</p>
              <button type="button" onClick={() => setError(null)} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Try Again
              </button>
            </div>
          )}
          
          {!isLoading && !error && !activeProfile && (
            <ProfileSelectionScreen 
                profiles={profiles} 
                onSelectProfile={setActiveProfileId} 
                onCreateProfile={handleCreateProfile}
                onDeleteProfile={handleDeleteProfile}
            />
          )}

          {!isLoading && activeProfile && (
            <Dashboard 
                profile={activeProfile} 
                onSwitchProfile={handleSwitchProfile}
                onToggleExercise={handleToggleExercise}
                onLogWeight={handleLogWeight}
                onLogMeal={handleLogMeal}
                onLogWorkout={handleLogWorkout}
                onLogMeasurements={handleLogMeasurements}
                onLogWater={handleLogWater}
                onSaveChatHistory={handleSaveChatHistory}
            />
          )}

        </div>
      </main>

       <style>{`
        .bg-grid-gray-700\\[\\/0\\.2\\] {
            background-image: linear-gradient(to right, rgba(55, 65, 81, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(55, 65, 81, 0.4) 1px, transparent 1px);
            background-size: 2.5rem 2.5rem;
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            padding: 0;
            margin: 0;
            max-width: 100%;
          }
        }
       `}</style>
    </div>
  );
};

export default App;
