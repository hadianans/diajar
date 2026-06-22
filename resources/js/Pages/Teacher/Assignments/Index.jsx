import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentFilterTabs from '@/Components/features/teacher-assignments/AssignmentFilterTabs';
import AssignmentChapterChips from '@/Components/features/teacher-assignments/AssignmentChapterChips';
import AssignmentListCard from '@/Components/features/teacher-assignments/AssignmentListCard';
import Icon from '@/Components/shared/ui/Icon';

export default function Index() {
    
    const handleCreate = () => {
        router.visit(route('teacher.assignments.create'));
    };

    const actions = (
        <button 
            onClick={handleCreate}
            className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md text-label-md shadow-sm active:scale-95 transition-transform"
        >
            Create
        </button>
    );

    return (
        <DashboardTemplate role="teacher" title="Assignments" actions={actions}>
            <Head title="Assignments" />
            
            <AssignmentFilterTabs />
            <AssignmentChapterChips />
            
            {/* Sort Control */}
            <div className="flex justify-end items-center py-1">
                <button className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors">
                    <span>Sort by: Pending</span>
                    <Icon name="expand_more" className="text-[18px]" />
                </button>
            </div>

            {/* Assignment Cards List */}
            <div className="flex flex-col gap-4 pb-24">
                <AssignmentListCard 
                    id="1"
                    title="Genetics Lab Report"
                    chapter="Chapter 3: Molecular Basis"
                    statusText="16 Pending"
                    statusIcon="priority_high"
                    statusColorClass="bg-error-container text-on-error-container"
                    submissions={28}
                    totalStudents={32}
                    graded={12}
                    average="88/100"
                    initials={['JD', 'MK', '+12']}
                />
                
                <AssignmentListCard 
                    id="2"
                    title="Cell Diagram Drawing"
                    chapter="Chapter 2: Cell Structure"
                    statusText="2 Pending"
                    statusIcon="schedule"
                    statusColorClass="bg-tertiary-fixed text-on-tertiary-fixed"
                    submissions={32}
                    totalStudents={32}
                    graded={30}
                    average="92/100"
                />
                
                <AssignmentListCard 
                    id="3"
                    title="Photosynthesis Essay"
                    chapter="Chapter 2: Cell Structure"
                    statusText="15 Pending"
                    statusIcon="notification_important"
                    statusColorClass="bg-error-container text-on-error-container"
                    submissions={15}
                    totalStudents={32}
                    graded={0}
                    maxPts={50}
                />
            </div>

        </DashboardTemplate>
    );
}
