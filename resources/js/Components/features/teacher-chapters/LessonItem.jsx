import React from 'react';
import { router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonItem({ chapterId, lessonId, title, type = 'text', onMoveUp, onMoveDown }) {
    const isVideo = type === 'video';
    const iconName = isVideo ? 'play_circle' : 'description';
    const iconColor = isVideo ? 'text-error' : 'text-secondary';

    const handleClick = () => {
        router.visit(route('teacher.chapters.lessons.show', { chapterId, lessonId }));
    };

    return (
        <div 
            onClick={handleClick}
            className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 group hover:border-primary hover:shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-all cursor-pointer"
        >
            <div className="flex flex-col items-center border border-outline-variant/30 rounded mr-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <button onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }} disabled={!onMoveUp} className="hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:hover:bg-transparent">
                    <Icon name="keyboard_arrow_up" className="text-[14px]" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }} disabled={!onMoveDown} className="hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:hover:bg-transparent">
                    <Icon name="keyboard_arrow_down" className="text-[14px]" />
                </button>
            </div>
            <Icon name={iconName} className={iconColor} />
            <span className="flex-grow font-body-md text-body-md text-on-surface truncate">{title}</span>
            <button 
                className="p-1 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant -mr-1"
                onClick={(e) => { e.stopPropagation(); }}
            >
                <Icon name="more_vert" />
            </button>
        </div>
    );
}
