import React from 'react';
import { Link, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function ChapterCard({ 
    id,
    subjectId,
    chapterNumber, 
    title, 
    description, 
    tags = [], 
    status = 'in_progress', // 'completed', 'in_progress', 'locked'
    progress = 0,
    lessonsCount = 0,
    videosCount = 0,
    textsCount = 0
}) {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';
    const isInProgress = status === 'in_progress';

    const CardContainer = isLocked ? 'div' : Link;
    const cardProps = isLocked ? {} : { href: route('student.subjects.chapters.show', { subjectId: subjectId, chapterId: id }) };

    return (
        <CardContainer 
            {...cardProps}
            className={`group relative rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full transition-all duration-300 ${
                isLocked 
                    ? 'bg-surface-container-low/40 border border-outline-variant/30 border-dashed opacity-75 cursor-not-allowed' 
                    : isInProgress 
                        ? 'bg-surface-container-lowest border border-primary/30 shadow-sm hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer'
                        : 'bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer'
            }`}
        >
            <div>
                {/* Header Badge & Status */}
                <div className="flex justify-between items-center gap-2 mb-3">
                    <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                        Bab {chapterNumber}
                    </span>

                    {/* Status Badges */}
                    {isCompleted && (
                        <span className="bg-secondary-container/80 text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1">
                            <Icon name="check_circle" className="text-[14px]" />
                            <span>Selesai</span>
                        </span>
                    )}
                    {isInProgress && (
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-label-sm font-bold">
                            {progress}%
                        </span>
                    )}
                    {isLocked && (
                        <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1">
                            <Icon name="lock" className="text-[14px]" />
                            <span>Terkunci</span>
                        </span>
                    )}
                </div>

                {/* Title & Description */}
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-2">
                    {title}
                </h3>

                {description && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Tags */}
                {!isLocked && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {tags.map((tag, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded-md text-label-sm font-label-sm bg-surface-container text-on-surface-variant">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4 border-t border-outline-variant/30 mt-auto">
                {/* Progress Bar if in-progress */}
                {isInProgress && (
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                {/* Breakdown and CTA */}
                <div className="flex items-center justify-between gap-2 text-on-surface-variant">
                    <div className="flex items-center gap-3 text-label-sm font-label-sm text-on-surface-variant">
                        {lessonsCount > 0 && (
                            <span className="flex items-center gap-1">
                                <Icon name="menu_book" className="text-[16px] text-outline" />
                                <span>{lessonsCount} Materi</span>
                            </span>
                        )}
                        {videosCount > 0 && (
                            <span className="flex items-center gap-1">
                                <Icon name="play_circle" className="text-[16px] text-outline" />
                                <span>{videosCount} Video</span>
                            </span>
                        )}
                        {textsCount > 0 && (
                            <span className="flex items-center gap-1">
                                <Icon name="description" className="text-[16px] text-outline" />
                                <span>{textsCount} Bacaan</span>
                            </span>
                        )}
                    </div>

                    <div className="shrink-0">
                        {isInProgress && (
                            <span className="inline-flex items-center gap-1 text-primary font-label-md text-label-md group-hover:translate-x-0.5 transition-transform">
                                <span>Lanjutkan</span>
                                <Icon name="arrow_forward" className="text-[16px]" />
                            </span>
                        )}
                        {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-on-surface-variant group-hover:text-primary font-label-md text-label-md transition-colors">
                                <span>Tinjau</span>
                                <Icon name="chevron_right" className="text-[18px]" />
                            </span>
                        )}
                        {isLocked && (
                            <span className="font-label-sm text-label-sm text-outline italic">Terkunci</span>
                        )}
                    </div>
                </div>
            </div>
        </CardContainer>
    );
}
