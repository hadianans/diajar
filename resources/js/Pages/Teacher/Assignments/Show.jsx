import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentMetricsBento from '@/Components/features/teacher-assignments/AssignmentMetricsBento';
import GradeDistributionChart from '@/Components/features/teacher-assignments/GradeDistributionChart';
import CollapsibleRubric from '@/Components/features/teacher-assignments/CollapsibleRubric';
import SubmissionRoster from '@/Components/features/teacher-assignments/SubmissionRoster';
import AttachmentList from '@/Components/features/teacher-lessons/AttachmentList';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError, confirmDelete } from '@/utils/swal';
import moment from 'moment';

export default function Show({ assignmentId }) {
    const { data: assignment, loading, refetch } = useApiGet(`/assignments/${assignmentId}`);

    const handleBack = () => {
        router.visit(route('teacher.assignments.index'));
    };

    const handleEdit = () => {
        router.visit(route('teacher.assignments.edit', { assignmentId }));
    };

    const handleDelete = async () => {
        const confirmed = await confirmDelete('Delete Assignment?', 'This cannot be undone.');
        if (!confirmed) return;
        try {
            await api.delete(`/assignments/${assignmentId}`);
            router.visit(route('teacher.assignments.index'));
        } catch (err) {
            showError('Error', err.response?.data?.message || 'Error deleting assignment');
        }
    };

    const handleToggleStatus = async () => {
        const action = assignment.status === 'open' ? 'close' : 'reopen';
        try {
            await api.patch(`/assignments/${assignmentId}/${action}`);
            refetch();
        } catch (err) {
            showError('Error', err.response?.data?.message || `Error trying to ${action} assignment`);
        }
    };

    if (loading) {
        return (
            <DashboardTemplate role="teacher" activeTab="assignments" title="Loading..." showBack={true} onBack={handleBack}>
                <div className="text-center py-12 text-on-surface-variant">Loading assignment...</div>
            </DashboardTemplate>
        );
    }

    if (!assignment) {
        return (
            <DashboardTemplate role="teacher" activeTab="assignments" title="Not Found" showBack={true} onBack={handleBack}>
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
        { label: '<70', percentage: maxBucketCount ? ((assignment.grade_distribution['0-49'] || 0) + (assignment.grade_distribution['50-59'] || 0) + (assignment.grade_distribution['60-69'] || 0)) / maxBucketCount * 100 : 0, colorClass: 'bg-error-container' },
    ] : [];

    const rubricCriteria = assignment.rubric?.criteria?.map(c => ({
        title: c.title,
        description: c.description || '',
        weight: c.weight,
        weightStr: `${c.weight}%`,
        levels: c.levels || []
    })) || [];

    const attachments = (assignment.attachments || []).map(att => ({
        name: att.title || att.file_url.split('/').pop(),
        type: 'file',
        size: 'Unknown',
        date: moment(att.created_at).format('MMM D'),
        url: att.file_url
    }));

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

    const actions = (
        <div className="flex items-center gap-2">
            <button
                onClick={handleToggleStatus}
                className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full font-label-md transition-colors active:scale-95 ${assignment.status === 'open'
                    ? 'bg-error-container text-error'
                    : 'bg-primary-container text-on-primary-container'
                    }`}
            >
                <Icon name={assignment.status === 'open' ? 'lock' : 'lock_open'} className="text-[18px]" />
                {assignment.status === 'open' ? 'Close' : 'Reopen'}
            </button>
            <button
                onClick={handleEdit}
                className="active:scale-95 transition-transform duration-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high"
                title="Edit Assignment"
            >
                <Icon name="edit" className="text-primary" />
            </button>
            <button
                onClick={handleDelete}
                className="active:scale-95 transition-transform duration-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/20"
                title="Delete Assignment"
            >
                <Icon name="delete" className="text-error" />
            </button>
        </div>
    );

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="assignments"
            title="Assignment Details"
            showBack={true}
            onBack={handleBack}
            actions={actions}
        >
            <Head title={`Assignment ${assignment.title || 'Details'} | Diajar LMS`} />

            <div className="max-w-3xl mx-auto space-y-stack-lg w-full pb-24 mt-4">
                {/* Title Section */}
                <section className="space-y-stack-sm">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">{assignment.title}</h2>
                        <p className="font-body-md text-on-surface-variant mt-1">{assignment.chapter?.name || 'Uncategorized'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container">
                            <Icon name="grade" className="text-sm" />
                            <span className="font-label-md text-label-md">Max Grade: {assignment.grade} pts</span>
                        </div>
                        {assignment.due_date && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-on-primary-container">
                                <Icon name="schedule" className="text-sm" />
                                <span className="font-label-md text-label-md">Due: {moment(assignment.due_date).format('MMM D, YYYY HH:mm')}</span>
                            </div>
                        )}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${assignment.status === 'open' ? 'bg-secondary-container/20 text-secondary' : 'bg-error-container/20 text-error'
                            }`}>
                            <Icon name={assignment.status === 'open' ? 'lock_open' : 'lock'} className="text-sm" />
                            <span className="font-label-md text-label-md capitalize">{assignment.status}</span>
                        </div>
                    </div>
                    {assignment.description && (
                        <div className="font-body-md text-on-surface-variant leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: assignment.description }} />
                    )}
                </section>

                {attachments.length > 0 && (
                    <section className="space-y-stack-sm">
                        <h3 className="font-headline-sm text-on-surface">Attachments</h3>
                        <AttachmentList attachments={attachments} />
                    </section>
                )}

                <AssignmentMetricsBento
                    submissions={assignment.total_submissions || 0}
                    totalStudents={30}
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
