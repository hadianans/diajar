import React from 'react';
import BentoCard from '@/Components/features/academic/BentoCard';
import Icon from '@/Components/shared/ui/Icon';

export default function GroupStats({ totalStudents = 24, unlinkedStudents = 72, progressPercent = 40, assignedCount = 48, totalCapacity = 120 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg">
            {/* Summary Card */}
            <BentoCard
                title="Group Summary"
                icon={<Icon name="info" className="text-primary" />}
                className="md:col-span-4"
            >
                <div className="flex flex-col items-center py-4">
                    <span className="text-5xl font-bold text-primary mb-2">{totalStudents}</span>
                    <span className="text-on-surface-variant font-label-md">Students Linked</span>
                </div>
                <div className="mt-4 p-3 bg-surface-container-low rounded-lg text-sm text-center border border-outline-variant">
                    <span className="text-on-surface font-semibold">{unlinkedStudents} students</span> are currently unlinked in the school system.
                </div>
            </BentoCard>

            {/* Progress Card */}
            <BentoCard
                title="Student Assignment Progress"
                className="md:col-span-8"
            >
                <div className="space-y-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-on-surface">Yearly Capacity Tracking</span>
                        <span className="text-headline-md font-bold text-secondary">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-surface-container h-4 rounded-full overflow-hidden">
                        <div
                            className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary-container/20 rounded-xl">
                        <Icon name="assignment_turned_in" className="text-secondary" />
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            <strong className="text-secondary">{assignedCount} of {totalCapacity}</strong> students assigned across all groups this academic year. 
                            Progress is consistent with the mid-term target.
                        </p>
                    </div>
                </div>
            </BentoCard>
        </div>
    );
}
