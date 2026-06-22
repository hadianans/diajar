import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonItem({
    id,
    subjectId,
    chapterId,
    title,
    type = 'Video', // 'Video', 'Reading', 'Interactive'
    duration = '0 mins',
    tag = 'Core',
    status = 'pending', // 'completed', 'pending'
}) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const isCompleted = status === 'completed';

    return (
        <Link 
            href={route('student.subjects.chapters.lessons.show', { subjectId: subjectId, chapterId: chapterId, lessonId: id })}
            className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                isCompleted ? 'bg-surface-container-high text-primary' : 'bg-surface-container-low text-outline-variant'
            }`}>
                <Icon name={isCompleted ? 'check_circle' : 'radio_button_unchecked'} />
            </div>
            
            <div className="flex-grow min-w-0">
                <h3 className="font-label-md text-label-md text-on-surface truncate">{title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{type} • {duration}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm">{tag}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-1">
                <button 
                    className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsBookmarked(!isBookmarked);
                    }}
                >
                    <Icon 
                        name={isBookmarked ? 'bookmark' : 'bookmark_border'} 
                        className="text-[20px]" 
                        style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                    />
                </button>
                <button 
                    className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log("Add to planner:", id);
                    }}
                >
                    <Icon name="add_circle" className="text-[20px]" />
                </button>
            </div>
        </Link>
    );
}
