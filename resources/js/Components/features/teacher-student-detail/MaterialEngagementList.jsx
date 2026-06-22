import React from 'react';

export default function MaterialEngagementList({ totalCompleted, totalItems, timeSpent, chapters = [] }) {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-[0_4px_12px_rgba(15,23,42,0.05)] h-full">
            <div className="flex justify-between items-center mb-stack-md">
                <h3 className="font-headline-md text-headline-md text-on-surface">Material Engagement</h3>
                <div className="text-right">
                    <p className="font-label-md text-label-md text-primary">{totalCompleted}/{totalItems} Completed</p>
                    <p className="font-label-sm text-label-sm text-outline">{timeSpent} hrs spent</p>
                </div>
            </div>
            
            <div className="space-y-stack-sm">
                {chapters.map((chapter, idx) => {
                    let colorClass = 'bg-secondary';
                    let bgClass = 'bg-surface-container';
                    
                    if (chapter.progress < 100 && chapter.progress > 50) {
                        colorClass = 'bg-primary-container';
                    } else if (chapter.progress <= 50) {
                        colorClass = 'bg-primary-fixed-dim';
                    }

                    return (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between font-label-md text-label-md">
                                <span className="text-on-surface">{chapter.title}</span>
                                <span className={chapter.progress === 100 ? 'text-secondary' : 'text-on-surface-variant'}>{chapter.progress}%</span>
                            </div>
                            <div className={`w-full h-2 ${bgClass} rounded-full overflow-hidden`}>
                                <div className={`h-full ${colorClass}`} style={{ width: `${chapter.progress}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
