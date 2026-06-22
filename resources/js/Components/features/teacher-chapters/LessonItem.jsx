import React from 'react';
import { router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonItem({ chapterId, lessonId, title, type = 'text' }) {
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
            <div className="text-outline hover:text-on-surface cursor-grab active:cursor-grabbing p-1 -ml-1" onClick={(e) => e.stopPropagation()}>
                <Icon name="drag_indicator" />
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
