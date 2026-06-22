import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentStatsGrid({ stats }) {
    return (
        <section className="grid grid-cols-2 gap-gutter">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-[12px] border border-slate-200/80 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-1 shadow-sm">
                    <Icon name={stat.icon} className="text-primary" />
                    <span className="font-label-md text-label-md text-on-surface">{stat.value}</span>
                    <span className="font-label-sm text-label-sm text-outline">{stat.label}</span>
                </div>
            ))}
        </section>
    );
}
