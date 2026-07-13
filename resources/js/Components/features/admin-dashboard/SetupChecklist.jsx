import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SetupChecklist({ items = [] }) {
    const completedCount = items.filter(item => item.completed).length;
    const totalCount = items.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Setup Completeness</h3>
                    <p className="text-on-surface-variant font-body-md text-body-md">
                        {completedCount} of {totalCount} setup steps complete
                    </p>
                </div>
                <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            className="text-outline-variant"
                            cx="24"
                            cy="24"
                            fill="transparent"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <circle
                            className="text-secondary transition-all duration-500 ease-out"
                            cx="24"
                            cy="24"
                            fill="transparent"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-on-surface">
                        {percentage}%
                    </span>
                </div>
            </div>
            <div className="divide-y divide-outline-variant">
                {items.map((item, idx) => {
                    const isCompleted = item.completed;
                    return (
                        <div
                            key={idx}
                            className={`flex items-center justify-between p-5 hover:bg-surface-container-lowest transition-colors ${
                                !isCompleted ? 'bg-tertiary-container/5 hover:bg-tertiary-container/10' : ''
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        isCompleted
                                            ? 'bg-secondary-container text-on-secondary-container'
                                            : 'bg-tertiary text-on-tertiary'
                                    }`}
                                >
                                    <Icon
                                        name={isCompleted ? 'check' : 'priority_high'}
                                        className="text-[18px]"
                                    />
                                </div>
                                <span className="font-body-md text-body-md font-medium text-on-surface">
                                    {item.label}
                                </span>
                            </div>
                            {!isCompleted && item.action && (
                                <button
                                    onClick={item.action.onClick}
                                    className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg shadow-sm active:scale-[0.97] transition-all flex-shrink-0"
                                    type="button"
                                >
                                    {item.action.label}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
