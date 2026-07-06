import React from 'react';

export default function AssignmentFilterTabs({ activeFilter = 'all', onFilterChange, counts = {} }) {
    const tabs = [
        { name: 'All', value: 'all', badge: counts.all || null, badgeColor: 'bg-surface-container-high text-on-surface' },
        { name: 'Needs Grading', value: 'needs_grading', badge: counts.needsGrading || null, badgeColor: 'bg-error text-on-error' },
        { name: 'Graded', value: 'graded', badge: counts.graded || null, badgeColor: 'bg-secondary-container text-on-secondary-container' },
        { name: 'Closed', value: 'closed', badge: counts.closed || null, badgeColor: 'bg-surface-container-high text-on-surface-variant' },
    ];

    return (
        <nav className="flex w-full border-b border-outline-variant overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
                <button 
                    key={tab.value}
                    onClick={() => onFilterChange?.(tab.value)}
                    className={`px-4 py-3 font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                        activeFilter === tab.value 
                            ? 'text-primary border-b-2 border-primary' 
                            : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                    {tab.name}
                    {tab.badge != null && tab.badge > 0 && (
                        <span className={`${tab.badgeColor} text-[10px] px-1.5 py-0.5 rounded-full font-bold`}>
                            {tab.badge}
                        </span>
                    )}
                </button>
            ))}
        </nav>
    );
}
