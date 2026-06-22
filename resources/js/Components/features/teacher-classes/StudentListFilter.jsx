import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function StudentListFilter({ groups = ['All', 'Group A', 'Group B', 'Group C', 'Group D'], onSearch }) {
    const [activeGroup, setActiveGroup] = useState(groups[0]);

    return (
        <section className="space-y-4 pb-4">
            {/* Group Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {groups.map((group, idx) => {
                    const isActive = activeGroup === group;
                    return (
                        <button 
                            key={idx}
                            onClick={() => setActiveGroup(group)}
                            className={`px-5 py-2 rounded-xl font-label-md transition-all active:scale-95 flex-shrink-0 ${
                                isActive 
                                    ? 'bg-primary text-on-primary' 
                                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                        >
                            {group}
                        </button>
                    );
                })}
            </div>
            
            {/* Search & Sort */}
            <div className="flex gap-3">
                <div className="relative flex-grow">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input 
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary font-body-md transition-all" 
                        placeholder="Search students..." 
                        type="text"
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </div>
                <button className="w-12 h-12 flex items-center justify-center bg-surface-container rounded-xl text-on-surface-variant active:scale-90 transition-transform hover:bg-surface-container-high">
                    <Icon name="filter_list" />
                </button>
            </div>
        </section>
    );
}
