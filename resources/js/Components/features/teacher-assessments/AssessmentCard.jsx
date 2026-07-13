import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentCard({
    id,
    title,
    chapter,
    state, // 'completed', 'pending', 'active', 'scheduled'
    classAvg,
    participationCompleted,
    participationTotal,
    duration,
    questionsCount,
    timeRemaining,
    progressPercentage,
    onDelete
}) {
    // Determine styles based on state
    let accentColorClass = '';
    let iconName = '';
    let iconColorClass = '';
    let badgeClass = '';
    let badgeText = '';
    let borderColorClass = 'border-outline-variant';

    if (state === 'completed') {
        accentColorClass = 'bg-tertiary';
        iconName = 'assignment_turned_in';
        iconColorClass = 'text-tertiary';
        badgeClass = 'bg-surface-container-highest text-on-surface-variant';
        badgeText = 'Completed';
    } else if (state === 'pending') {
        accentColorClass = 'bg-tertiary-fixed-dim';
        iconName = 'rate_review';
        iconColorClass = 'text-tertiary';
        badgeClass = 'bg-error text-on-error animate-pulse';
        badgeText = 'Pending Review';
        borderColorClass = 'border-tertiary/20';
    } else if (state === 'scheduled') {
        accentColorClass = 'bg-outline';
        iconName = 'schedule';
        iconColorClass = 'text-outline';
        badgeClass = 'bg-surface-container-highest text-on-surface-variant';
        badgeText = 'Scheduled';
    } else if (state === 'active') {
        accentColorClass = 'bg-secondary-fixed-dim';
        iconName = 'bolt';
        iconColorClass = 'text-secondary';
        badgeClass = 'bg-secondary-container text-on-secondary-container';
        badgeText = 'Active';
    }

    return (
        <div className={`bg-surface-container-lowest rounded-xl border ${borderColorClass} shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group relative`}>
            {state === 'pending' && (
                <div className="absolute top-4 right-4 z-10">
                    <span className={`px-2 py-1 rounded font-label-sm text-[10px] uppercase tracking-wider ${badgeClass}`}>
                        {badgeText}
                    </span>
                </div>
            )}

            <Link href={route('teacher.assessments.show', { assessmentId: id })} className="flex-1 flex flex-col p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${state === 'active' ? 'bg-secondary-container/20' : 'bg-tertiary/10'}`}>
                        <Icon name={iconName} className={iconColorClass} />
                    </div>
                    {state !== 'pending' && (
                        <span className={`px-2 py-1 rounded font-label-sm text-[10px] uppercase tracking-wider ${badgeClass}`}>
                            {badgeText}
                        </span>
                    )}
                </div>
                
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-6">{chapter}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {state === 'active' ? 'Time Remaining' : 'Class Avg'}
                        </span>
                        <span className={`font-headline-md text-headline-md font-bold ${state === 'active' ? 'text-on-surface' : 'text-tertiary'}`}>
                            {state === 'active' ? timeRemaining : classAvg}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Participation</span>
                        <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                            {participationCompleted}/{participationTotal}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 py-3 border-t border-outline-variant/30 mt-auto">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                        <Icon name="timer" className="text-[18px]" />
                        <span className="font-label-sm text-label-sm">{duration} min</span>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                        <Icon name="quiz" className="text-[18px]" />
                        <span className="font-label-sm text-label-sm">{questionsCount} questions</span>
                    </div>
                </div>
            </Link>

            <div className="h-1.5 w-full bg-surface-container">
                <div 
                    className={`h-full ${accentColorClass} transition-all duration-1000`} 
                    style={{ width: state === 'active' ? `${progressPercentage}%` : '100%' }}
                ></div>
            </div>

            {state === 'pending' && (
                <button 
                    className="w-full py-3 bg-tertiary text-on-tertiary font-label-md text-label-md hover:bg-tertiary/90 transition-colors"
                >
                    Grade Now
                </button>
            )}

            {onDelete && (
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
                        className="p-1.5 rounded-full bg-surface-container-lowest/90 hover:bg-error-container text-on-surface-variant hover:text-error shadow-sm transition-all"
                        title="Delete assessment"
                    >
                        <Icon name="delete" className="text-[18px]" />
                    </button>
                </div>
            )}
        </div>
    );
}
