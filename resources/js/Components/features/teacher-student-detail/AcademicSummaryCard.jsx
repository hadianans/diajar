import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AcademicSummaryCard({ avgAssignment, avgAssessment, completion, trend }) {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-[0_4px_12px_rgba(15,23,42,0.05)] flex flex-col justify-between h-full">
            <h3 className="font-label-md text-label-md text-outline uppercase tracking-wider mb-stack-sm">Academic Summary</h3>
            <div className="space-y-stack-sm">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Avg Assignment</p>
                        <p className="font-headline-lg text-headline-lg text-primary">{avgAssignment}</p>
                    </div>
                    <div className="flex items-center text-secondary font-label-md text-label-md">
                        <Icon name="trending_up" />
                        <span>{trend}%</span>
                    </div>
                </div>
                <div className="h-px bg-outline-variant w-full"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Avg Assessment</p>
                        <p className="font-headline-md text-headline-md text-on-surface">{avgAssessment}%</p>
                    </div>
                    <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Completion</p>
                        <p className="font-headline-md text-headline-md text-on-surface">{completion}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
