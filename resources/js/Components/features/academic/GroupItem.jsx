import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function GroupItem({ groupName, grade, studentsCount, warning, onClick, onMoreClick }) {
    const isWarningState = warning || studentsCount === 0;

    if (isWarningState) {
        return (
            <div
                onClick={onClick}
                className="flex flex-col p-3 bg-error-container/10 border border-error/10 rounded-xl cursor-pointer hover:bg-error-container/20 transition-all shadow-sm animate-fade-in"
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center font-bold text-error flex-shrink-0">
                            {groupName}
                        </div>
                        <div>
                            <p className="font-label-md text-label-md text-on-surface font-bold">{grade}</p>
                            <p className="text-label-sm font-label-sm text-error font-medium">{studentsCount} students</p>
                        </div>
                    </div>
                    <Icon name="error" className="text-error flex-shrink-0" />
                </div>
                <div className="mt-2 text-[10px] bg-error text-white px-2 py-0.5 rounded-full w-fit self-end font-bold uppercase tracking-wider">
                    No students linked
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-3 border-b border-outline-variant/30 hover:bg-surface-container-low transition-all cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary flex-shrink-0">
                    {groupName}
                </div>
                <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">{grade}</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant font-medium">{studentsCount} students</p>
                </div>
            </div>
            {onMoreClick ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onMoreClick();
                    }}
                    className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center"
                    type="button"
                >
                    <Icon name="more_vert" className="text-outline-variant" />
                </button>
            ) : (
                <Icon name="chevron_right" className="text-outline-variant flex-shrink-0" />
            )}
        </div>
    );
}
