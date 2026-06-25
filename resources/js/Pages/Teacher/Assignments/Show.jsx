import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentMetricsBento from '@/Components/features/teacher-assignments/AssignmentMetricsBento';
import GradeDistributionChart from '@/Components/features/teacher-assignments/GradeDistributionChart';
import CollapsibleRubric from '@/Components/features/teacher-assignments/CollapsibleRubric';
import SubmissionRoster from '@/Components/features/teacher-assignments/SubmissionRoster';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function Show({ assignmentId }) {
    const { data: assignment, loading } = useApiGet(`/assignments/${assignmentId}`);

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

    if (loading) {
        return (
            <DashboardTemplate role="teacher" customTitle={customTitleSection} actions={actions}>
                <div className="text-center py-12 text-on-surface-variant">Loading assignment...</div>
            </DashboardTemplate>
        );
    }

    if (!assignment) {
        return (
            <DashboardTemplate role="teacher" customTitle={customTitleSection} actions={actions}>
                <div className="text-center py-12 text-on-surface-variant">Assignment not found.</div>
            </DashboardTemplate>
        );
    }

    // Process grade distribution for chart
    let maxBucketCount = 0;
    if (assignment.grade_distribution) {
        Object.values(assignment.grade_distribution).forEach(count => {
            if (count > maxBucketCount) maxBucketCount = count;
        });
    }
    const chartData = assignment.grade_distribution ? [
        { label: '90-100', percentage: maxBucketCount ? (assignment.grade_distribution['90-100'] / maxBucketCount) * 100 : 0, colorClass: 'bg-primary-container' },
        { label: '80-89', percentage: maxBucketCount ? (assignment.grade_distribution['80-89'] / maxBucketCount) * 100 : 0, colorClass: 'bg-primary' },
        { label: '70-79', percentage: maxBucketCount ? (assignment.grade_distribution['70-79'] / maxBucketCount) * 100 : 0, colorClass: 'bg-secondary-fixed-dim' },
        { label: '<70', percentage: maxBucketCount ? (assignment.grade_distribution['0-49'] + assignment.grade_distribution['50-59'] + assignment.grade_distribution['60-69']) / maxBucketCount * 100 : 0, colorClass: 'bg-error-container' },
    ] : [];

    const rubricCriteria = assignment.rubric?.criteria?.map(c => ({
        title: c.title,
        description: c.description || '',
        weight: c.weight,
        weightStr: `${c.weight}%`
    })) || [];

    const students = (assignment.submissions || []).map(sub => ({
        id: sub.student.id,
        name: sub.student.full_name || sub.student.username,
        group: 'Class',
        initials: (sub.student.full_name || sub.student.username).substring(0, 2).toUpperCase(),
        avatarColorClass: sub.status === 'graded' ? 'bg-primary-fixed-dim text-on-primary-fixed' : 'bg-surface-variant text-on-surface-variant',
        submittedAt: moment(sub.created_at).format('MMM D, hh:mm A'),
        status: sub.status,
        grade: sub.grade
    }));

    return (
        <DashboardTemplate role="teacher" activeTab="assignments" customTitle={customTitleSection} actions={actions}>
            <Head title={`Assignment ${assignment.title || 'Details'} | Diajar LMS`} />

            <div className="max-w-md mx-auto space-y-stack-lg w-full pb-24 mt-4">
                {/* Title Section */}
                <section className="space-y-stack-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{assignment.title}</h2>
                            <p className="font-body-md text-on-surface-variant">{assignment.chapter?.name || 'Uncategorized'}</p>
                        </div>
                        <button 
                            onClick={() => router.visit(route('teacher.assignments.edit', { assignmentId: assignment.id }))}
                            className="p-2 rounded-lg bg-surface-container-low text-primary-container transition-transform active:scale-90"
                        >
                            <Icon name="edit" />
                        </button>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container">
                        <Icon name="grade" className="text-sm" />
                        <span className="font-label-md text-label-md">Max Grade: {assignment.grade} pts</span>
                    </div>
                </section>

                <AssignmentMetricsBento 
                    submissions={assignment.total_submissions || 0}
                    totalStudents={30} // Hardcoded for now
                    pendingCount={assignment.ungraded_count || 0}
                    isUrgent={(assignment.ungraded_count || 0) > 0}
                    gradedCount={assignment.graded_count || 0}
                    classAverage={assignment.avg_grade || 0}
                    maxPts={assignment.grade}
                />

                {chartData.length > 0 && <GradeDistributionChart data={chartData} />}
                
                {rubricCriteria.length > 0 && <CollapsibleRubric criteria={rubricCriteria} />}
                
                <SubmissionRoster assignmentId={assignment.id} students={students} />
            </div>

        </DashboardTemplate>
    );
}
