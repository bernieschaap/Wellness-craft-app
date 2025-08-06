
import React, { useState } from 'react';
import type { Profile, WeightLog, MealLog, WorkoutLog, MeasurementLog } from '../../types';
import PlanDisplay from '../ResultCard';
import ProgressTracker from '../ProgressTracker';
import JournalScreen from './JournalScreen';
import ToolsScreen from './ToolsScreen';
import AICoachScreen from './AICoachScreen';
import ArrowLeftOnRectangleIcon from '../icons/ArrowLeftOnRectangleIcon';
import DumbbellIcon from '../icons/DumbbellIcon';
import ChartBarIcon from '../icons/ChartBarIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import ToolsIcon from '../icons/ToolsIcon';
import SparklesIcon from '../icons/SparklesIcon';


interface DashboardProps {
    profile: Profile;
    onSwitchProfile: () => void;
    onToggleExercise: (day: string, exerciseName: string, isCompleted: boolean) => void;
    onLogWeight: (log: WeightLog) => void;
    onLogMeal: (log: MealLog) => void;
    onLogWorkout: (log: WorkoutLog) => void;
    onLogMeasurements: (log: MeasurementLog) => void;
    onLogWater: (date: string, amount: number) => void;
    onSaveChatHistory: (userMessage: string, modelResponse: string) => void;
}

type Tab = 'plan' | 'journal' | 'progress' | 'tools' | 'coach';

const Dashboard: React.FC<DashboardProps> = (props) => {
    const { profile, onSwitchProfile, onToggleExercise, onLogWeight, onLogMeal, onLogWorkout, onLogMeasurements, onLogWater, onSaveChatHistory } = props;
    const [activeTab, setActiveTab] = useState<Tab>('plan');

    if (!profile.plan) {
        return <div className="text-center py-10">This profile doesn't have a plan yet.</div>
    }

    const tabClasses = (tabName: Tab) => 
        `flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tabName 
            ? 'bg-fuchsia-600 text-white' 
            : 'text-gray-300 hover:bg-gray-700'
        }`;

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full bg-gray-700 border-2 border-gray-600" />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-100">{profile.name}</h2>
                        <p className="text-gray-400">Welcome back! Here's your dashboard.</p>
                    </div>
                </div>
                <button type="button" onClick={onSwitchProfile} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Switch Profile
                </button>
            </header>
            
            <div className="border-b border-gray-700 mb-6 print:hidden">
                <nav className="flex items-center gap-1 p-1 bg-gray-800 rounded-lg w-full sm:w-auto max-w-lg mx-auto">
                    <button type="button" onClick={() => setActiveTab('plan')} className={tabClasses('plan')}>
                        <DumbbellIcon className="w-5 h-5" /> Your Plan
                    </button>
                    <button type="button" onClick={() => setActiveTab('coach')} className={tabClasses('coach')}>
                        <SparklesIcon className="w-5 h-5" /> AI Coach
                    </button>
                    <button type="button" onClick={() => setActiveTab('journal')} className={tabClasses('journal')}>
                        <BookOpenIcon className="w-5 h-5" /> Journal
                    </button>
                    <button type="button" onClick={() => setActiveTab('progress')} className={tabClasses('progress')}>
                        <ChartBarIcon className="w-5 h-5" /> Progress
                    </button>
                    <button type="button" onClick={() => setActiveTab('tools')} className={tabClasses('tools')}>
                        <ToolsIcon className="w-5 h-5" /> Tools
                    </button>
                </nav>
            </div>
            
            <div className="transition-all duration-300">
                {activeTab === 'plan' && <PlanDisplay plan={profile.plan} onToggleExercise={onToggleExercise} />}
                {activeTab === 'coach' && <AICoachScreen profile={profile} onSaveChatHistory={onSaveChatHistory} />}
                {activeTab === 'journal' && <JournalScreen profile={profile} onLogMeal={onLogMeal} onLogWorkout={onLogWorkout} />}
                {activeTab === 'progress' && <ProgressTracker progress={profile.progress} measurements={profile.measurements} onLogWeight={onLogWeight} onLogMeasurements={onLogMeasurements}/>}
                {activeTab === 'tools' && <ToolsScreen profile={profile} onLogWater={onLogWater} />}
            </div>

        </div>
    );
};

export default Dashboard;
