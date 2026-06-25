import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssessmentStatsBento from '@/Components/features/teacher-assessments/AssessmentStatsBento';
import HorizontalGradeChart from '@/Components/features/teacher-assessments/HorizontalGradeChart';
import HardestQuestionsList from '@/Components/features/teacher-assessments/HardestQuestionsList';
import StudentAttemptsTable from '@/Components/features/teacher-assessments/StudentAttemptsTable';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function Show({ assessmentId }) {
    const { data: assessment, loading } = useApiGet(`/assessments/${assessmentId}`);
    
    const customTitleSection = (
        <div className="flex items-center gap-4">
            <button 
                onClick={() => router.visit(route('teacher.assessments.index'))}
                className="text-primary hover:bg-surface-container-highest transition-colors rounded-full p-2 active:scale-95"
            >
                <Icon name="arrow_back" />
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">Assessment Detail</h1>
        </div>
    );

    const actions = (
        <button className="text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full p-2 active:scale-95">
            <Icon name="more_vert" />
        </button>
    );

    if (loading) {
        return (
            <DashboardTemplate role="teacher" customTitle={customTitleSection} actions={actions}>
                <div className="text-center py-12 text-on-surface-variant">Loading assessment...</div>
            </DashboardTemplate>
        );
    }

    if (!assessment) {
        return (
            <DashboardTemplate role="teacher" customTitle={customTitleSection} actions={actions}>
                <div className="text-center py-12 text-on-surface-variant">Assessment not found.</div>
            </DashboardTemplate>
        );
    }

    const totalStudents = assessment.total_students || 30; // Fallback

    const chartData = [
        { label: '90-100 (A)', count: assessment.grade_distribution?.['90-100'] || 0, countLabel: `${assessment.grade_distribution?.['90-100'] || 0} students`, colorClass: 'bg-secondary', percentage: ((assessment.grade_distribution?.['90-100'] || 0) / totalStudents) * 100 },
        { label: '80-89 (B)', count: assessment.grade_distribution?.['80-89'] || 0, countLabel: `${assessment.grade_distribution?.['80-89'] || 0} students`, colorClass: 'bg-primary', percentage: ((assessment.grade_distribution?.['80-89'] || 0) / totalStudents) * 100 },
        { label: '70-79 (C)', count: assessment.grade_distribution?.['70-79'] || 0, countLabel: `${assessment.grade_distribution?.['70-79'] || 0} students`, colorClass: 'bg-primary-fixed-dim', percentage: ((assessment.grade_distribution?.['70-79'] || 0) / totalStudents) * 100 },
        { label: '<70 (F)', count: (assessment.grade_distribution?.['0-49'] || 0) + (assessment.grade_distribution?.['50-59'] || 0) + (assessment.grade_distribution?.['60-69'] || 0), countLabel: `${(assessment.grade_distribution?.['0-49'] || 0) + (assessment.grade_distribution?.['50-59'] || 0) + (assessment.grade_distribution?.['60-69'] || 0)} students`, colorClass: 'bg-error', percentage: (((assessment.grade_distribution?.['0-49'] || 0) + (assessment.grade_distribution?.['50-59'] || 0) + (assessment.grade_distribution?.['60-69'] || 0)) / totalStudents) * 100 },
    ];

    const hardestQuestions = [
        // Mock data since question performance isn't fully aggregated in API yet
        { id: 12, text: 'Explain the process of meiosis and its role in genetic variation...', difficulty: 'Hard', difficultyColorClass: 'text-error bg-error-container/20', avatarColorClass: 'bg-error-container text-on-error-container', correctPercentage: 42 },
        { id: 5, text: 'What are the three components of a DNA nucleotide?', difficulty: 'Medium', difficultyColorClass: 'text-tertiary bg-tertiary-fixed/20', avatarColorClass: 'bg-tertiary-fixed text-on-tertiary-fixed', correctPercentage: 55 },
        { id: 28, text: 'Calculate the probability of a recessive phenotype in a...', difficulty: 'Medium', difficultyColorClass: 'text-tertiary bg-tertiary-fixed/20', avatarColorClass: 'bg-tertiary-fixed text-on-tertiary-fixed', correctPercentage: 61 },
    ];

    const studentAttempts = (assessment.attempts || []).map(att => ({
        studentId: att.student.id,
        name: att.student.full_name || att.student.username,
        initials: (att.student.full_name || att.student.username).substring(0, 2).toUpperCase(),
        status: att.status,
        timeText: att.completed_at ? `${moment(att.completed_at).diff(moment(att.started_at), 'minutes')}m` : 'In Progress',
        score: att.grade,
        avatar: att.student.picture
    }));

    return (
        <DashboardTemplate role="teacher" activeTab="assessments" customTitle={customTitleSection} actions={actions}>
            <Head title={`Assessment ${assessment.title || 'Details'} | Diajar LMS`} />

            <div className="space-y-stack-lg max-w-7xl mx-auto pb-24 pt-4">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
                    <div>
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">{assessment.title}</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">{assessment.chapter?.name || 'Uncategorized'}</span>
                            <span className="text-on-surface-variant font-label-md text-label-md">• {assessment.duration} min</span>
                            <span className="text-on-surface-variant font-label-md text-label-md">• {assessment.questions?.length || 0} Questions</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => router.visit(route('teacher.assessments.edit', { assessmentId: assessment.id }))}
                        className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-md"
                    >
                        <Icon name="edit" filled />
                        Edit Assessment
                    </button>
                </section>

                <AssessmentStatsBento 
                    attemptsCompleted={assessment.attempts_submitted || 0}
                    attemptsTotal={totalStudents}
                    avgScore={assessment.avg_score || 0}
                    avgChange={0} // Not available
                    high={assessment.highest || 0}
                    low={assessment.lowest || 0}
                    passRate={assessment.pass_rate || 0}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    <HorizontalGradeChart data={chartData} />
                    <HardestQuestionsList questions={hardestQuestions} />
                </div>

                <StudentAttemptsTable assessmentId={assessment.id} attempts={studentAttempts} />

            </div>
        </DashboardTemplate>
    );
}
