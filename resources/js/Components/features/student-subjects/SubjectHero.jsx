import React from 'react';

export default function SubjectHero({ title, description, progress = 0, lessonsCompleted = 0, totalLessons = 0 }) {
    return (
        <section className="mb-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest border border-outline-variant p-6 shadow-[0_4px_12px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)]">
                {/* Visual Accent */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-container opacity-20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col gap-2 mb-6">
                        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight">{title}</h2>
                        <p className="text-on-surface-variant font-body-md opacity-80">{description}</p>
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-end">
                            <span className="font-label-md text-label-md text-primary uppercase tracking-wider">Overall Progress</span>
                            <span className="font-headline-md text-headline-md text-on-surface">{progress}%</span>
                        </div>
                        <div className="w-full bg-outline-variant rounded-full h-2 overflow-hidden">
                            <div className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant italic">
                            {lessonsCompleted} of {totalLessons} lessons completed
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
