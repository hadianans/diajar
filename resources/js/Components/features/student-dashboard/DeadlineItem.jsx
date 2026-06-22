import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function DeadlineItem({
    title,
    type = 'Assignment',
    dueDate,
    icon = 'event_upcoming',
    badgeBgClass = 'bg-error-container text-on-error-container',
    onClick
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl active:bg-surface-container-low hover:bg-surface-container-low transition-all text-left group w-full cursor-pointer hover:shadow-sm"
            type="button"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${badgeBgClass}`}>
                    <Icon name={icon} className="text-[20px]" />
                </div>
                <div className="min-w-0">
                    <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {title}
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant truncate mt-0.5">
                        {type} • {dueDate}
                    </p>
                </div>
            </div>
            <Icon
                name="chevron_right"
                className="text-outline group-hover:translate-x-1 transition-transform text-[20px] flex-shrink-0"
            />
        </button>
    );
}
