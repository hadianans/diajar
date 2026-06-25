import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssignmentRubric from '@/Components/features/student-assignments/AssignmentRubric';
import TeacherFeedback from '@/Components/features/student-assignments/TeacherFeedback';
import SubmissionArea from '@/Components/features/student-assignments/SubmissionArea';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';

export default function Show({ assignmentId }) {
    const { data: responseData, loading, setData } = useApiGet(`/assignments/${assignmentId}`);
    const [submitLoading, setSubmitLoading] = useState(false);

    if (loading) {
        return (
            <DashboardTemplate activeTab="tasks" title="Loading..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Loading assignment details...</div>
            </DashboardTemplate>
        );
    }

    if (!responseData || !responseData.assignment) {
        return (
            <DashboardTemplate activeTab="tasks" title="Not Found" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Assignment not found.</div>
            </DashboardTemplate>
        );
    }

    const { assignment, submission } = responseData;

    const displayStatus = submission 
        ? (submission.status === 'graded' ? 'Graded' : 'Submitted')
        : 'To-do';

    const rubrics = assignment.rubric?.criteria?.map(c => ({
        title: c.title,
        description: c.description,
        weight: c.weight
    })) || [];

    const handleSubmission = async (formData) => {
        setSubmitLoading(true);
        try {
            if (submission && submission.status === 'submitted') {
                await api.patch(`/assignments/${assignmentId}/submit`, formData);
            } else {
                await api.post(`/assignments/${assignmentId}/submit`, formData);
            }
            // Refetch or update local state
            window.location.reload(); // Simple way to refresh data
        } catch (error) {
            console.error('Error submitting assignment:', error);
            alert('Failed to submit assignment. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <DashboardTemplate 
            activeTab="tasks"
            title="Assignments"
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title="Assignment View | Diajar LMS" />

            <div className="px-margin-mobile mt-stack-md space-y-gutter max-w-2xl mx-auto pb-32">
                
                {/* Assignment Header */}
                <section className="space-y-stack-sm">
                    <div className="flex items-center gap-2">
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                            {assignment.chapter?.name || 'Assignment'}
                        </span>
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                            <Icon name="pending_actions" className="text-[14px]" />
                            {displayStatus}
                        </span>
                    </div>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                        {assignment.title}
                    </h2>
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                        <Icon name="event" className="text-[18px]" />
                        <span>{assignment.due_date ? `Due ${new Date(assignment.due_date).toLocaleString()}` : 'No due date'}</span>
                    </div>
                </section>

                {/* Assignment Details */}
                <section className="bg-white/80 backdrop-blur-[8px] border border-slate-200/80 rounded-xl p-5 space-y-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Task Description</h3>
                    <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed" dangerouslySetInnerHTML={{ __html: assignment.description }} />
                </section>

                {/* Assessment Rubric */}
                {rubrics.length > 0 && (
                    <AssignmentRubric rubrics={rubrics} />
                )}

                {/* Grading & Feedback */}
                {submission?.status === 'graded' && (
                    <TeacherFeedback 
                        feedback={submission.teacher_note} 
                        isPending={false} 
                        score={submission.score}
                    />
                )}

                {/* Submission Section */}
                <SubmissionArea 
                    submission={submission}
                    onSubmit={handleSubmission}
                    loading={submitLoading}
                />

                {/* Reflection CTA */}
                <button className="w-full flex items-center justify-center gap-3 py-4 border border-outline-variant bg-surface-container-lowest rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95 mb-8 mt-8">
                    <Icon name="psychology" />
                    Fill Reflection
                </button>
            </div>
        </DashboardTemplate>
    );
}
