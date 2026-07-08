import React from 'react';

export default function AssignmentRubric({ rubrics = [] }) {
    if (!rubrics || rubrics.length === 0) return null;

    return (
        <section className="space-y-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">Assessment Rubric</h3>
            <div className="space-y-stack-sm">
                {rubrics.map((rubric, idx) => (
                    <div key={idx} className={`bg-surface-container-lowest border ${rubric.score !== undefined ? 'border-primary/50' : 'border-outline-variant'} rounded-xl p-4 flex flex-col gap-4 transition-colors`}>
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col pr-4">
                                <span className="font-label-md text-label-md text-on-surface">{rubric.title}</span>
                                {rubric.description && (
                                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 leading-relaxed">{rubric.description}</span>
                                )}
                            </div>
                            <div className="flex flex-col items-end shrink-0 pl-4 border-l border-outline-variant/30">
                                {rubric.score !== undefined ? (
                                    <div className="flex items-baseline gap-1 text-primary">
                                        <span className="font-headline-md text-headline-md font-bold">{rubric.score}</span>
                                        <span className="font-label-sm text-label-sm opacity-70">/ {rubric.weight}</span>
                                    </div>
                                ) : (
                                    <span className="font-headline-md text-headline-md text-on-surface-variant font-medium">{rubric.weight}</span>
                                )}
                                <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline whitespace-nowrap mt-0.5">
                                    {rubric.score !== undefined ? 'Achieved' : 'Max Weight'}
                                </span>
                            </div>
                        </div>

                        {rubric.levels && rubric.levels.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-outline-variant/40">
                                {rubric.levels.map((level, lIdx) => (
                                    <div key={lIdx} className="p-3 bg-surface rounded-lg border border-outline-variant/30">
                                        <div className="flex justify-between items-start gap-2 mb-1.5">
                                            <span className="font-label-md text-on-surface">{level.label}</span>
                                            <span className="font-label-sm text-primary font-medium shrink-0 bg-primary/5 px-2 py-0.5 rounded-full">{level.score} pts</span>
                                        </div>
                                        {level.description && (
                                            <p className="font-body-sm text-on-surface-variant leading-relaxed">
                                                {level.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
