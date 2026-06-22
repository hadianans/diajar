import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function TeacherFeedback({ feedback, isPending = false }) {
    if (!feedback && !isPending) return null;

    return (
        <section className="bg-surface-container-low rounded-xl p-5 border-l-4 border-secondary shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Teacher Feedback</h3>
                <span className="font-headline-md text-headline-md text-secondary">
                    {isPending ? 'Pending' : 'Received'}
                </span>
            </div>
            
            {feedback && (
                <div className="flex gap-3 items-start mt-2">
                    <Icon name="info" className="text-secondary" />
                    <p className="font-body-md text-body-md text-on-surface-variant italic">
                        "{feedback}"
                    </p>
                </div>
            )}
        </section>
    );
}
