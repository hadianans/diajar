import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionOptionsBuilder({ options, onOptionChange, onMarkCorrect, onAddOption, onRemoveOption }) {
    // options: [{ id: 1, text: '...', isCorrect: false }, ...]
    return (
        <section className="space-y-stack-md">
            <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface-variant">Answer Options</label>
                <span className="text-label-sm font-label-sm text-outline">Select one correct answer</span>
            </div>
            <div className="space-y-stack-sm">
                {options.map((option, idx) => {
                    const isCorrect = option.isCorrect;
                    return (
                        <div 
                            key={option.id} 
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all shadow-sm ${
                                isCorrect 
                                ? 'bg-secondary-container/10 border-2 border-secondary' 
                                : 'bg-surface-container-lowest border border-outline-variant hover:border-primary/30'
                            }`}
                        >
                            <button 
                                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                    isCorrect 
                                    ? 'border-2 border-secondary bg-secondary' 
                                    : 'border-2 border-outline-variant hover:border-primary'
                                }`}
                                onClick={() => onMarkCorrect(option.id)}
                            >
                                {isCorrect && <Icon name="check" className="text-[16px] text-white font-bold" />}
                            </button>
                            <input 
                                className="flex-grow bg-transparent border-none focus:ring-0 font-body-md text-on-surface p-0" 
                                type="text" 
                                placeholder="Enter option content..."
                                value={option.text}
                                onChange={(e) => onOptionChange(option.id, e.target.value)}
                            />
                            <button 
                                onClick={() => onRemoveOption(option.id)}
                                className="p-2 text-on-surface-variant hover:text-error transition-colors"
                            >
                                <Icon name="delete" />
                            </button>
                        </div>
                    );
                })}
            </div>
            <button 
                onClick={onAddOption}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-outline-variant rounded-xl text-primary font-label-md hover:bg-primary-container/5 hover:border-primary/40 transition-all group"
            >
                <Icon name="add" />
                Add Option
            </button>
        </section>
    );
}
