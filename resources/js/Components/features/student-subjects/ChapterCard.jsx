import React from 'react';
import { Link } from '@inertiajs/react';
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
            className={`group relative rounded-xl p-5 transition-all duration-200 ${
                isLocked 
                    ? 'bg-surface-container/30 border border-outline-variant border-dashed opacity-80 cursor-not-allowed' 
                    : isInProgress 
                        ? 'bg-surface-container-lowest border border-primary/30 shadow-[0_4px_12px_-2px_rgba(15,23,42,0.05)] ring-1 ring-primary/5 active:scale-[0.98] cursor-pointer'
                        : 'bg-surface-container-lowest border border-outline-variant shadow-[0_4px_12px_-2px_rgba(15,23,42,0.05)] active:scale-[0.98] cursor-pointer'
            }`}
        >
            {/* Background decoration for in-progress */}
            {isInProgress && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden rounded-tr-xl">
                    <div className="absolute top-0 right-0 w-full h-full bg-primary/5 -rotate-45 translate-x-8 -translate-y-8"></div>
                </div>
            )}

            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                    <span className={`font-label-sm text-label-sm uppercase font-bold ${
                        isLocked ? 'text-on-surface-variant' : isCompleted ? 'text-secondary' : 'text-primary'
                    }`}>
                        Chapter {chapterNumber}
                    </span>
                    <h4 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                        {title}
                        {isLocked && <Icon name="lock" className="text-[20px] text-outline" />}
                    </h4>
                </div>

                {/* Status Badges */}
                {isCompleted && (
                    <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Icon name="check_circle" className="text-[16px] material-symbols-fill" />
                        <span className="font-label-sm text-label-sm">Done</span>
                    </div>
                )}
                {isInProgress && (
                    <div className="text-primary font-label-md text-label-md">{progress}%</div>
                )}
            </div>

            <p className={`font-body-md mb-4 ${isCompleted ? 'line-clamp-2' : ''} text-on-surface-variant`}>
                {description}
            </p>

            {/* Tags */}
            {!isLocked && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, i) => (
                        <span key={i} className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${
                            isInProgress ? 'bg-primary/10 text-primary-fixed-variant' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Progress Bar for in-progress */}
            {isInProgress && (
                <div className="mb-4">
                    <div className="w-full bg-outline-variant/30 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}

            <div className={`pt-4 border-t flex justify-between items-center text-on-surface-variant ${
                isLocked ? 'border-outline-variant/50' : 'border-outline-variant'
            }`}>
                <div className="flex gap-4">
                    {lessonsCount > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Icon name="menu_book" className="text-[18px]" />
                            <span className="font-label-sm text-label-sm">{lessonsCount} Lessons</span>
                        </div>
                    )}
                    {videosCount > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Icon name="play_circle" className="text-[18px]" />
                            <span className="font-label-sm text-label-sm">{videosCount} Videos</span>
                        </div>
                    )}
                    {textsCount > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Icon name="description" className="text-[18px]" />
                            <span className="font-label-sm text-label-sm">{textsCount} Texts</span>
                        </div>
                    )}
                </div>

                {isCompleted && (
                    <Icon name="chevron_right" className="text-primary group-hover:translate-x-1 transition-transform" />
                )}
                {isInProgress && (
                    <button className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform" onClick={(e) => { e.preventDefault(); console.log("Resume chapter", id); }}>
                        Resume
                    </button>
                )}
                {isLocked && (
                    <span className="font-label-sm text-label-sm italic text-outline">Upcoming</span>
                )}
            </div>
        </CardContainer>
    );
}
