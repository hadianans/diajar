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
        <Link
            href={route('student.subjects.show', { subjectId: id })}
            className="block bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/30 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05),0_2px_4px_-2px_rgba(15,23,42,0.05)] hover:shadow-md active:scale-[0.99] transition-all duration-200 cursor-pointer flex flex-col gap-3.5 sm:gap-4 group h-full"
        >
            <div className="flex justify-between items-start gap-3 min-w-0">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
                        <Icon name={icon} className={`${iconColorClass} text-[20px] sm:text-[24px]`} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-title-md sm:text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors min-w-0 break-words leading-snug">
                            {title}
                        </h3>
                        <p className="text-label-sm sm:text-body-sm font-medium text-on-surface-variant min-w-0 break-words mt-0.5">
                            {teacher}
                        </p>
                    </div>
                </div>
                <Icon name="chevron_right" className="text-outline-variant group-hover:text-primary transition-colors text-[20px] sm:text-[22px] flex-shrink-0 mt-1" />
            </div>

            <div className="flex items-center gap-2 text-label-sm sm:text-body-sm text-outline min-w-0">
                <Icon name="calendar_today" className="text-[16px] sm:text-[18px] flex-shrink-0" />
                <span className="min-w-0 truncate">{schedule}</span>
            </div>

            <div className="space-y-1.5 sm:space-y-2 mt-auto">
                <div className="flex justify-between items-center text-label-sm">
                    <span className="text-on-surface-variant font-medium">Progress</span>
                    <span className="font-bold text-primary">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </Link>
    );
}
