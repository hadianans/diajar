import React from 'react';

export default function AssignmentMetricsBento({ 
    submissions, 
    totalStudents, 
    pendingCount, 
    isUrgent, 
    gradedCount, 
    classAverage, 
    maxPts 
}) {
    return (
        <section className="grid grid-cols-2 gap-stack-md">
            <div className="p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Submissions</p>
                <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{submissions}</span>
                    <span className="font-body-md text-on-surface-variant">/ {totalStudents}</span>
                </div>
            </div>
            
            <div className="p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)] relative overflow-hidden">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Pending</p>
                <div className="flex items-center gap-2">
                    <span className={`font-headline-lg-mobile text-headline-lg-mobile ${pendingCount > 0 ? 'text-error' : 'text-on-surface'}`}>{pendingCount}</span>
                    {isUrgent && (
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold animate-pulse">URGENT</span>
                    )}
                </div>
            </div>
            
            <div className="p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Graded</p>
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{gradedCount}</span>
            </div>
            
            <div className="p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Class Avg</p>
                <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg-mobile text-headline-lg-mobile text-secondary">{classAverage}</span>
                    <span className="font-body-md text-on-surface-variant">/{maxPts}</span>
                </div>
            </div>
        </section>
    );
}
