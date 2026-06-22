import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentReflection({ goals, onSelect }) {
    const [selectedGoal, setSelectedGoal] = useState(null);

    const handleSelect = (goalIdx) => {
        setSelectedGoal(goalIdx);
        if (onSelect) onSelect(goals[goalIdx]);
    };

    return (
        <section className="bg-surface-container p-6 rounded-xl space-y-stack-md">
            <div className="flex items-center gap-2">
                <Icon name="psychology" className="text-tertiary" />
                <h3 className="font-headline-md text-headline-md text-on-surface">Pre-Assessment Reflection</h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">Take a moment to set your focus. What is your goal for this assessment?</p>
            
            <div className="space-y-3">
                {goals.map((goal, idx) => {
                    const isSelected = selectedGoal === idx;
                    return (
                        <label 
                            key={idx} 
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer active:scale-[0.98] transition-all ${
                                isSelected ? 'bg-primary-fixed/20 border-primary' : 'bg-surface border-outline-variant'
                            }`}
                            onClick={() => handleSelect(idx)}
                        >
                            <input 
                                className="w-5 h-5 text-primary border-outline focus:ring-primary" 
                                name="goal" 
                                type="radio" 
                                checked={isSelected}
                                readOnly
                            />
                            <span className="font-label-md text-label-md">{goal.label}</span>
                        </label>
                    );
                })}
            </div>
        </section>
    );
}
