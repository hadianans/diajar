import React from 'react';

export default function AssignmentRubric({ rubrics = [] }) {
    if (!rubrics || rubrics.length === 0) return null;

    return (
        <section className="space-y-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">Assessment Rubric</h3>
            <div className="space-y-stack-sm">
                {rubrics.map((rubric, idx) => (
                    <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface">{rubric.title}</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">{rubric.description}</span>
                        </div>
                        <span className="font-headline-md text-headline-md text-primary">{rubric.weight}%</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
