import React from 'react';
import CompactClassCard from '@/Components/features/classes/CompactClassCard';
import Icon from '@/Components/shared/ui/Icon';

export default function YearClassesList({ classes = [], onViewAllClick, onGenerateClassClick, onClassMoreClick }) {
    return (
        <section className="flex flex-col gap-stack-md bg-white p-5 md:p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Subject Classes <span className="text-on-surface-variant text-body-md font-normal">(This Year)</span>
                </h3>
                <button
                    onClick={onViewAllClick}
                    className="text-primary font-label-md flex items-center gap-1 hover:underline transition-all"
                    type="button"
                >
                    View All
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {classes.map((cls, index) => (
                    <CompactClassCard
                        key={cls.id || index}
                        subject={cls.subject}
                        teacher={cls.teacher}
                        group={cls.group}
                        icon={cls.icon}
                        isWarning={cls.isWarning}
                        warningMessage={cls.warningMessage}
                        onMoreClick={() => {
                            if (onClassMoreClick) onClassMoreClick(cls);
                        }}
                    />
                ))}
            </div>

            <button
                onClick={onGenerateClassClick}
                className="mt-2 w-full py-3 bg-primary-container text-on-primary-container font-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-primary-container/90 transition-colors active:scale-95 duration-150 shadow-sm"
                type="button"
            >
                <Icon name="add_circle" className="text-[20px]" />
                Generate New Class
            </button>
        </section>
    );
}
