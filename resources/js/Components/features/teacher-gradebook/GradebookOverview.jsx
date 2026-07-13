import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function GradebookOverview({ assignmentWeight = 40, assessmentWeight = 60 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
            <div className="bg-surface-container-lowest border border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] p-6 rounded-xl md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <Icon name="analytics" className="text-secondary" filled />
                    <h3 className="font-label-md text-label-md text-on-surface">Grading Scheme</h3>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="font-body-md text-body-md text-on-surface-variant">Assignments</span>
                        <span className="font-label-md text-label-md text-primary bg-primary-fixed px-2 py-0.5 rounded">{assignmentWeight}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all" style={{ width: `${assignmentWeight}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="font-body-md text-body-md text-on-surface-variant">Assessments</span>
                        <span className="font-label-md text-label-md text-secondary bg-secondary-container px-2 py-0.5 rounded">{assessmentWeight}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full transition-all" style={{ width: `${assessmentWeight}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Decorative Visual Token */}
            <div className="bg-surface-container-lowest border border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] p-6 rounded-xl md:col-span-2 relative overflow-hidden flex items-center justify-between">
                <div className="z-10">
                    <h3 className="font-headline-md text-headline-md text-on-background">Performance Insight</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-md">Class is actively working on their assignments. The overall participation is looking great.</p>
                </div>
                <div className="hidden sm:block">
                    {/* Placeholder for future visual element */}
                </div>
            </div>
        </div>
    );
}
