import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function SubjectCard({
    id,
    title,
    teacher,
    schedule,
    progress = 0,
    icon = 'menu_book',
    iconColorClass = 'text-primary',
    iconBgClass = 'bg-primary-fixed'
}) {
    return (
        <div>
            <Link
                href={route('student.subjects.show', { subjectId: id })}
                className="block bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05),0_2px_4px_-2px_rgba(15,23,42,0.05)] active:scale-[0.98] transition-transform duration-150 cursor-pointer flex flex-col gap-4"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass}`}>
                            <Icon name={icon} className={iconColorClass} />
                        </div>
                        <div>
                            <h3 className="text-headline-md font-headline-md text-on-surface">{title}</h3>
                            <p className="text-label-sm font-label-sm text-on-surface-variant">{teacher}</p>
                        </div>
                    </div>
                    <Icon name="chevron_right" className="text-outline-variant" />
                </div>

                <div className="flex items-center gap-2 text-label-sm font-label-sm text-outline">
                    <Icon name="calendar_today" className="text-[18px]" />
                    <span>{schedule}</span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Progress</span>
                        <span className="text-label-md font-label-md text-primary">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
