import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ChapterFilterBar({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (onSearch) onSearch(value);
    };

    return (
        <section className="mb-stack-lg flex justify-end">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon name="search" className="text-on-surface-variant" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search chapters by name or tags..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-3 pl-12 pr-4 text-body-md font-body-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-on-surface placeholder:text-on-surface-variant hover:border-primary/50 shadow-sm hover:shadow-md"
                />
            </div>
        </section>
    );
}
