import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import { getFileDetails } from '@/utils/getFileDetails';

export default function LessonItem({
    id,
    subjectId,
    chapterId,
    title,
    type = 'Video', // 'Video', 'Reading', 'Interactive'
    fileUrl = '',
    duration = '0 mins',
    tag = 'Core',
    status = 'pending', // 'completed', 'pending'
    isBookmarked: initialBookmarked = false,
    hasPlan = false,
    onPlanClick,
}) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const isCompleted = status === 'completed';
    const fileDetails = getFileDetails(fileUrl, type);

    return (
        <Link 
            href={route('student.subjects.chapters.lessons.show', { subjectId: subjectId, chapterId: chapterId, lessonId: id })}
            className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                isCompleted 
                    ? 'bg-surface-container-high text-primary' 
                    : `${fileDetails.bgClass} ${fileDetails.textClass}`
            }`}>
                <Icon name={isCompleted ? 'check_circle' : fileDetails.icon} />
            </div>
            
            <div className="flex-grow min-w-0">
                <h3 className="font-label-md text-label-md text-on-surface truncate">{title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {type}
                        {duration && duration !== 'N/A' && duration !== '0 mins' && ` • ${duration}`}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm">{tag}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-1">
                <button 
                    className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors"
                    onClick={async (e) => {
                        e.preventDefault();
                        try {
                            await api.post('/bookmarks/toggle', { bookmarkable_id: id, bookmarkable_type: 'App\\Models\\Material' });
                            setIsBookmarked(!isBookmarked);
                        } catch (error) {
                            console.error('Failed to toggle bookmark', error);
                        }
                    }}
                >
                    <Icon 
                        name={isBookmarked ? 'bookmark' : 'bookmark_border'} 
                        className="text-[20px]" 
                        style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                    />
                </button>
                <button 
                    className={`p-2 rounded-full transition-colors ${
                        hasPlan 
                            ? 'text-secondary hover:bg-secondary-container/20' 
                            : 'text-primary hover:bg-primary-container/10'
                    }`}
                    title={hasPlan ? "Edit Plan" : "Add to Plan"}
                    onClick={(e) => {
                        e.preventDefault();
                        if (onPlanClick) {
                            onPlanClick(id, title);
                        }
                    }}
                >
                    <Icon name={hasPlan ? 'edit_calendar' : 'add_circle'} className="text-[20px]" />
                </button>
            </div>
        </Link>
    );
}
