import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssignmentFilters({ filters = ['All Subjects', 'In Progress', 'Urgent', 'Completed'], onSearch }) {
    const [activeFilter, setActiveFilter] = useState(filters[0]);

    return (
        <>
            {/* Search Bar */}
            <section className="mb-6">
                <div className="relative flex items-center">
                    <Icon name="search" className="absolute left-4 text-outline" />
                    <input 
                        className="w-full bg-[#F1F5F9] border-none rounded-xl py-3.5 pl-12 pr-4 font-body-md text-body-md focus:ring-2 focus:ring-primary transition-all outline-none" 
                        placeholder="Search tasks or subjects..." 
                        type="text"
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </div>
            </section>
            
            {/* Pill Filters */}
            <section className="mb-8 overflow-x-auto hide-scrollbar flex gap-2 -mx-margin-mobile px-margin-mobile" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {filters.map((filter, idx) => {
                    const isActive = activeFilter === filter;
                    return (
                        <button 
                            key={idx}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                                isActive 
                                    ? 'bg-primary text-on-primary shadow-md' 
                                    : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                            }`}
                        >
                            {filter}
                        </button>
                    );
                })}
            </section>
        </>
    );
}
