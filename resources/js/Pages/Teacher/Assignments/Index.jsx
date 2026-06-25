import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentFilterTabs from '@/Components/features/teacher-assignments/AssignmentFilterTabs';
import AssignmentChapterChips from '@/Components/features/teacher-assignments/AssignmentChapterChips';
import AssignmentListCard from '@/Components/features/teacher-assignments/AssignmentListCard';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';

export default function Index() {
    const { data: assignments, loading } = useApiGet('/assignments');
    
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
        <DashboardTemplate role="teacher" activeTab="assignments" title="Assignments" actions={actions}>
            <Head title="Assignments | Diajar LMS" />
            
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
            {loading ? (
                <div className="text-center py-12 text-on-surface-variant">Loading assignments...</div>
            ) : (
                <div className="flex flex-col gap-4 pb-24">
                    {assignments && assignments.length > 0 ? (
                        assignments.map(assignment => (
                            <AssignmentListCard 
                                key={assignment.id}
                                id={assignment.id.toString()}
                                title={assignment.title}
                                chapter={assignment.chapter?.name || "Uncategorized"}
                                statusText={`${assignment.pending_submissions || 0} Pending`}
                                statusIcon={assignment.pending_submissions > 0 ? "priority_high" : "check_circle"}
                                statusColorClass={assignment.pending_submissions > 0 ? "bg-error-container text-on-error-container" : "bg-primary-container text-on-primary-container"}
                                submissions={assignment.total_submissions || 0}
                                totalStudents={30} // Hardcoded until class total is available in payload
                                graded={assignment.graded_submissions || 0}
                                average={assignment.avg_grade ? `${assignment.avg_grade}/100` : "-"}
                                initials={[]} // Submissions not fully eagerly loaded for index
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                            You have no active assignments.
                        </div>
                    )}
                </div>
            )}

        </DashboardTemplate>
    );
}
