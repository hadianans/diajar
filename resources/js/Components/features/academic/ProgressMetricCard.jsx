import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ProgressMetricCard({ label, value, icon, bgClass = 'bg-primary-container/10', textClass = 'text-primary' }) {
    return (
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className={`p-3 rounded-full flex items-center justify-center flex-shrink-0 ${bgClass} ${textClass}`}>
                <Icon name={icon} />
            </div>
            <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant font-medium">{label}</p>
                <p className="font-headline-md text-headline-md text-on-surface font-bold">{value}</p>
            </div>
        </div>
    );
}
