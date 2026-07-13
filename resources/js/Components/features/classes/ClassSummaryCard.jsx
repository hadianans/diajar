import React from 'react';
import ClassSummaryItem from '@/Components/features/classes/ClassSummaryItem';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassSummaryCard({
    subject,
    teacher,
    schedule,
    academicYear,
    onEditScheduleClick
}) {
    return (
        <article className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Class Summary
                </h3>
                <button
                    onClick={onEditScheduleClick}
                    className="text-primary hover:bg-primary-container/10 p-2 rounded-full transition-colors active:scale-90 flex items-center justify-center"
                    title="Edit Schedule"
                    type="button"
                >
                    <Icon name="edit_calendar" className="text-[20px]" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
                <ClassSummaryItem label="Subject" value={subject} icon="science" />
                <ClassSummaryItem label="Teacher" value={teacher} icon="person" />
                <ClassSummaryItem label="Schedule" value={schedule} icon="schedule" />
                <ClassSummaryItem label="Academic Year" value={academicYear} icon="history_edu" />
            </div>
        </article>
    );
}
