import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssignmentRubric from '@/Components/features/student-assignments/AssignmentRubric';
import TeacherFeedback from '@/Components/features/student-assignments/TeacherFeedback';
import SubmissionCard from '@/Components/features/student-assignments/SubmissionCard';
import ReflectionForm from '@/Components/features/reflections/ReflectionForm';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';

export default function Show({ assignmentId }) {
    const { data: responseData, loading, setData } = useApiGet(`/assignments/${assignmentId}`);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isSavingReflection, setIsSavingReflection] = useState(false);

    // Reflection API
    const { data: reflectionsData, refetch: refetchReflections } = useApiGet('/reflections');

    const existingReflection = useMemo(() => {
        if (!reflectionsData) return null;
        return reflectionsData.find(ref =>
            ref.reflectables?.some(r => r.reflectable_type === 'App\\Models\\ClassAssignment' && r.reflectable_id === parseInt(assignmentId))
        );
    }, [reflectionsData, assignmentId]);

    const reflectionInitialData = useMemo(() => {
        if (!existingReflection) return null;
        let emotions = [];
        try {
            emotions = typeof existingReflection.emotions === 'string'
                ? JSON.parse(existingReflection.emotions)
                : (existingReflection.emotions || []);
        } catch (e) {
            emotions = [];
        }
        return { ...existingReflection, emotions };
    }, [existingReflection]);

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

    const rubrics = assignment.rubric?.criteria?.map(c => {
        const studentScore = submission?.rubric_points?.find(p => p.class_rubric_criterion_id === c.id)?.score;
        return {
            id: c.id,
            title: c.title,
            description: c.description,
            weight: c.weight,
            score: studentScore,
            levels: c.levels || []
        };
    }) || [];

    const handleSubmission = async (formData) => {
        setSubmitLoading(true);
        try {
            if (submission && submission.status === 'submitted') {
                formData.append('_method', 'PATCH');
                await api.post(`/assignments/${assignmentId}/submission`, formData);
            } else {
                await api.post(`/assignments/${assignmentId}/submit`, formData);
            }
            window.location.reload(); 
        } catch (error) {
            console.error('Error submitting assignment:', error);
            alert('Failed to submit assignment. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleSaveReflection = async (data) => {
        setIsSavingReflection(true);
        try {
            if (existingReflection) {
                await api.put(`/reflections/${existingReflection.id}`, {
                    title: `Reflection: ${assignment.title}`,
                    content: data.content,
                    comprehension_level: data.comprehension_level,
                    emotions: data.emotions,
                });
            } else {
                await api.post('/reflections', {
                    title: `Reflection: ${assignment.title}`,
                    content: data.content,
                    comprehension_level: data.comprehension_level,
                    emotions: data.emotions,
                    reflectable_id: parseInt(assignmentId),
                    reflectable_type: 'App\\Models\\ClassAssignment'
                });
            }
            alert('Reflection saved!');
            refetchReflections();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to save reflection.');
        } finally {
            setIsSavingReflection(false);
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

            <div className="px-margin-mobile mt-stack-md mx-auto max-w-7xl pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Assignment Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Assignment Header */}
                        <section className="space-y-4">
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
                            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md border-b border-outline-variant/30 pb-4">
                                <Icon name="event" className="text-[18px]" />
                                <span>{assignment.due_date ? `Due ${new Date(assignment.due_date).toLocaleString()}` : 'No due date'}</span>
                            </div>
                        </section>

                        {/* Task Description */}
                        <section className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: assignment.description }} />
                        </section>

                        {/* Assessment Rubric */}
                        {rubrics.length > 0 && (
                            <div className="pt-4 border-t border-outline-variant/30">
                                <AssignmentRubric rubrics={rubrics} />
                            </div>
                        )}
                        
                        {/* Grading & Feedback */}
                        {(submission?.status === 'graded' || submission?.status === 'submitted') && (
                            <div className="pt-4 border-t border-outline-variant/30">
                                <TeacherFeedback 
                                    feedback={submission.feedback} 
                                    isPending={submission.status === 'submitted'} 
                                    grade={submission.grade}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Submission Card & Reflection */}
                    <div className="lg:col-span-1 space-y-6">
                        <SubmissionCard 
                            submission={submission}
                            onSubmit={handleSubmission}
                            loading={submitLoading}
                            reflectionInitialData={reflectionInitialData}
                            onSaveReflection={handleSaveReflection}
                            isSavingReflection={isSavingReflection}
                        />
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    );
}
