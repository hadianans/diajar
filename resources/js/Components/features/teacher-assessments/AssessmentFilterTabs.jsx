import React from 'react';

export default function AssessmentFilterTabs({ activeTab = 'all', onTabChange, counts = {} }) {
    const tabs = [
        { key: 'all', name: 'All', count: counts.all ?? null },
        { key: 'scheduled', name: 'Scheduled', count: counts.scheduled ?? null },
        { key: 'active', name: 'Active', count: counts.active ?? null },
        { key: 'completed', name: 'Completed', count: counts.completed ?? null },
    ];

    return (
        <div className="flex items-center gap-6 border-b border-outline-variant/30 mb-stack-md overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
                <button 
                    key={tab.key}
                    onClick={() => onTabChange?.(tab.key)}
                    className={`pb-3 px-1 border-b-2 font-label-md text-label-md whitespace-nowrap flex items-center gap-2 transition-colors ${
                        activeTab === tab.key 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-on-surface-variant hover:text-primary'
                    }`}
                >
                    {tab.name}
                    {tab.count != null && tab.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            activeTab === tab.key 
                                ? 'bg-primary-container text-on-primary-container' 
                                : 'bg-surface-container-highest text-on-surface-variant'
                        }`}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
