import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import moment from 'moment';

export default function AssessmentCard({
    id,
    title,
    date,
    duration,
    questionsCount,
    status, // 'Upcoming', 'In Progress', 'Not Started', 'Graded'
    type, // 'Exam', 'Quiz', 'Practice'
    priority, // 'High Priority' etc.
    progress, // for 'In Progress'
    progressText, // e.g. "45% Completed • 9 questions left"
    hasPlan = false,
    onPlanClick,
    actionUrl // link for 'View Details' or 'Continue'
}) {
    const isInProgress = status === 'In Progress';
    const isGraded = status === 'Graded';

    const formattedDate = date ? moment(date).format('MMM D, YYYY • h:mm A') : 'No date set';
    const hasDuration = duration && duration !== 'N/A';

    let statusStyle = 'bg-surface-container-high text-on-surface-variant';
    if (status === 'Upcoming') {
        statusStyle = 'bg-tertiary-container text-on-tertiary-container';
    } else if (isInProgress) {
        statusStyle = 'bg-secondary-container text-on-secondary-container';
    } else if (isGraded) {
        statusStyle = 'bg-success-container text-on-success-container';
    }

    return (
        <article className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_12px_rgba(15,23,42,0.05)] border border-[#E2E8F0] hover:shadow-lg hover:border-transparent transition-all active:scale-[0.98] group flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                    <span className={`${statusStyle} px-3 py-1 rounded-full font-label-sm text-label-sm`}>
                        {status}
                    </span>
                    {onPlanClick && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                onPlanClick(id, title);
                            }}
                            className={`transition-colors rounded-full ${
                                hasPlan 
                                    ? 'text-secondary' 
                                    : 'text-outline hover:text-primary'
                            }`}
                            title={hasPlan ? "Edit Plan" : "Add to Plan"}
                        >
                            <Icon name={hasPlan ? 'edit_calendar' : 'add_circle'} className="text-[20px]" />
                        </button>
                    )}
                </div>
                
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mb-2 line-clamp-2">{title}</h3>
                
                <div className="grid grid-cols-1 gap-2.5 mb-4">
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">
                        <Icon name="event" className="text-[18px]" />
                        <span>Date: {formattedDate}</span>
                    </div>
                    {hasDuration && (
                        <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">
                            <Icon name="schedule" className="text-[18px]" />
                            <span>Duration: {duration}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">
                        <Icon name="quiz" className="text-[18px]" />
                        <span>Questions: {questionsCount} Qs</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">{type}</span>
                    {priority && (
                        <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm">{priority}</span>
                    )}
                </div>
            </div>

            <div>
                {/* Progress indicator for in-progress tests */}
                {isInProgress && progress !== undefined && (
                    <div className="mb-4">
                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        {progressText && <p className="text-label-sm text-on-surface-variant mt-2 font-medium">{progressText}</p>}
                    </div>
                )}
                
                <div className="flex gap-2">
                    <Link 
                        href={actionUrl || route('student.assessments.show', id)} 
                        className="flex-1 bg-primary text-center text-on-primary py-2.5 rounded-lg font-label-md hover:brightness-110 transition-all active:scale-95 shadow-sm block"
                    >
                        {isInProgress ? 'Continue Assessment' : 'View Details'}
                    </Link>
                </div>
            </div>
        </article>
    );
}
