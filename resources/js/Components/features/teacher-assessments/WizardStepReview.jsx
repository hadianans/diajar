import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function WizardStepReview({ onBack, selectedQuestions, totalScore, totalTime }) {
    return (
        <section className="space-y-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Step 3: Final Review</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">Check details before publishing to students.</p>
            </header>

            {/* Final Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                <div className="md:col-span-2 space-y-stack-md">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md">
                        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Assessment Content</h3>
                        <div className="space-y-4">
                            {selectedQuestions.map((q, idx) => (
                                <div key={idx} className="flex gap-4 p-3 rounded-lg bg-surface-container-low group">
                                    <div className="flex flex-col items-center text-outline">
                                        <Icon name="drag_indicator" className="cursor-grab" />
                                        <span className="text-label-sm font-bold mt-1">{idx + 1}</span>
                                    </div>
                                    <p className="text-body-md flex-1">{q.text}</p>
                                    <span className="font-label-md text-primary">{q.pts} pts</span>
                                </div>
                            ))}
                            {selectedQuestions.length === 0 && (
                                <p className="text-on-surface-variant text-label-md">No questions selected.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-stack-md">
                    <div className="bg-primary text-on-primary rounded-xl p-stack-md shadow-lg space-y-stack-sm">
                        <div className="flex justify-between items-center opacity-80">
                            <span className="font-label-sm">Total Questions</span>
                            <span className="font-headline-md">{selectedQuestions.length.toString().padStart(2, '0')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-label-sm opacity-80">Total Score</span>
                            <span className="font-headline-md">{totalScore} Pts</span>
                        </div>
                        <div className="pt-2 border-t border-white/20">
                            <p className="font-label-sm opacity-80">Est. Time</p>
                            <p className="font-body-md font-bold">{totalTime} Minutes</p>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md space-y-stack-sm">
                        <h4 className="font-label-md text-on-surface">Configuration</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-on-surface-variant">
                                <Icon name="lock_reset" className="text-[18px]" />
                                <span className="text-label-sm">Shuffle Questions</span>
                                <span className="ml-auto text-primary font-bold">ON</span>
                            </div>
                            <div className="flex items-center gap-2 text-on-surface-variant">
                                <Icon name="visibility_off" className="text-[18px]" />
                                <span className="text-label-sm">Hide results until end</span>
                                <span className="ml-auto text-primary font-bold">ON</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-stack-md">
                <button 
                    onClick={onBack}
                    className="w-full md:w-auto text-primary font-label-md flex items-center justify-center gap-2 px-6 py-3 hover:bg-primary/5 rounded-lg transition-colors"
                >
                    <Icon name="arrow_back" /> Edit Selection
                </button>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none border border-outline-variant text-on-surface-variant px-8 py-3 rounded-lg font-label-md hover:bg-surface-container transition-all">
                        Save Draft
                    </button>
                    <button className="flex-1 md:flex-none bg-primary text-on-primary px-10 py-3 rounded-lg font-label-md shadow-lg hover:opacity-90 transition-all active:scale-95">
                        Publish Assessment
                    </button>
                </div>
            </div>
        </section>
    );
}
