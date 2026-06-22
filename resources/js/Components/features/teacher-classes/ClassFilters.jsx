import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassFilters({ filters = ['All Cohorts', 'Batch 2023', 'Batch 2022', 'Batch 2021'], onSearch }) {
    const [activeFilter, setActiveFilter] = useState(filters[0]);

    return (
        <section className="space-y-stack-md">
            <div className="relative group">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                <input 
                    className="w-full h-12 pl-12 pr-12 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary transition-all text-body-md" 
                    placeholder="Search classes..." 
                    type="text"
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-primary hover:bg-primary-container/10 transition-colors">
                    <Icon name="filter_list" />
                </button>
            </div>
            
            {/* Swipeable Filter Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {filters.map((filter, idx) => {
                    const isActive = activeFilter === filter;
                    return (
                        <button 
                            key={idx}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-label-md font-label-md transition-all active:scale-95 ${
                                isActive 
                                    ? 'bg-primary text-on-primary shadow-sm' 
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                            }`}
                        >
                            {filter}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
