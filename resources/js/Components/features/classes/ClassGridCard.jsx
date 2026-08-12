import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassGridCard({
    year = '2024/2025',
    subject,
    teacher = 'Unassigned',
    group,
    schedule = 'Not set',
    studentsCount = 0,
    isComplete = true,
    onClick
}) {
    const statusLabel = isComplete ? 'Complete' : 'Incomplete';

    return (
        <div
            onClick={onClick}
            className={`bg-surface-container-lowest rounded-xl p-stack-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                isComplete
                    ? 'border border-outline-variant'
                    : 'border-2 border-tertiary/20'
            }`}
        >
            <div>
                {/* Header Row */}
                <div className="flex justify-between items-start mb-3 gap-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold">
                        {year}
                    </span>
                    {isComplete ? (
                        <div className="flex items-center text-secondary font-label-sm text-label-sm gap-1 bg-secondary/10 px-2 py-1 rounded-lg font-bold">
                            <Icon
                                name="check_circle"
                                className="text-[16px] fill-icon"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            />
                            <span>{statusLabel}</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-tertiary font-label-sm text-label-sm gap-1 bg-tertiary-fixed/30 px-2 py-1 rounded-lg font-bold">
                            <Icon
                                name="warning"
                                className="text-[16px] fill-icon"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            />
                            <span>{statusLabel}</span>
                        </div>
                    )}
                </div>

                {/* Subject Title */}
                <h3 className={`font-headline-md text-headline-md text-on-surface mb-1 font-bold transition-colors ${
                    isComplete ? 'group-hover:text-primary' : 'group-hover:text-tertiary'
                }`}>
                    {subject}
                </h3>

                {/* Meta Rows */}
                <div className="space-y-2.5 mt-4">
                    {/* Teacher */}
                    {isComplete ? (
                        <div className="flex items-start gap-3 text-on-surface-variant">
                            <Icon name="person" className="text-outline text-lg flex-shrink-0 mt-0.5" />
                            <span className="font-body-md text-body-md min-w-0 break-words leading-normal">{teacher}</span>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 text-tertiary font-medium">
                            <Icon name="person_off" className="text-tertiary/60 text-lg flex-shrink-0 mt-0.5" />
                            <span className="font-body-md text-body-md min-w-0 break-words leading-normal">{teacher}</span>
                        </div>
                    )}

                    {/* Group / Class List */}
                    <div className="flex items-start gap-3 text-on-surface-variant">
                        <Icon name="group" className="text-outline text-lg flex-shrink-0 mt-0.5" />
                        <span className="font-body-md text-body-md text-on-surface-variant min-w-0 break-words leading-relaxed">
                            {group}
                        </span>
                    </div>

                    {/* Schedule */}
                    {isComplete ? (
                        <div className="flex items-start gap-3 text-on-surface-variant">
                            <Icon name="calendar_today" className="text-outline text-lg flex-shrink-0 mt-0.5" />
                            <span className="font-body-md text-body-md min-w-0 break-words leading-normal">{schedule}</span>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 text-tertiary/60 italic">
                            <Icon name="event_busy" className="text-tertiary/40 text-lg flex-shrink-0 mt-0.5" />
                            <span className="font-body-md text-body-md min-w-0 break-words leading-normal">{schedule}</span>
                        </div>
                    )}
                </div>

                {/* Warnings Section (Incomplete only) */}
                {!isComplete && (
                    <div className="mt-4 p-2 bg-tertiary-fixed/20 rounded-lg flex gap-2 items-start border border-tertiary-container/10">
                        <Icon name="info" className="text-tertiary text-sm mt-0.5" />
                        <p className="text-[11px] leading-tight text-tertiary font-medium">
                            Missing teacher & schedule configuration. Class cannot be published.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Avatar Stack Row */}
            <div className="mt-6 pt-4 border-t border-outline-variant flex justify-between items-center">
                {isComplete ? (
                    <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full border-2 border-surface-container-lowest bg-surface-variant" />
                        <div className="w-7 h-7 rounded-full border-2 border-surface-container-lowest bg-primary-fixed" />
                        {studentsCount > 2 && (
                            <div className="w-7 h-7 rounded-full border-2 border-surface-container-lowest bg-secondary-fixed flex items-center justify-center text-[8px] font-bold text-on-secondary-fixed">
                                +{studentsCount - 2}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-dashed border-outline-variant text-outline-variant">
                        <Icon name="add" className="text-[14px]" />
                    </div>
                )}
                <span className="font-label-sm text-label-sm text-outline font-semibold">
                    {studentsCount} Students
                </span>
            </div>
        </div>
    );
}
