import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SubjectHero({ title, description, progress = 0, lessonsCompleted = 0, totalLessons = 0 }) {
    return (
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-8 shadow-sm">
                {/* Visual Accent Glow */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm font-label-sm">
                            <Icon name="school" className="text-[16px]" />
                            <span>Mata Pelajaran</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface leading-tight font-bold">
                            {title}
                        </h1>
                        <p className="text-on-surface-variant font-body-md max-w-2xl leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Progress Card */}
                    <div className="w-full md:w-80 bg-surface-container-low/70 border border-outline-variant/30 rounded-2xl p-5 shrink-0 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                                Progres Keseluruhan
                            </span>
                            <span className="font-headline-sm text-headline-sm text-primary font-bold">
                                {progress}%
                            </span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        {totalLessons > 0 && (
                            <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                                <Icon name="task_alt" className="text-[16px] text-primary" />
                                <span>{lessonsCompleted} dari {totalLessons} materi selesai</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
