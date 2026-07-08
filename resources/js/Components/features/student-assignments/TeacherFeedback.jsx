import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function TeacherFeedback({ feedback, grade, isPending = false }) {
    if (!feedback && !isPending && grade === undefined) return null;

    return (
        <section className="bg-surface-container border border-outline-variant rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center gap-2 mb-2 text-primary">
                <Icon name="verified" className="text-[22px]" />
                <h4 className="font-headline-md text-headline-md">Teacher's Evaluation</h4>
            </div>

            {isPending ? (
                <div className="flex items-center gap-2 text-on-surface-variant font-body-md bg-surface-container-high px-4 py-3 rounded-xl border border-outline-variant/30">
                    <Icon name="pending" />
                    <span>Your submission is currently waiting to be graded by the teacher.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {grade !== undefined && grade !== null && (
                        <div className="md:col-span-1 bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-1">Final Score</span>
                            <span className="font-display-sm text-display-sm text-primary font-bold">{grade}</span>
                        </div>
                    )}
                    
                    {feedback && (
                        <div className={`bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col ${grade !== undefined && grade !== null ? 'md:col-span-3' : 'md:col-span-4'}`}>
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Icon name="comment" className="text-[16px]" /> Feedback
                            </span>
                            <p className="font-body-md text-body-md text-on-surface italic text-on-surface-variant leading-relaxed">
                                "{feedback}"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
