import React from 'react';
import DeadlineItem from '@/Components/features/student-dashboard/DeadlineItem';

export default function UpcomingDeadlines({ deadlines = [], onDeadlineClick }) {
    return (
        <section className="flex flex-col gap-4">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                Upcoming Deadlines
            </h3>
            <div className="flex flex-col gap-3">
                {deadlines.length === 0 ? (
                    <div className="p-6 text-center text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-2xl font-label-md">
                        No upcoming deadlines.
                    </div>
                ) : (
                    deadlines.map((item, index) => (
                        <DeadlineItem
                            key={item.id || index}
                            title={item.title}
                            type={item.type}
                            dueDate={item.dueDate}
                            icon={item.icon}
                            badgeBgClass={item.badgeBgClass}
                            onClick={() => onDeadlineClick && onDeadlineClick(item)}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
