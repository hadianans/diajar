import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function CompactClassCard({
    subject,
    teacher,
    group,
    icon = 'school',
    isWarning = false,
    warningMessage = 'Unassigned',
    onMoreClick
}) {
    // Theme bg & text mapping for class icons
    const iconColors = {
        science: 'bg-primary-container/20 text-primary',
        functions: 'bg-secondary-container/20 text-secondary',
        bolt: 'bg-tertiary-container/10 text-tertiary',
    };

    const colorClass = iconColors[icon] || 'bg-surface-container text-on-surface-variant';

    return (
        <div className="flex items-center gap-3 p-3 bg-surface-container-low border border-transparent rounded-lg hover:border-outline-variant transition-all">
            <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                <Icon name={icon} className="text-[20px]" />
            </div>
            
            <div className="flex-grow min-w-0">
                <h4 className="font-label-md text-label-md text-on-surface truncate font-semibold">
                    {subject}
                </h4>
                {isWarning ? (
                    <div className="flex items-center gap-1 text-error mt-0.5">
                        <Icon name="warning" className="text-[14px] flex-shrink-0" />
                        <p className="text-label-sm font-label-sm truncate">
                            {warningMessage}
                        </p>
                    </div>
                ) : (
                    <p className="text-label-sm font-label-sm text-on-surface-variant truncate mt-0.5">
                        {teacher} • {group}
                    </p>
                )}
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (onMoreClick) onMoreClick();
                }}
                className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center flex-shrink-0"
                type="button"
            >
                <Icon name="more_vert" className="text-outline text-[18px]" />
            </button>
        </div>
    );
}
