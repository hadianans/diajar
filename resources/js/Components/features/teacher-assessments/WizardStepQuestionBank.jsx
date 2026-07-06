import React, { useState, useMemo } from 'react';
import Icon from '@/Components/shared/ui/Icon';

const BLOOM_LEVELS = {
    0: 'Remember',
    1: 'Understand',
    2: 'Apply',
    3: 'Analyze',
    4: 'Evaluate',
    5: 'Create',
};

const BLOOM_COLOR = {
    0: 'bg-secondary-container text-on-secondary-container',
    1: 'bg-orange-100 text-orange-800',
    2: 'bg-primary-container text-on-primary-container',
    3: 'bg-tertiary-container text-on-tertiary-container',
    4: 'bg-error-container text-on-error-container',
    5: 'bg-surface-container-highest text-on-surface',
};

export default function WizardStepQuestionBank({ onBack, onNext, questions = [], selectedIds = [], onToggleSelect, loading }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    const filters = ['all', ...Object.values(BLOOM_LEVELS)];

    const filteredQuestions = useMemo(() => {
        let result = questions;

        // Filter by bloom level
        if (activeFilter !== 'all') {
            result = result.filter(q => {
                const bloomName = BLOOM_LEVELS[q.levels] || '';
                return bloomName.toLowerCase() === activeFilter.toLowerCase();
            });
        }

        // Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(q => {
                const plainText = (q.question || '').replace(/<[^>]+>/g, '').toLowerCase();
                const tagNames = (q.tags || []).map(t => t.name).join(' ').toLowerCase();
                return plainText.includes(term) || tagNames.includes(term);
            });
        }

        return result;
    }, [questions, activeFilter, searchTerm]);

    return (
        <section className="space-y-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Step 2: Question Bank</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                        Filter and select questions for your assessment. 
                        <span className="text-primary font-label-md ml-1">{selectedIds.length} selected</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1 md:w-64">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                        <input 
                            className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-label-md focus:ring-2 focus:ring-primary" 
                            placeholder="Search questions..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                        {f === 'all' ? 'All Levels' : f}
                    </button>
                ))}
            </div>

            {/* Question List */}
            {loading ? (
                <div className="text-center py-12 text-on-surface-variant">Loading questions from your bank...</div>
            ) : (
                <div className="space-y-stack-md">
                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-12 text-on-surface-variant bg-surface-container rounded-2xl">
                            {questions.length === 0 
                                ? 'No questions in your bank yet. Create some first.' 
                                : 'No questions match your filter.'}
                        </div>
                    )}
                    {filteredQuestions.map((q) => {
                        const isSelected = selectedIds.includes(q.id);
                        const bloomLabel = BLOOM_LEVELS[q.levels] || `Level ${parseInt(q.levels) + 1}`;
                        const bloomColor = BLOOM_COLOR[q.levels] || BLOOM_COLOR[0];
                        const plainText = (q.question || '').replace(/<[^>]+>/g, '');

                        return (
                            <div 
                                key={q.id} 
                                className={`group bg-surface-container-lowest border rounded-xl p-stack-md transition-all cursor-pointer flex gap-stack-md ${
                                    isSelected ? 'border-2 border-primary shadow-sm' : 'border-outline-variant hover:border-primary'
                                }`}
                                onClick={() => onToggleSelect(q.id)}
                            >
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`px-2 py-0.5 rounded font-label-sm text-[10px] uppercase tracking-wider ${bloomColor}`}>
                                            {bloomLabel}
                                        </span>
                                        <span className="text-outline font-label-sm text-[12px]">ID: #{q.id}</span>
                                        {(q.tags || []).map(t => (
                                            <span key={t.id || t.name} className="bg-surface-container px-2 py-0.5 rounded font-label-sm text-[11px] text-on-surface-variant">
                                                {t.name}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface leading-relaxed line-clamp-2">
                                        {plainText}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1 font-label-sm text-on-surface-variant">
                                            <Icon name="grade" className="text-[16px]" /> {q.score || 0} Pts
                                        </span>
                                        {q.subject && (
                                            <span className="flex items-center gap-1 font-label-sm text-on-surface-variant">
                                                <Icon name="label" className="text-[16px]" /> {q.subject.subject_name}
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
            )}

            <div className="flex justify-between items-center py-stack-md">
                <button 
                    onClick={onBack}
                    className="text-primary font-label-md flex items-center gap-2 px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors"
                >
                    <Icon name="arrow_back" /> Back
                </button>
                <button 
                    onClick={onNext}
                    disabled={selectedIds.length === 0}
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md shadow-md hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    Review Selection <Icon name="visibility" />
                </button>
            </div>
        </section>
    );
}
