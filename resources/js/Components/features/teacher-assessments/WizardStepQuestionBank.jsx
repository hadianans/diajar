import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function WizardStepQuestionBank({ onBack, onNext, questions, selectedIds, onToggleSelect }) {
    const [activeFilter, setActiveFilter] = useState('All Levels');
    
    const filters = ['All Levels', 'Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate'];

    return (
        <section className="space-y-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Step 2: Question Bank</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">Filter and select questions for your assessment.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-surface-container-lowest border border-outline-variant p-2 rounded-lg flex items-center justify-center hover:bg-surface-container-low transition-colors">
                        <Icon name="tune" />
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                        <input 
                            className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-label-md focus:ring-2 focus:ring-primary" 
                            placeholder="Search questions..." 
                            type="text" 
                        />
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-stack-sm overflow-x-auto pb-2 no-scrollbar">
                {filters.map((f) => (
                    <button 
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full font-label-sm transition-colors ${
                            activeFilter === f 
                            ? 'bg-on-background text-white' 
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Question List */}
            <div className="space-y-stack-md">
                {questions.map((q) => {
                    const isSelected = selectedIds.includes(q.id);
                    return (
                        <div 
                            key={q.id} 
                            className={`group bg-surface-container-lowest border rounded-xl p-stack-md transition-all cursor-pointer flex gap-stack-md ${
                                isSelected ? 'border-2 border-primary shadow-sm' : 'border-outline-variant hover:border-primary'
                            }`}
                            onClick={() => onToggleSelect(q.id)}
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded font-label-sm text-[10px] uppercase tracking-wider ${q.levelColorClass}`}>
                                        {q.level}
                                    </span>
                                    <span className="text-outline font-label-sm text-[12px]">ID: #{q.id}</span>
                                </div>
                                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                                    {q.text}
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 font-label-sm text-on-surface-variant">
                                        <Icon name="grade" className="text-[16px]" /> {q.pts} Pts
                                    </span>
                                    {q.category && (
                                        <span className="flex items-center gap-1 font-label-sm text-on-surface-variant">
                                            <Icon name="label" className="text-[16px]" /> {q.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 px-2">
                                <button 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        isSelected 
                                        ? 'bg-primary' 
                                        : 'border-2 border-outline-variant group-hover:border-primary'
                                    }`}
                                    onClick={(e) => { e.stopPropagation(); onToggleSelect(q.id); }}
                                >
                                    <Icon name={isSelected ? "check" : "add"} className={isSelected ? "text-on-primary" : "text-outline group-hover:text-primary"} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center py-stack-md">
                <button 
                    onClick={onBack}
                    className="text-primary font-label-md flex items-center gap-2 px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors"
                >
                    <Icon name="arrow_back" /> Back
                </button>
                <button 
                    onClick={onNext}
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                >
                    Review Selection <Icon name="visibility" />
                </button>
            </div>
        </section>
    );
}
