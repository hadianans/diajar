import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SubjectItem({ name, teachersCount, icon = 'biotech', warning, onClick }) {
    const isWarningState = warning || teachersCount === 0;

    const bgMap = {
        biotech: 'bg-tertiary-container/10 text-tertiary',
        calculate: 'bg-primary-container/10 text-primary',
        precision_manufacturing: 'bg-error-container/35 text-error',
        science: 'bg-secondary-container/20 text-secondary',
    };

    const iconColorClass = bgMap[icon] || 'bg-surface-container text-on-surface-variant';

    if (isWarningState) {
        return (
            <div
                onClick={onClick}
                className="flex flex-col p-3 rounded-xl bg-error-container/20 border border-error/15 cursor-pointer hover:bg-error-container/25 transition-all shadow-sm"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${iconColorClass} flex-shrink-0`}>
                            <Icon name={icon} />
                        </div>
                        <div>
                            <p className="font-label-md text-label-md text-on-surface font-bold">{name}</p>
                            <p className="text-label-sm font-label-sm text-error font-medium">{teachersCount} teachers</p>
                        </div>
                    </div>
                    <Icon name="warning" className="text-error flex-shrink-0" />
                </div>
                <div className="mt-2 text-[11px] font-bold text-error uppercase tracking-wider">
                    No teachers linked
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low cursor-pointer transition-all"
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${iconColorClass} flex-shrink-0`}>
                    <Icon name={icon} />
                </div>
                <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">{name}</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant font-medium">{teachersCount} teachers</p>
                </div>
            </div>
            <Icon name="chevron_right" className="text-outline-variant flex-shrink-0" />
        </div>
    );
}
