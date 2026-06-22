import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionSettingsBento({ score, tags, selectedBloom, onScoreChange, onBloomChange, explanation, onExplanationChange }) {
    
    const blooms = [
        { id: 0, name: 'Remember' },
        { id: 1, name: 'Understand' },
        { id: 2, name: 'Apply' },
        { id: 3, name: 'Analyze' },
        { id: 4, name: 'Evaluate' },
        { id: 5, name: 'Create' },
    ];

    return (
        <div className="space-y-stack-lg">
            {/* Score & Tags Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-stack-sm">Score per correct answer</label>
                    <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant focus-within:border-primary transition-all">
                        <Icon name="grade" className="text-outline" />
                        <input 
                            className="w-full bg-transparent border-none focus:ring-0 font-headline-md text-headline-md text-on-surface p-0" 
                            type="number" 
                            min="0" 
                            value={score}
                            onChange={(e) => onScoreChange && onScoreChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-stack-sm">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-high rounded-full font-label-sm text-on-surface-variant">
                                #{tag}
                                <button className="hover:text-error flex items-center justify-center"><Icon name="close" className="text-[14px]" /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 border-b border-outline-variant pb-1 focus-within:border-primary transition-all">
                        <Icon name="add" className="text-outline text-sm" />
                        <input 
                            className="bg-transparent border-none focus:ring-0 font-label-sm text-label-sm w-full p-0" 
                            placeholder="Add tag..." 
                            type="text" 
                        />
                    </div>
                </div>
            </div>

            {/* Bloom's Taxonomy Selector */}
            <section className="space-y-stack-sm">
                <label className="block font-label-md text-label-md text-on-surface-variant">Difficulty Level (Bloom's Taxonomy)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {blooms.map((bloom) => {
                        const isSelected = selectedBloom === bloom.id;
                        return (
                            <button 
                                key={bloom.id}
                                onClick={() => onBloomChange && onBloomChange(bloom.id)}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                                    isSelected 
                                    ? 'border-2 border-primary bg-primary-container/20' 
                                    : 'border-outline-variant bg-surface-container-lowest hover:border-primary/50'
                                }`}
                            >
                                <span className={`font-headline-md ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{bloom.id}</span>
                                <span className={`font-label-sm text-label-sm ${isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{bloom.name}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Explanation Section */}
            <section className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-stack-sm">Explanation (shown after answer)</label>
                <div className="flex items-start gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant focus-within:border-primary transition-all">
                    <Icon name="lightbulb" className="text-outline mt-1" />
                    <textarea 
                        className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 text-on-surface resize-none font-body-md text-body-md p-0" 
                        placeholder="Provide pedagogical feedback for the correct answer..."
                        value={explanation}
                        onChange={(e) => onExplanationChange && onExplanationChange(e.target.value)}
                    ></textarea>
                </div>
            </section>
        </div>
    );
}
