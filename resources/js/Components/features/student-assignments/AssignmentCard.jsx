import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import moment from 'moment';

export default function AssignmentCard({
    id,
    title,
    dueDate,
    typeTags = [], // e.g. [{ label: 'Lab', type: 'primary' }, { label: 'To-do', type: 'default' }]
    status, // 'Urgent', 'In Progress', 'To-do'
    progress, // e.g. 33 (percentage)
    hasPlan = false,
    onPlanClick
}) {
    let statusStyle = 'bg-surface-container-high text-on-surface-variant';
    if (status === 'Urgent') {
        statusStyle = 'bg-error-container text-on-error-container';
    } else if (status === 'In Progress') {
        statusStyle = 'bg-secondary-container text-on-secondary-container';
    } else if (status === 'Completed' || status === 'Submitted' || status === 'Graded') {
        statusStyle = 'bg-success-container text-on-success-container';
    }

    const formattedDate = dueDate ? moment(dueDate).format('MMM D, YYYY • h:mm A') : 'No due date';
    const dueDateIcon = 'calendar_today';
    const dueDateColor = status === 'Urgent' ? 'text-error font-medium' : 'text-on-surface-variant';

    return (
        <article className="bg-surface-container-lowest rounded-xl p-5 border border-[#E2E8F0] shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-all active:scale-[0.98] flex flex-col justify-between h-full">
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
                
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2 line-clamp-2">{title}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                    <div className={`font-body-md text-body-md ${dueDateColor} flex items-center gap-1.5`}>
                        <Icon name={dueDateIcon} className="text-[18px]" />
                        <span>Due: {formattedDate}</span>
                    </div>
                </div>
                
                {typeTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {typeTags.map((tag, idx) => (
                            <span 
                                key={idx} 
                                className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${
                                    tag.type === 'primary' 
                                    ? 'bg-surface-container text-primary' 
                                    : 'bg-surface-container-high text-on-surface-variant'
                                }`}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            
            <div>
                {/* Simple progress bar if provided */}
                {progress !== undefined && progress > 0 && (
                    <div className="mb-4">
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <Link 
                        href={route('student.assignments.show', id)}
                        className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-3 rounded-full active:scale-[0.98] transition-all text-center block hover:bg-primary/90 shadow-sm"
                    >
                        View Assignment
                    </Link>
                </div>
            </div>
        </article>
    );
}
