import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentFilters({ filters = ['All Subjects', 'In Progress', 'Upcoming', 'Graded'], onSearch }) {
    const [activeFilter, setActiveFilter] = useState(filters[0]);

    return (
        <section className="space-y-stack-md mb-stack-lg">
            <div className="relative group">
                <Icon 
                    name="search" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" 
                />
                <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline transition-all" 
                    placeholder="Search assessments or subjects..." 
                    type="text"
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                />
            </div>
            
            <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
                {filters.map((filter, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setActiveFilter(filter)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-label-md transition-all active:scale-95 ${
                            activeFilter === filter 
                                ? 'bg-primary text-on-primary' 
                                : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </section>
    );
}
