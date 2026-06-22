import React from 'react';

export default function GradeTrendChart({ dataPoints = [] }) {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <div className="flex justify-between items-center mb-stack-md">
                <h3 className="font-headline-md text-headline-md text-on-surface">Grade Progression</h3>
                <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    <span>Recent Tasks</span>
                </div>
            </div>
            
            <div className="relative h-48 w-full flex items-end justify-between gap-1 mt-8">
                {/* Simple CSS Data Visualization */}
                {dataPoints.map((point, idx) => {
                    const isLast = idx === dataPoints.length - 1;
                    return (
                        <div 
                            key={idx}
                            className={`flex-1 rounded-t-lg transition-all ${isLast ? 'bg-primary hover:brightness-110' : 'bg-primary-fixed-dim hover:bg-primary'}`} 
                            style={{ height: `${point.value}%` }}
                            title={`${point.value}%`}
                        ></div>
                    );
                })}
                
                {/* Labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-label-sm font-label-sm text-outline px-2">
                    {dataPoints.map((point, idx) => (
                        <span key={idx}>{point.label}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
