import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassSummaryItem({ label, value, icon }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                <Icon name={icon} className="text-[20px]" />
            </div>
            <div className="min-w-0">
                <p className="text-on-surface-variant font-label-sm text-label-sm">
                    {label}
                </p>
                <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                    {value}
                </p>
            </div>
        </div>
    );
}
