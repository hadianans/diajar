import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function CollapsibleRubric({ criteria }) {
    // criteria = [{ title: 'Scientific Accuracy', description: 'Precision...', weight: 40, weightStr: '40%' }, ...]
    const [isOpen, setIsOpen] = useState(false);

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
                <div className="mt-stack-sm p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl space-y-stack-md animate-in fade-in slide-in-from-top-4 duration-300">
                    {criteria.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-label-md text-label-md text-on-surface">{item.title}</p>
                                    <p className="font-label-sm text-on-surface-variant">{item.description}</p>
                                </div>
                                <span className="font-label-md text-primary">{item.weightStr}</span>
                            </div>
                            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary rounded-full" 
                                    style={{ width: `${item.weight}%` }}
                                ></div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </section>
    );
}
