import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function HardestQuestionsList({ questions }) {
    // questions: [{ id: 12, text: '...', difficulty: 'Hard', difficultyColorClass: 'text-error bg-error-container/20', avatarColorClass: 'bg-error-container text-on-error-container', correctPercentage: 42 }, ...]
    return (
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline-md text-headline-md">Hardest Questions</h3>
                <span className="text-on-surface-variant font-label-sm text-label-sm underline cursor-pointer">View All</span>
            </div>
            
            <div className="space-y-stack-md">
                {questions.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${q.avatarColorClass}`}>
                            {q.id}
                        </div>
                        <div className="flex-grow">
                            <p className="font-body-md text-body-md text-on-surface line-clamp-1">{q.text}</p>
                            <div className="flex gap-2 mt-1">
                                <span className={`${q.difficultyColorClass} font-label-sm text-label-sm px-2 py-0.5 rounded`}>
                                    {q.difficulty}
                                </span>
                                <span className="text-on-surface-variant font-label-sm text-label-sm">{q.correctPercentage}% Correct</span>
                            </div>
                        </div>
                        <Icon name="chevron_right" className="text-outline-variant group-hover:text-primary transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
}
