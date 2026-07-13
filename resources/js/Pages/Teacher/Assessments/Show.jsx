import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssessmentStatsBento from '@/Components/features/teacher-assessments/AssessmentStatsBento';
import HorizontalGradeChart from '@/Components/features/teacher-assessments/HorizontalGradeChart';
import StudentAttemptsTable from '@/Components/features/teacher-assessments/StudentAttemptsTable';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError, confirmDelete } from '@/utils/swal';
import moment from 'moment';

export default function Show({ assessmentId }) {
    const { data: assessment, loading } = useApiGet(`/assessments/${assessmentId}`);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleBack = () => router.visit(route('teacher.assessments.index'));

    const handleDelete = async () => {
        const confirmed = await confirmDelete('Delete Assessment?', 'This action cannot be undone.');
        if (!confirmed) return;
        setIsDeleting(true);
        try {
            await api.delete(`/assessments/${assessmentId}`);
            router.visit(route('teacher.assessments.index'));
        } catch (err) {
            showError('Error', err.response?.data?.message || 'Error deleting assessment');
            setIsDeleting(false);
        }
    };

    const headerSection = (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                    {assessment?.title || 'Assessment Detail'}
                </h2>
                {assessment && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">{assessment.chapter?.name || 'Uncategorized'}</span>
                        <span className="text-on-surface-variant font-label-md text-label-md">• {assessment.duration} min</span>
                        <span className="text-on-surface-variant font-label-md text-label-md">• {assessment.questions?.length || 0} Questions</span>
                    </div>
                )}
            </div>
            {assessment && (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 bg-error-container text-on-error-container px-5 py-3 rounded-lg font-label-md text-label-md hover:bg-error hover:text-on-error active:scale-95 transition-all shadow-sm disabled:opacity-50"
                    >
                        <Icon name="delete" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button 
                        onClick={() => router.visit(route('teacher.assessments.edit', { assessmentId: assessment.id }))}
                        className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-md"
                    >
                        <Icon name="edit" />
                        Edit Assessment
                    </button>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection} showBack={true} onBack={handleBack}>
                <Head title="Assessment Detail | Diajar LMS" />
                <div className="text-center py-12 text-on-surface-variant">Loading assessment...</div>
            </DashboardTemplate>
        );
    }

    if (!assessment) {
        return (
            <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection} showBack={true} onBack={handleBack}>
                <Head title="Assessment Not Found | Diajar LMS" />
                <div className="text-center py-12 text-on-surface-variant">Assessment not found.</div>
            </DashboardTemplate>
        );
    }

    const totalStudents = assessment.total_students || 0;

    const chartData = [
        { label: '90-100 (A)', count: assessment.grade_distribution?.['90-100'] || 0, countLabel: `${assessment.grade_distribution?.['90-100'] || 0} students`, colorClass: 'bg-secondary', percentage: totalStudents > 0 ? ((assessment.grade_distribution?.['90-100'] || 0) / totalStudents) * 100 : 0 },
        { label: '80-89 (B)', count: assessment.grade_distribution?.['80-89'] || 0, countLabel: `${assessment.grade_distribution?.['80-89'] || 0} students`, colorClass: 'bg-primary', percentage: totalStudents > 0 ? ((assessment.grade_distribution?.['80-89'] || 0) / totalStudents) * 100 : 0 },
        { label: '70-79 (C)', count: assessment.grade_distribution?.['70-79'] || 0, countLabel: `${assessment.grade_distribution?.['70-79'] || 0} students`, colorClass: 'bg-primary-fixed-dim', percentage: totalStudents > 0 ? ((assessment.grade_distribution?.['70-79'] || 0) / totalStudents) * 100 : 0 },
        { label: '<70 (F)', count: (assessment.grade_distribution?.['0-49'] || 0) + (assessment.grade_distribution?.['50-59'] || 0) + (assessment.grade_distribution?.['60-69'] || 0), countLabel: `${(assessment.grade_distribution?.['0-49'] || 0) + (assessment.grade_distribution?.['50-59'] || 0) + (assessment.grade_distribution?.['60-69'] || 0)} students`, colorClass: 'bg-error', percentage: totalStudents > 0 ? (((assessment.grade_distribution?.['0-49'] || 0) + (assessment.grade_distribution?.['50-59'] || 0) + (assessment.grade_distribution?.['60-69'] || 0)) / totalStudents) * 100 : 0 },
    ];

    const studentAttempts = (assessment.attempts || []).map(att => ({
        studentId: att.student?.id,
        name: att.student?.full_name || att.student?.username || 'Unknown',
        initials: (att.student?.full_name || att.student?.username || 'U').substring(0, 2).toUpperCase(),
        status: att.status === 'graded' ? 'Submitted' : att.status === 'submitted' ? 'Submitted' : 'In Progress',
        timeText: att.completed_at ? `${moment(att.completed_at).diff(moment(att.started_at), 'minutes')}m` : 'In Progress',
        score: att.grade,
        avatar: att.student?.picture
    }));

    return (
        <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection} showBack={true} onBack={handleBack}>
            <Head title={`${assessment.title} | Diajar LMS`} />

            <div className="space-y-stack-lg max-w-7xl mx-auto pb-24">
                {/* Description */}
                {assessment.description && (
                    <p className="text-on-surface-variant font-body-md max-w-2xl">{assessment.description}</p>
                )}

                <AssessmentStatsBento 
                    attemptsCompleted={assessment.attempts_submitted || 0}
                    attemptsTotal={totalStudents || 1}
                    avgScore={assessment.avg_score || 0}
                    avgChange={0}
                    high={assessment.highest || 0}
                    low={assessment.lowest || 0}
                    passRate={assessment.pass_rate || 0}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    <HorizontalGradeChart data={chartData} />

                    {/* Assessment Info Panel */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                        <h3 className="font-headline-md text-headline-md mb-4 flex items-center gap-2">
                            <Icon name="info" className="text-primary" />
                            Assessment Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                <span className="text-on-surface-variant font-label-sm">Duration</span>
                                <span className="font-label-md text-on-surface">{assessment.duration} min</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                <span className="text-on-surface-variant font-label-sm">Max Attempts</span>
                                <span className="font-label-md text-on-surface">{assessment.max_attempts}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                <span className="text-on-surface-variant font-label-sm">Pass Threshold</span>
                                <span className="font-label-md text-on-surface">{assessment.pass_threshold}%</span>
                            </div>
                            {assessment.start_date && (
                                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                                    <span className="text-on-surface-variant font-label-sm">Start</span>
                                    <span className="font-label-md text-on-surface">{moment(assessment.start_date).format('MMM D, YYYY h:mm A')}</span>
                                </div>
                            )}
                            {assessment.due_date && (
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-on-surface-variant font-label-sm">Due</span>
                                    <span className="font-label-md text-on-surface">{moment(assessment.due_date).format('MMM D, YYYY h:mm A')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <StudentAttemptsTable assessmentId={assessment.id} attempts={studentAttempts} />
            </div>
        </DashboardTemplate>
    );
}
