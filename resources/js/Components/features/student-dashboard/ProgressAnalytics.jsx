import React from 'react';

export default function ProgressAnalytics({ 
    materialsProgress = 85, 
    tasksProgress = 60, 
    examsProgress = 40,
    targetHistory = [40, 70, 90, 60, 80],
    comprehension = {
        strong: 45, // Secondary color
        good: 35,   // Primary color
        fair: 15,   // Tertiary color
        needsWork: 5 // Error color
    }
}) {
    return (
        <section className="flex flex-col gap-stack-md">
            <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-headline-md text-on-surface">Progress Analytics</h3>
                <select className="bg-surface-container border-none text-label-md rounded-lg py-1 pl-2 pr-8 focus:ring-primary cursor-pointer">
                    <option>All Subjects</option>
                    <option>Physics</option>
                    <option>Biology</option>
                </select>
            </div>
            
            {/* Bento Grid for Analytics */}
            <div className="grid grid-cols-2 gap-4">
                
                {/* Progress Rings */}
                <div className="col-span-2 bg-surface-container-low border border-outline-variant rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-around items-center">
                        {/* Materials Ring */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                    <circle className="stroke-secondary" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${materialsProgress}, 100`} strokeLinecap="round" strokeWidth="3"></circle>
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-label-sm font-bold">{materialsProgress}%</span>
                            </div>
                            <span className="text-label-sm text-on-surface-variant">Materials</span>
                        </div>
                        
                        {/* Tasks Ring */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                    <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${tasksProgress}, 100`} strokeLinecap="round" strokeWidth="3"></circle>
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-label-sm font-bold">{tasksProgress}%</span>
                            </div>
                            <span className="text-label-sm text-on-surface-variant">Tasks</span>
                        </div>
                        
                        {/* Exams Ring */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                    <circle className="stroke-tertiary-container" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${examsProgress}, 100`} strokeLinecap="round" strokeWidth="3"></circle>
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-label-sm font-bold">{examsProgress}%</span>
                            </div>
                            <span className="text-label-sm text-on-surface-variant">Exams</span>
                        </div>
                    </div>
                </div>
                
                {/* Bar Chart (Target Achievement) */}
                <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-label-sm font-bold mb-4">Target History</p>
                    <div className="flex items-end justify-between h-24 gap-2">
                        {targetHistory.map((height, idx) => (
                            <div 
                                key={idx} 
                                className={`w-full rounded-t-sm transition-all duration-1000 ${
                                    idx === targetHistory.length - Math.ceil(targetHistory.length/2) 
                                        ? 'bg-primary' 
                                        : 'bg-primary-container'
                                }`} 
                                style={{ height: `${height}%` }}
                            ></div>
                        ))}
                    </div>
                </div>
                
                {/* Comprehension Levels */}
                <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-label-sm font-bold mb-4">Comprehension</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                            <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${comprehension.strong}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${comprehension.good}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></div>
                            <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                <div className="bg-tertiary-fixed-dim h-full rounded-full transition-all duration-1000" style={{ width: `${comprehension.fair}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-error"></div>
                            <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                <div className="bg-error h-full rounded-full transition-all duration-1000" style={{ width: `${comprehension.needsWork}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    );
}
