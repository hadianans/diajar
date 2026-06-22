import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SubjectClassCard({ group, teacher, academicYear }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant gap-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0">
                    <Icon name="school" className="text-[20px]" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                        {group}
                    </span>
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mt-0.5">
                        <Icon name="person" className="text-[14px]" />
                        <span>Teacher: {teacher}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:items-end flex-shrink-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Academic Year
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5">
                    {academicYear}
                </span>
            </div>
        </div>
    );
}
