import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

const BLOOM_LEVELS = {
    0: 'Remember', 1: 'Understand', 2: 'Apply', 3: 'Analyze', 4: 'Evaluate', 5: 'Create',
};

export default function WizardStepReview({ onBack, selectedQuestions = [], formData = {}, onPublish, isSaving, errors = {} }) {
    const totalScore = selectedQuestions.reduce((sum, q) => sum + (q.score || 0), 0);

    return (
        <section className="space-y-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Step 3: Final Review</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">Check details before publishing to students.</p>
            </header>

            {/* Error display */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20">
                    <p className="font-label-md mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-label-sm space-y-1">
                        {Object.entries(errors).map(([key, msgs]) => (
                            <li key={key}>{Array.isArray(msgs) ? msgs[0] : msgs}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Final Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                <div className="md:col-span-2 space-y-stack-md">
                    {/* Assessment Info */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md">
                        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Assessment Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                <span className="text-on-surface-variant font-label-sm">Title</span>
                                <span className="font-label-md text-on-surface">{formData.title || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                <span className="text-on-surface-variant font-label-sm">Duration</span>
                                <span className="font-label-md text-on-surface">{formData.duration || '—'} min</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                <span className="text-on-surface-variant font-label-sm">Max Attempts</span>
                                <span className="font-label-md text-on-surface">{formData.max_attempts || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                <span className="text-on-surface-variant font-label-sm">Pass Threshold</span>
                                <span className="font-label-md text-on-surface">{formData.pass_threshold || '—'}%</span>
                            </div>
                            {formData.start_date && (
                                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                    <span className="text-on-surface-variant font-label-sm">Start Date</span>
                                    <span className="font-label-md text-on-surface">{new Date(formData.start_date).toLocaleString()}</span>
                                </div>
                            )}
                            {formData.due_date && (
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-on-surface-variant font-label-sm">Due Date</span>
                                    <span className="font-label-md text-on-surface">{new Date(formData.due_date).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md">
                        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Assessment Content</h3>
                        <div className="space-y-4">
                            {selectedQuestions.map((q, idx) => {
                                const plainText = (q.question || q.text || '').replace(/<[^>]+>/g, '');
                                return (
                                    <div key={q.id} className="flex gap-4 p-3 rounded-lg bg-surface-container-low group">
                                        <div className="flex flex-col items-center text-outline">
                                            <span className="text-label-sm font-bold mt-1">{idx + 1}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-body-md truncate">{plainText}</p>
                                            <span className="text-label-sm text-on-surface-variant">{BLOOM_LEVELS[q.levels] || `Level ${parseInt(q.levels) + 1}`}</span>
                                        </div>
                                        <span className="font-label-md text-primary shrink-0">{q.score || 0} pts</span>
                                    </div>
                                );
                            })}
                            {selectedQuestions.length === 0 && (
                                <p className="text-on-surface-variant text-label-md">No questions selected.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-stack-md">
                    {/* Score Summary Card */}
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
                            <p className="font-body-md font-bold">{formData.duration || '—'} Minutes</p>
                        </div>
                    </div>

                    {/* Config Card */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md space-y-stack-sm">
                        <h4 className="font-label-md text-on-surface">Configuration</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-on-surface-variant">
                                <Icon name="replay" className="text-[18px]" />
                                <span className="text-label-sm">Max Attempts</span>
                                <span className="ml-auto text-primary font-bold">{formData.max_attempts || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-on-surface-variant">
                                <Icon name="check_circle" className="text-[18px]" />
                                <span className="text-label-sm">Pass Threshold</span>
                                <span className="ml-auto text-primary font-bold">{formData.pass_threshold || '—'}%</span>
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
                    <button
                        onClick={() => onPublish?.()}
                        disabled={isSaving || selectedQuestions.length === 0}
                        className="flex-1 md:flex-none bg-primary text-on-primary px-10 py-3 rounded-lg font-label-md shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'Publishing...' : 'Publish Assessment'}
                    </button>
                </div>
            </div>
        </section>
    );
}
