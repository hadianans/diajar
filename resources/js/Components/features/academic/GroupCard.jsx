import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function GroupCard({ groupName, grade, studentsCount = 0, hasWarning = false, onClick }) {
    const isWarningState = hasWarning || studentsCount === 0;

    return (
        <div
            onClick={onClick}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow group cursor-pointer"
        >
            <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {groupName} - {grade}
                </span>
                {isWarningState ? (
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] rounded uppercase font-bold tracking-wider">
                            No students linked
                        </span>
                    </div>
                ) : (
                    <span className="text-label-sm font-label-sm text-on-surface-variant mt-1">
                        {studentsCount} students
                    </span>
                )}
            </div>
            <Icon
                name="chevron_right"
                className="text-outline group-hover:text-primary transition-colors text-[20px]"
            />
        </div>
    );
}
