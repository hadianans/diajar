import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionPreviewCard({ questionText, options }) {
    return (
        <section className="space-y-stack-md">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0_4px_12px_0_rgba(15,23,42,0.05)]">
                <div className="mb-stack-lg">
                    <p className="text-on-surface font-headline-md text-headline-md leading-relaxed">
                        {questionText}
                    </p>
                </div>
                
                {/* Answer Options */}
                <div className="space-y-3">
                    {options.map((option, idx) => {
                        const letter = String.fromCharCode(65 + idx);
                        if (option.isCorrect) {
                            return (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border-2 border-secondary bg-secondary-container/10 cursor-default relative overflow-hidden transition-all duration-200">
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
                                        <Icon name="check_circle" filled />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-label-md font-bold shrink-0">{letter}</div>
                                    <p className="font-body-md text-body-md text-on-secondary-container font-semibold pr-8">{option.text}</p>
                                </div>
                            );
                        }
                        return (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container-low cursor-default transition-all duration-200">
                                <div className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-label-md font-bold text-on-surface-variant shrink-0">{letter}</div>
                                <p className="font-body-md text-body-md text-on-surface-variant">{option.text}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
