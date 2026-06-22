import React from 'react';
import { Head, router } from '@inertiajs/react';
import FocusedMaterialLayout from '@/Components/shared/layout/FocusedMaterialLayout';
import AssignmentBasicInfoForm from '@/Components/features/teacher-assignments/AssignmentBasicInfoForm';
import RubricBuilder from '@/Components/features/teacher-assignments/RubricBuilder';

export default function Edit({ assignmentId }) {
    
    const handleBack = () => {
        router.visit(route('teacher.assignments.show', { assignmentId: assignmentId || 1 }));
    };

    const actions = (
        <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-all shadow-sm hover:brightness-110">
            Publish
        </button>
    );

    return (
        <FocusedMaterialLayout 
            title={`Edit Assignment ${assignmentId || ''}`}
            onBack={handleBack}
            actions={actions}
            isCreateMode={true}
        >
            <Head title={`Edit Assignment ${assignmentId || ''}`} />

            <div className="space-y-stack-lg max-w-screen-md mx-auto w-full pb-32">
                <AssignmentBasicInfoForm />
                <RubricBuilder />
            </div>

            {/* Sticky Bottom Bar specific to Assignments Form */}
            <div className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant px-margin-mobile py-4 flex items-center justify-between gap-4 md:px-margin-desktop">
                <div className="hidden md:flex items-center gap-2 text-outline">
                    <span className="material-symbols-outlined text-[18px]">cloud_done</span>
                    <span className="text-label-sm">Draft saved at 10:45 AM</span>
                </div>
                <div className="flex-1 md:flex-none flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:w-40 h-12 rounded-full border border-outline text-on-surface-variant font-label-md hover:bg-surface transition-colors active:scale-95">
                        Save Draft
                    </button>
                    <button className="flex-1 md:w-40 h-12 rounded-full bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                        Publish Changes
                    </button>
                </div>
            </div>

        </FocusedMaterialLayout>
    );
}
