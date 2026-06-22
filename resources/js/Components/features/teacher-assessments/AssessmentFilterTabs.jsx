import React, { useState } from 'react';

export default function AssessmentFilterTabs() {
    const [activeTab, setActiveTab] = useState('Active');
    
    const tabs = [
        { name: 'All', badge: null },
        { name: 'Scheduled', badge: null },
        { name: 'Active', badge: 2, badgeColor: 'bg-primary-container text-white' },
        { name: 'Completed', badge: null },
    ];

    return (
        <div className="flex items-center gap-6 border-b border-outline-variant/30 mb-stack-md overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
                <button 
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`pb-3 px-1 border-b-2 font-label-md text-label-md whitespace-nowrap flex items-center gap-2 transition-colors ${
                        activeTab === tab.name 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-on-surface-variant hover:text-primary'
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
        </div>
    );
}
