import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function UpcomingDeadlines({ deadlines = [] }) {
    return (
        <div className="bg-white/80 backdrop-blur-[8px] border border-slate-200/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-2">
                <Icon name="alarm" className="text-error" />
                Deadlines
            </h3>
            
            <div className="space-y-4">
                {deadlines.map((deadline, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-3 border border-outline-variant rounded-xl border-l-4 ${deadline.isUrgent ? 'border-l-error' : 'border-l-primary'} hover:bg-surface-container-low transition-colors cursor-pointer`}>
                        <div className="flex-1">
                            <p className="font-bold text-on-surface">{deadline.title}</p>
                            <p className="text-sm text-on-surface-variant">{deadline.date}</p>
                        </div>
                        <Icon name="chevron_right" className="text-outline-variant" />
                    </div>
                ))}
            </div>
        </div>
    );
}
