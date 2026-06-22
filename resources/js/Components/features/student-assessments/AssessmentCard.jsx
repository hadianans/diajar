import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentCard({
    id,
    subject,
    title,
    date,
    duration,
    questionsCount,
    status, // 'Upcoming', 'In Progress', 'Not Started', 'Graded'
    type, // 'Exam', 'Quiz', 'Practice'
    priority, // 'High Priority' etc.
    progress, // for 'In Progress'
    progressText, // e.g. "45% Completed • 9 questions left"
    onAction, // Used for 'Add to Plan' bookmark click
    actionUrl // link for 'View Details' or 'Continue'
}) {
    const isUpcoming = status === 'Upcoming';
    const isInProgress = status === 'In Progress';
    const isNotStarted = status === 'Not Started';

    return (
        <article className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant hover:shadow-lg hover:border-transparent transition-all group">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                    <div className="mt-1">
                        <input className="w-5 h-5 rounded border-outline text-primary focus:ring-primary/30 cursor-pointer" type="checkbox" />
                    </div>
                    <div>
                        <span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">{subject}</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">{title}</h3>
                    </div>
                </div>
                <button 
                    className="w-10 h-10 flex items-center justify-center rounded-full text-outline hover:bg-surface-container hover:text-primary transition-all active:scale-90" 
                    title="Add to Plan"
                    onClick={(e) => {
                        e.preventDefault();
                        if (onAction) onAction();
                    }}
                >
                    <Icon name="bookmark_add" />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4 px-9">
                <div className="flex items-center gap-2 text-on-surface-variant">
                    <Icon name="event" className="text-sm" />
                    <span className="text-label-sm">{date}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                    <Icon name="schedule" className="text-sm" />
                    <span className="text-label-sm">{duration}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                    <Icon name="quiz" className="text-sm" />
                    <span className="text-label-sm">{questionsCount} Questions</span>
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isUpcoming ? 'bg-tertiary' : isInProgress ? 'bg-secondary' : 'bg-outline'}`}></span>
                    <span className={`text-label-sm font-semibold ${isUpcoming ? 'text-tertiary' : isInProgress ? 'text-secondary' : 'text-outline'}`}>
                        {status}
                    </span>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6 px-9">
                <span className="px-3 py-1 rounded-full bg-surface-variant text-primary text-label-sm font-medium">{type}</span>
                {priority && (
                    <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-label-sm font-medium">{priority}</span>
                )}
            </div>
            
            {/* Progress indicator for in-progress tests */}
            {isInProgress && progress !== undefined && (
                <div className="mb-6 px-9">
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-label-sm text-on-surface-variant mt-2">{progressText}</p>
                </div>
            )}
            
            <div className="flex gap-2">
                <Link 
                    href={actionUrl || route('student.assessments.show', id)} 
                    className="flex-1 bg-primary text-center text-on-primary py-3 px-4 rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-[0.98] shadow-md block"
                >
                    {isInProgress ? 'Continue' : 'View Details'}
                </Link>
            </div>
        </article>
    );
}
