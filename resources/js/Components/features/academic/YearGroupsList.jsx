import React from 'react';
import GroupCard from '@/Components/features/academic/GroupCard';
import Icon from '@/Components/shared/ui/Icon';

export default function YearGroupsList({ groups = [], onAddGroupClick, onGroupClick }) {
    return (
        <section className="flex flex-col gap-stack-md bg-surface-container-lowest p-5 md:p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Student Groups <span className="text-on-surface-variant text-body-md font-normal">(This Year)</span>
                </h3>
                <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
                    Total: {groups.length}
                </span>
            </div>

            <div className="flex flex-col gap-stack-sm">
                {groups.map((group, index) => (
                    <GroupCard
                        key={group.id || index}
                        groupName={group.groupName}
                        grade={group.grade}
                        studentsCount={group.studentsCount}
                        hasWarning={group.studentsCount === 0 || group.warning}
                        onClick={() => {
                            if (onGroupClick) onGroupClick(group);
                        }}
                    />
                ))}
            </div>

            <button
                onClick={onAddGroupClick}
                className="w-full py-3 bg-primary text-on-primary font-label-md rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-primary/95 active:scale-95 duration-150 transition-all"
                type="button"
            >
                <Icon name="group_add" className="text-[20px]" />
                Add Group to Year
            </button>
        </section>
    );
}
