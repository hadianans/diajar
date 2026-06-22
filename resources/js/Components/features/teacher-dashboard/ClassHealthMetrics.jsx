import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassHealthMetrics({ completion = 78, avgGrade = 82, avgScore = 75 }) {
    // Math for SVG circle: C = 2 * pi * r = 2 * 3.14159 * 34 = 213.6
    const circumference = 213.6;
    
    return (
        <div className="bg-white/80 backdrop-blur-[8px] border border-slate-200/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-2 text-on-surface">
                <Icon name="analytics" className="text-secondary" />
                Class Health Overview
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-surface-container-low">
                    <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-outline-variant/30" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="8"></circle>
                            <circle className="text-secondary transition-all duration-1000" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={circumference - (completion / 100) * circumference} strokeWidth="8" strokeLinecap="round"></circle>
                        </svg>
                        <span className="absolute font-bold text-lg">{completion}%</span>
                    </div>
                    <span className="font-label-md text-on-surface-variant">Material Completion</span>
                </div>
                
                {/* Metric 2 */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-surface-container-low">
                    <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-outline-variant/30" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="8"></circle>
                            <circle className="text-primary transition-all duration-1000" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={circumference - (avgGrade / 100) * circumference} strokeWidth="8" strokeLinecap="round"></circle>
                        </svg>
                        <span className="absolute font-bold text-lg">{avgGrade}%</span>
                    </div>
                    <span className="font-label-md text-on-surface-variant">Avg Assignment Grade</span>
                </div>
                
                {/* Metric 3 */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-surface-container-low">
                    <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-outline-variant/30" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="8"></circle>
                            <circle className="text-tertiary transition-all duration-1000" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={circumference - (avgScore / 100) * circumference} strokeWidth="8" strokeLinecap="round"></circle>
                        </svg>
                        <span className="absolute font-bold text-lg">{avgScore}%</span>
                    </div>
                    <span className="font-label-md text-on-surface-variant">Avg Assessment Score</span>
                </div>
            </div>
        </div>
    );
}
