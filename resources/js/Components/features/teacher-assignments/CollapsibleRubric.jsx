import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function CollapsibleRubric({ criteria }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <section>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-stack-md bg-surface-container-low rounded-xl border border-outline-variant transition-colors hover:bg-surface-container"
            >
                <div className="flex items-center gap-3">
                    <Icon name="fact_check" className="text-primary text-[24px]" />
                    <span className="font-headline-md text-headline-md text-on-surface">Grading Rubric</span>
                </div>
                <Icon 
                    name="expand_more" 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            
            {isOpen && (
                <div className="mt-stack-sm p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    {criteria.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-3 p-4 bg-surface rounded-xl border border-outline-variant/60 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="pr-4">
                                    <h4 className="font-label-lg text-label-lg text-on-surface">{item.title}</h4>
                                    {item.description && (
                                        <p className="font-body-md text-on-surface-variant mt-1.5 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full font-label-sm whitespace-nowrap shrink-0">
                                    Weight: {item.weight}
                                </div>
                            </div>
                            
                            {item.levels && item.levels.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                                    {item.levels.map((level, lIdx) => (
                                        <div key={lIdx} className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40 hover:border-primary/30 transition-colors">
                                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                                <span className="font-label-md text-on-surface">{level.label}</span>
                                                <span className="font-label-sm text-primary font-medium shrink-0 bg-primary/5 px-2 py-0.5 rounded-full">{level.score} pts</span>
                                            </div>
                                            {level.description && (
                                                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                                                    {level.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
