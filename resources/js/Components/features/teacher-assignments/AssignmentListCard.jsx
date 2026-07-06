import React from 'react';
import Icon from '@/Components/shared/ui/Icon';
import { Link } from '@inertiajs/react';

export default function AssignmentListCard({
    id,
    title,
    chapter,
    statusText,
    statusIcon,
    statusColorClass,
    submissions,
    totalStudents,
    graded,
    average,
    initials,
    maxPts,
    onDelete,
    onEdit
}) {
    return (
        <article className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_20px_-2px_rgba(15,23,42,0.08)] p-4 active:scale-[0.98] transition-transform duration-150">
            <Link href={route('teacher.assignments.show', { assignmentId: id })} className="block">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
                        <p className="text-on-surface-variant font-label-sm text-label-sm">{chapter}</p>
                    </div>
                    {statusText && (
                        <span className={`${statusColorClass} px-2.5 py-1 rounded-lg text-label-sm font-bold flex items-center gap-1`}>
                            <Icon name={statusIcon} className="text-[14px]" />
                            {statusText}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 bg-surface-container-low rounded-lg p-3">
                    <div className="flex flex-col">
                        <span className="text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">Submissions</span>
                        <div className="flex items-end gap-1.5 mt-0.5">
                            <span className="text-on-surface font-bold text-lg">{submissions}</span>
                            <span className="text-on-surface-variant text-sm mb-0.5">/ {totalStudents}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">Graded</span>
                        <div className="flex items-end gap-1.5 mt-0.5">
                            <span className={graded === 0 ? "text-error font-bold text-lg" : "text-primary font-bold text-lg"}>{graded}</span>
                            <span className="text-on-surface-variant text-sm mb-0.5">done</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {average ? (
                            <>
                                <Icon name="analytics" className="text-secondary text-[20px]" />
                                <span className="text-on-surface-variant font-label-md text-label-md">Avg: <span className="text-on-surface font-bold">{average}</span></span>
                            </>
                        ) : (
                            <>
                                <Icon name="grade" className="text-outline text-[20px]" />
                                <span className="text-on-surface-variant font-label-md text-label-md">Max: <span className="text-on-surface font-bold">{maxPts}</span></span>
                            </>
                        )}
                    </div>

                    {initials && initials.length > 0 && (
                        <div className="flex -space-x-2">
                            {initials.map((initial, index) => (
                                <div key={index} className={`w-7 h-7 rounded-full border-2 border-surface flex items-center justify-center text-[10px] font-bold ${
                                    index === 0 ? 'bg-surface-variant text-on-surface-variant' : 
                                    index === 1 ? 'bg-primary-container text-on-primary-container' : 
                                    'bg-secondary-container text-on-secondary-container'
                                }`}>
                                    {initial}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {graded === submissions && submissions > 0 && (!initials || initials.length === 0) && (
                        <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                            <Icon name="check" className="text-[20px]" />
                        </div>
                    )}

                    {graded === 0 && submissions > 0 && (
                        <button type="button" className="text-primary font-bold text-label-md hover:underline">Start Grading</button>
                    )}
                </div>
            </Link>
            {(onDelete || onEdit) && (
                <div className="flex justify-end gap-4 pt-2 border-t border-outline-variant/30 mt-3">
                    {onEdit && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                            className="text-primary text-label-sm font-label-sm flex items-center gap-1 hover:underline active:scale-95 transition-transform"
                        >
                            <Icon name="edit" className="text-[14px]" />
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="text-error text-label-sm font-label-sm flex items-center gap-1 hover:underline active:scale-95 transition-transform"
                        >
                            <Icon name="delete" className="text-[14px]" />
                            Delete
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}
