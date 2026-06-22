import React, { useState } from 'react';

export default function AssignmentFilterTabs() {
    const [activeTab, setActiveTab] = useState('Needs Grading');
    
    const tabs = [
        { name: 'All', badge: null },
        { name: 'Needs Grading', badge: 12, badgeColor: 'bg-error text-on-error' },
        { name: 'Graded', badge: null },
        { name: 'Closed', badge: null },
    ];

    return (
        <nav className="flex w-full border-b border-outline-variant overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
                <button 
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`px-4 py-3 font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                        activeTab === tab.name 
                            ? 'text-primary border-b-2 border-primary' 
                            : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                    {tab.name}
                    {tab.badge && (
                        <span className={`${tab.badgeColor} text-[10px] px-1.5 py-0.5 rounded-full font-bold`}>
                            {tab.badge}
                        </span>
                    )}
                </button>
            ))}
        </nav>
    );
}
