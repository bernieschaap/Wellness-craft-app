
import React from 'react';
import type { Profile } from '../../types.ts';
import WaterTracker from '../WaterTracker.tsx';
import RecipeGenerator from '../RecipeGenerator.tsx';
import ShoppingListGenerator from '../ShoppingListGenerator.tsx';

interface ToolsScreenProps {
    profile: Profile;
    onLogWater: (date: string, amount: number) => void;
}

const ToolsScreen: React.FC<ToolsScreenProps> = ({ profile, onLogWater }) => {
    // The dashboard ensures profile.plan is not null here
    if (!profile.plan) return null;

    return (
        <div className="w-full max-w-7xl mx-auto my-8 animate-fade-in space-y-8">
            <ShoppingListGenerator mealPlan={profile.plan.mealPlan} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <WaterTracker
                    waterLogs={profile.waterLogs}
                    onLogWater={onLogWater}
                    goal={profile.plan.dailyWaterGoal || 2500}
                />
                <RecipeGenerator />
            </div>
        </div>
    );
};

export default ToolsScreen;