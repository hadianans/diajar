import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionMetadataPanel({ explanation, tags, usageCount }) {
    return (
        <section className="space-y-stack-md bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-[0_4px_12px_0_rgba(15,23,42,0.05)]">
            <div className="space-y-stack-sm">
                <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider">Student Explanation</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {explanation}
                </p>
            </div>
            <div className="pt-2 border-t border-outline-variant/30">
                <h3 className="font-label-md text-label-md text-on-surface mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="text-primary font-label-md text-label-md">#{tag}</span>
                    ))}
                </div>
            </div>
            <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant">
                    <Icon name="link" className="text-sm" />
                    <span className="font-label-sm text-label-sm">Used in {usageCount} Assessments</span>
                </div>
                <button className="text-primary font-label-md text-label-md hover:underline">View History</button>
            </div>
        </section>
    );
}
