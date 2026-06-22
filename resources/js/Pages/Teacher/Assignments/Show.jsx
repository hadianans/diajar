import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentMetricsBento from '@/Components/features/teacher-assignments/AssignmentMetricsBento';
import GradeDistributionChart from '@/Components/features/teacher-assignments/GradeDistributionChart';
import CollapsibleRubric from '@/Components/features/teacher-assignments/CollapsibleRubric';
import SubmissionRoster from '@/Components/features/teacher-assignments/SubmissionRoster';
import Icon from '@/Components/shared/ui/Icon';

export default function Show({ assignmentId }) {
    
    // Use DashboardTemplate but with a custom header section/actions to mimic the specific design
    const customTitleSection = (
        <div className="flex items-center gap-3">
            <button 
                onClick={() => router.visit(route('teacher.assignments.index'))}
                className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform hover:bg-surface-container-low"
            >
                <Icon name="arrow_back" className="text-primary" />
            </button>
            <h1 className="font-headline-md text-headline-md-mobile text-primary">Assignment Details</h1>
        </div>
    );

    const actions = (
        <button className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-transform hover:bg-surface-container-low">
            <Icon name="more_vert" className="text-on-surface-variant" />
        </button>
    );

    const chartData = [
        { label: '90-100', percentage: 66, colorClass: 'bg-primary-container' },
        { label: '80-89', percentage: 100, colorClass: 'bg-primary' },
        { label: '70-79', percentage: 41, colorClass: 'bg-secondary-fixed-dim' },
        { label: '<70', percentage: 25, colorClass: 'bg-error-container' },
    ];

    const rubricCriteria = [
        { title: 'Scientific Accuracy', description: 'Precision of biological terms', weight: 40, weightStr: '40%' },
        { title: 'Methodology', description: 'Procedure clarity and control', weight: 30, weightStr: '30%' },
        { title: 'Analysis', description: 'Data interpretation depth', weight: 30, weightStr: '30%' },
    ];

    const students = [
        { id: 1, name: 'Alex Johnson', group: 'Group A', initials: 'AJ', avatarColorClass: 'bg-primary-fixed-dim text-on-primary-fixed', submittedAt: 'Oct 24, 10:30 AM', status: 'ungraded' },
        { id: 2, name: 'Maria Garcia', group: 'Group B', initials: 'MG', avatarColorClass: 'bg-secondary-fixed-dim text-on-secondary-fixed', submittedAt: 'Oct 23, 2:15 PM', status: 'graded', grade: 92 },
        { id: 3, name: 'Samuel Kim', group: 'Group A', initials: 'SK', avatarColorClass: 'bg-surface-variant text-on-surface-variant', submittedAt: 'Oct 24, 09:12 AM', status: 'ungraded' },
    ];

    return (
        <DashboardTemplate role="teacher" customTitle={customTitleSection} actions={actions}>
            <Head title={`Assignment ${assignmentId || 'Details'}`} />

            <div className="max-w-md mx-auto space-y-stack-lg w-full pb-24">
                {/* Title Section */}
                <section className="space-y-stack-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Genetics Lab Report</h2>
                            <p className="font-body-md text-on-surface-variant">Chapter 3: Molecular Basis</p>
                        </div>
                        <button 
                            onClick={() => router.visit(route('teacher.assignments.edit', { assignmentId: assignmentId || 1 }))}
                            className="p-2 rounded-lg bg-surface-container-low text-primary-container transition-transform active:scale-90"
                        >
                            <Icon name="edit" />
                        </button>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container">
                        <Icon name="grade" className="text-sm" />
                        <span className="font-label-md text-label-md">Max Grade: 100 pts</span>
                    </div>
                </section>

                <AssignmentMetricsBento 
                    submissions={28}
                    totalStudents={32}
                    pendingCount={16}
                    isUrgent={true}
                    gradedCount={12}
                    classAverage={88}
                    maxPts={100}
                />

                <GradeDistributionChart data={chartData} />
                
                <CollapsibleRubric criteria={rubricCriteria} />
                
                <SubmissionRoster assignmentId={assignmentId || 1} students={students} />
            </div>

        </DashboardTemplate>
    );
}
