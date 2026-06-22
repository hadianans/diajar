import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionFilters() {
    return (
        <div className="flex flex-col gap-6 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant mb-stack-lg">
            {/* Search Bar */}
            <div className="relative w-full">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                <input 
                    className="w-full pl-12 pr-4 py-3 bg-surface rounded-2xl border-none focus:ring-2 focus:ring-primary text-body-md transition-all shadow-inner" 
                    placeholder="Search questions..." 
                    type="text"
                />
            </div>

            {/* Difficulty Filters */}
            <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Cognitive Level (Bloom's)</span>
                <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 rounded-full text-label-sm border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors">Remember</button>
                    <button className="px-4 py-2 rounded-full text-label-sm border-2 border-primary bg-primary-container text-on-primary-container font-bold">Understand</button>
                    <button className="px-4 py-2 rounded-full text-label-sm border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors">Apply</button>
                    <button className="px-4 py-2 rounded-full text-label-sm border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors">Analyze</button>
                    <button className="px-4 py-2 rounded-full text-label-sm border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors">Evaluate</button>
                    <button className="px-4 py-2 rounded-full text-label-sm border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors">Create</button>
                </div>
            </div>

            {/* Tag Chips */}
            <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Tags</span>
                <div className="flex flex-wrap gap-2">
                    {['Genetics', 'Cell Biology', 'Lab Skills', 'Mitosis', 'Evolution'].map((tag) => (
                        <button key={tag} className="px-3 py-1.5 rounded-lg text-label-sm bg-surface-container-highest text-primary hover:bg-primary-container hover:text-white transition-all flex items-center gap-2">
                            <Icon name="label" className="text-sm" />
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
