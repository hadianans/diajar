import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionCard({ question, options, isMarkedForReview, onToggleReview }) {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-lg md:p-10 shadow-sm transition-all">
            <div className="flex justify-between items-start mb-stack-md">
                <h2 className="text-headline-md font-headline-md text-on-surface pr-4">{question}</h2>
                <button 
                    onClick={onToggleReview}
                    className={`flex items-center gap-1 text-label-md font-label-md transition-colors flex-shrink-0 ${isMarkedForReview ? 'text-tertiary' : 'text-on-surface-variant hover:text-primary'}`}
                >
                    <Icon name="flag" className="text-[18px]" style={isMarkedForReview ? { fontVariationSettings: "'FILL' 1" } : {}} />
                    Mark for Review
                </button>
            </div>
            
            <div className="mt-stack-lg space-y-4">
                {options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const letter = String.fromCharCode(65 + idx); // A, B, C, D...
                    
                    return (
                        <button 
                            key={idx}
                            onClick={() => setSelectedOption(idx)}
                            className={`w-full text-left p-5 rounded-lg transition-all active:scale-[0.98] flex items-center gap-4 group ${
                                isSelected 
                                ? 'border-2 border-primary bg-surface-container-low shadow-sm' 
                                : 'border border-outline-variant bg-surface hover:bg-surface-container-low'
                            }`}
                        >
                            <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-label-md font-bold ${
                                isSelected 
                                ? 'bg-primary text-white' 
                                : 'border border-outline group-hover:border-primary group-hover:text-primary'
                            }`}>
                                {letter}
                            </span>
                            <span className={`text-body-md font-body-md text-on-surface ${isSelected ? 'font-semibold' : ''}`}>
                                {opt.text}
                            </span>
                            
                            {isSelected && (
                                <Icon name="check_circle" className="ml-auto text-primary" style={{ fontVariationSettings: "'FILL' 1" }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
