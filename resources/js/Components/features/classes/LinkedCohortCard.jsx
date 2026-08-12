import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function LinkedCohortCard({
    cohortName,
    activeStudentsCount = 0,
    onChangeGroupClick,
    onCohortClick
}) {
    return (
        <article className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                Linked Student Group
            </h3>

            <div
                onClick={onCohortClick}
                className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest flex items-center justify-between gap-3 hover:bg-surface-container-low transition-all cursor-pointer group shadow-sm min-w-0"
            >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Icon name="group" className="text-[24px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-title-sm text-title-sm font-bold text-on-surface break-words line-clamp-2 leading-relaxed">
                            {cohortName}
                        </h4>
                        <p className="text-on-surface-variant font-label-sm text-label-sm mt-0.5">
                            {activeStudentsCount} Active Students
                        </p>
                    </div>
                </div>
                <Icon name="chevron_right" className="text-outline group-hover:text-primary transition-colors text-[20px] flex-shrink-0 ml-1" />
            </div>

            <button
                onClick={onChangeGroupClick}
                className="w-full py-3 rounded-lg border border-primary text-primary font-label-md text-label-md hover:bg-primary/5 transition-colors active:scale-95 duration-100"
                type="button"
            >
                Change Group
            </button>
        </article>
    );
}
