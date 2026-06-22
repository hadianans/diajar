import React from 'react';
import Icon from '@/Components/shared/ui/Icon';
import GroupItem from '@/Components/features/academic/GroupItem';

export default function GroupsBox({ groups = [], onAddGroupClick, onViewAllGroups }) {
    return (
        <section className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-stack-md">
                <div className="flex items-center gap-2">
                    <Icon name="group_work" className="text-on-surface-variant text-xl" />
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Student Groups</h3>
                </div>
            </div>
            <div className="space-y-stack-sm flex-grow">
                {groups.map((group, idx) => (
                    <GroupItem
                        key={idx}
                        groupName={group.groupName}
                        grade={group.grade}
                        studentsCount={group.studentsCount}
                        warning={group.warning}
                        onClick={() => alert(`Selected Group: ${group.groupName}`)}
                        onMoreClick={() => alert(`Options for ${group.groupName}`)}
                    />
                ))}
            </div>
            <div className="mt-stack-md flex flex-col gap-2">
                {onViewAllGroups && (
                    <button
                        onClick={onViewAllGroups}
                        className="text-center font-label-md text-label-md text-primary hover:underline py-2 active:scale-95"
                        type="button"
                    >
                        View all groups
                    </button>
                )}
                {onAddGroupClick && (
                    <button
                        onClick={onAddGroupClick}
                        className="w-full py-3 bg-surface-container-highest text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-variant transition-colors border border-outline-variant active:scale-[0.98]"
                        type="button"
                    >
                        New Group
                    </button>
                )}
            </div>
        </section>
    );
}
