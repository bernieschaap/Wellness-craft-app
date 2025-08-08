
import React, { useState } from 'react';
import type { WeightLog, MeasurementLog } from '../types.ts';
import ScaleIcon from './icons/ScaleIcon.tsx';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProgressTrackerProps {
    progress: WeightLog[];
    measurements: MeasurementLog[];
    onLogWeight: (log: WeightLog) => void;
    onLogMeasurements: (log: MeasurementLog) => void;
}


const WeightChart = ({ progress }: { progress: WeightLog[] }) => {
    // Chart expects data oldest to newest, but our logs are newest to oldest.
    const chartData = [...progress].reverse();

    const data = {
        labels: chartData.map(log => new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Weight',
                data: chartData.map(log => parseFloat(log.weight)),
                borderColor: 'rgb(217, 70, 239)',
                backgroundColor: (context: any) => {
                    if (!context.chart.chartArea) {
                        return;
                    }
                    const { ctx, chartArea: { top, bottom } } = context.chart;
                    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
                    gradient.addColorStop(0, 'rgba(217, 70, 239, 0.4)');
                    gradient.addColorStop(1, 'rgba(217, 70, 239, 0)');
                    return gradient;
                },
                tension: 0.3,
                fill: true,
                pointBackgroundColor: 'rgb(217, 70, 239)',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                pointHoverBorderWidth: 2,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1f2937',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 10,
                boxPadding: 4,
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${context.raw} kg`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#9ca3af', padding: 10 },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af', maxRotation: 0, minRotation: 0 },
            },
        },
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-rose-500 mb-4">
                Weight Progress
            </h3>
            <div className="relative h-72">
                 {progress.length > 1 ? (
                    <Line options={options} data={data} />
                 ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                        Log at least two weight entries to see your progress chart.
                    </div>
                 )}
            </div>
        </div>
    );
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, measurements, onLogWeight, onLogMeasurements }) => {
    const [weight, setWeight] = useState('');
    const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);
    const [weightError, setWeightError] = useState<string | null>(null);

    const initialMeasurementState = { chest: '', waist: '', hips: '', leftArm: '', rightArm: '', leftThigh: '', rightThigh: ''};
    const [currentMeasurements, setCurrentMeasurements] = useState(initialMeasurementState);
    const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split('T')[0]);
    const [measurementError, setMeasurementError] = useState<string | null>(null);


    const handleWeightSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!weight || !weightDate) {
            setWeightError('Please fill in both weight and date.');
            return;
        }
        setWeightError(null);
        onLogWeight({ date: weightDate, weight });
        setWeight('');
    };

    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentMeasurements(prev => ({...prev, [name]: value }));
    };

    const handleMeasurementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!measurementDate || !Object.values(currentMeasurements).some(v => v !== '')) {
            setMeasurementError('Please fill in the date and at least one measurement field.');
            return;
        }
        setMeasurementError(null);
        onLogMeasurements({
            id: new Date().toISOString(), // simple id
            date: measurementDate,
            measurements: currentMeasurements,
        });
        setCurrentMeasurements(initialMeasurementState);
    };
    
    const inputClasses = "w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
    const labelClasses = "block mb-2 text-sm font-medium text-gray-300";

    return (
        <div className="w-full max-w-6xl mx-auto my-8 animate-fade-in space-y-10">
            <WeightChart progress={progress} />

            {/* Log Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleWeightSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4" noValidate>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500 mb-2">Log Your Weight</h3>
                    <div>
                        <label htmlFor="weight-log" className={labelClasses}>Weight (kg)</label>
                        <input type="number" id="weight-log" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClasses} placeholder="e.g., 74.5" step="0.1" />
                    </div>
                    <div>
                        <label htmlFor="date-log" className={labelClasses}>Date</label>
                        <input type="date" id="date-log" value={weightDate} onChange={(e) => setWeightDate(e.target.value)} className={inputClasses} />
                    </div>
                    {weightError && <p className="text-red-400 text-sm">{weightError}</p>}
                    <button type="submit" className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700">
                        Log Weight
                    </button>
                </form>
                
                <form onSubmit={handleMeasurementSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4" noValidate>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-rose-500 mb-2">Log Measurements (cm)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label htmlFor="chest" className={labelClasses}>Chest</label><input type="number" name="chest" value={currentMeasurements.chest} onChange={handleMeasurementChange} className={inputClasses} step="0.1" /></div>
                        <div><label htmlFor="waist" className={labelClasses}>Waist</label><input type="number" name="waist" value={currentMeasurements.waist} onChange={handleMeasurementChange} className={inputClasses} step="0.1" /></div>
                        <div><label htmlFor="hips" className={labelClasses}>Hips</label><input type="number" name="hips" value={currentMeasurements.hips} onChange={handleMeasurementChange} className={inputClasses} step="0.1" /></div>
                        <div><label htmlFor="rightArm" className={labelClasses}>Right Arm</label><input type="number" name="rightArm" value={currentMeasurements.rightArm} onChange={handleMeasurementChange} className={inputClasses} step="0.1" /></div>
                        <div><label htmlFor="leftArm" className={labelClasses}>Left Arm</label><input type="number" name="leftArm" value={currentMeasurements.leftArm} onChange={handleMeasurementChange} className={inputClasses} step="0.1" /></div>
                        <div><label htmlFor="rightThigh" className={labelClasses}>Right Thigh</label><input type="number" name="rightThigh" value={currentMeasurements.rightThigh} onChange={handleMeasurementChange} className={inputClasses} step="0.1" /></div>
                        <div><label htmlFor="leftThigh" className={labelClasses}>Left Thigh</label><input type="number" name="leftThigh" value={currentMeasurements.leftThigh} onChange={handleMeasurementChange} className={inputClasses} step="0.1" /></div>
                    </div>
                    <label htmlFor="measurement-date" className={labelClasses}>Date</label>
                    <input type="date" id="measurement-date" value={measurementDate} onChange={(e) => setMeasurementDate(e.target.value)} className={inputClasses} />
                     {measurementError && <p className="text-red-400 text-sm">{measurementError}</p>}
                    <button type="submit" className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-fuchsia-500 to-rose-600 hover:from-fuchsia-600 hover:to-rose-700">
                        Log Measurements
                    </button>
                </form>
            </div>

            {/* History Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-gray-200 mb-4">Weight History</h3>
                    {progress.length > 0 ? (
                        <div className="overflow-auto max-h-96">
                            <table className="w-full text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Weight (kg)</th></tr></thead>
                                <tbody>{progress.map((log, index) => (<tr key={index} className="border-b border-gray-700"><td className="px-4 py-3 text-gray-300">{new Date(log.date).toLocaleDateString()}</td><td className="px-4 py-3 font-medium text-white">{log.weight}</td></tr>))}</tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-400 italic text-center py-8">No weight logged yet.</p>}
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-gray-200 mb-4">Measurement History</h3>
                    {measurements.length > 0 ? (
                        <div className="overflow-auto max-h-96">
                            <table className="w-full text-left table-auto">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0"><tr>
                                    <th className="px-2 py-3">Date</th>
                                    {Object.keys(measurements[0].measurements).map(key => <th key={key} className="px-2 py-3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</th>)}
                                </tr></thead>
                                <tbody>{measurements.map((log) => (<tr key={log.id} className="border-b border-gray-700">
                                    <td className="px-2 py-3 text-gray-300">{new Date(log.date).toLocaleDateString()}</td>
                                    {Object.keys(measurements[0].measurements).map(key => <td key={key} className="px-2 py-3 font-medium text-white">{log.measurements[key] || '-'}</td>)}
                                </tr>))}</tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-400 italic text-center py-8">No measurements logged yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ProgressTracker;