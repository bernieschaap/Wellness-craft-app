
import React from 'react';
import type { WaterLog } from '@/types.ts';
import WaterDropIcon from '@/components/icons/WaterDropIcon.tsx';

interface WaterTrackerProps {
    waterLogs: WaterLog[];
    onLogWater: (date: string, amount: number) => void;
    goal: number;
}

const CircularProgress = ({ percentage, centerText }: { percentage: number, centerText: string }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-cyan-400"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.35s' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{centerText.split(' ')[0]}</span>
                <span className="text-sm text-gray-400">{`/ ${centerText.split(' ')[1]} ml`}</span>
            </div>
        </div>
    );
};


const WaterTracker: React.FC<WaterTrackerProps> = ({ waterLogs, onLogWater, goal }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysLog = waterLogs.find(log => log.date === todayStr);
    const currentIntake = todaysLog ? todaysLog.amount : 0;
    const percentage = goal > 0 ? Math.min((currentIntake / goal) * 100, 100) : 0;

    const handleAddWater = (amount: number) => {
        onLogWater(todayStr, amount);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <WaterDropIcon className="w-7 h-7 text-cyan-400" />
                    <h3 className="text-xl font-bold text-gray-200">Daily Water Intake</h3>
                </div>
                <p className="text-gray-400">Goal: <span className="font-bold text-white">{goal} ml</span></p>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center gap-6 py-4">
                <CircularProgress percentage={percentage} centerText={`${currentIntake} ${goal}`} />
                <div className="flex justify-center gap-4 w-full">
                    <button type="button" onClick={() => handleAddWater(250)} className="flex-1 text-white font-bold py-3 px-4 rounded-lg transition-colors bg-cyan-600/80 hover:bg-cyan-600">
                        +250 ml
                    </button>
                    <button type="button" onClick={() => handleAddWater(500)} className="flex-1 text-white font-bold py-3 px-4 rounded-lg transition-colors bg-cyan-700/80 hover:bg-cyan-700">
                        +500 ml
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WaterTracker;