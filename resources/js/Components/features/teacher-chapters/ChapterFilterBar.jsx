import React, { useState } from 'react';

export default function ChapterFilterBar({ filters = ['Class Average', 'Group A', 'Group B', 'Practical Lab', 'Advanced Theory'], onFilterChange }) {
    const [activeFilter, setActiveFilter] = useState(filters[0]);

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        if (onFilterChange) onFilterChange(filter);
    };

    return (
        <section className="mb-stack-lg overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-2 pb-2">
                {filters.map((filter, idx) => {
                    const isActive = activeFilter === filter;
                    return (
                        <button 
                            key={idx}
                            onClick={() => handleFilterClick(filter)}
                            className={`px-6 py-2 rounded-full font-label-md whitespace-nowrap transition-all ${
                                isActive 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
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
