import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssignmentCard({
    id,
    subject,
    subjectIcon,
    title,
    dueDate,
    typeTags, // e.g. [{ label: 'Lab', type: 'primary' }, { label: 'To-do', type: 'default' }]
    status, // 'Urgent', 'In Progress', 'To-do'
    progress, // e.g. 33 (percentage)
    onAddToList
}) {
    const [isChecked, setIsChecked] = useState(false);

    let statusStyle = 'bg-surface-container-high text-on-surface-variant';
    if (status === 'Urgent') {
        statusStyle = 'bg-error-container text-on-error-container';
    } else if (status === 'In Progress') {
        statusStyle = 'bg-secondary-container text-on-secondary-container';
    }

    const dueDateIcon = status === 'Urgent' ? 'event_upcoming' : (status === 'In Progress' ? 'schedule' : 'calendar_today');
    const dueDateColor = status === 'Urgent' ? 'text-error' : 'text-on-surface-variant';

    return (
        <article 
            className="bg-surface-container-lowest rounded-xl p-5 border border-[#E2E8F0] shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-all active:scale-[0.98]"
            style={{ opacity: isChecked ? 0.6 : 1 }}
        >
            <div className="flex items-start gap-4">
                <div className="pt-1">
                    <input 
                        className="w-6 h-6 rounded border-outline text-primary focus:ring-primary cursor-pointer transition-all" 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <span className="flex items-center gap-1.5 text-secondary font-label-md text-label-md">
                            <Icon name={subjectIcon} className="text-[18px]" />
                            {subject}
                        </span>
                        <span className={`${statusStyle} px-2.5 py-0.5 rounded-full font-label-sm text-label-sm`}>
                            {status}
                        </span>
                    </div>
                    
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h3>
                    
                    <p className={`font-body-md text-body-md ${dueDateColor} flex items-center gap-1 mb-3`}>
                        <Icon name={dueDateIcon} className="text-[18px]" />
                        {dueDate}
                    </p>
                    
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
                    
                    <div className="flex gap-3">
                        <Link 
                            href={route('student.assignments.show', id)}
                            className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-lg active:scale-95 transition-all text-center block"
                        >
                            View Details
                        </Link>
                        <button 
                            onClick={onAddToList}
                            className="px-4 border border-outline-variant text-on-surface-variant font-label-md text-label-md py-2.5 rounded-lg hover:bg-surface-container-low transition-all active:scale-95"
                            title="Add to List"
                        >
                            <Icon name="playlist_add" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Simple progress bar if provided */}
            {progress !== undefined && (
                <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </article>
    );
}
