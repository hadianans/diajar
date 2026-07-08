import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssessmentStatsGrid from '@/Components/features/student-assessments/AssessmentStatsGrid';
import useApiGet from '@/hooks/useApiGet';

export default function Show({ assessmentId }) {
    const { data: responseData, loading } = useApiGet(`/assessments/${assessmentId}`);

    const assessmentData = useMemo(() => {
        if (!responseData || !responseData.assessment) return null;

        const { assessment, attempts_used, latest_attempt } = responseData;

        let status = 'Upcoming';
        if (latest_attempt) {
            status = latest_attempt.status === 'progress' ? 'In Progress' : 'Completed';
        } else if (assessment.due_date && new Date(assessment.due_date) < new Date()) {
            status = 'Overdue';
        } else if (assessment.start_date && new Date(assessment.start_date) > new Date()) {
            status = 'Locked';
        }

        return {
            id: assessment.id,
            subject: assessment.chapter?.name || 'Assessment',
            title: assessment.title,
            status: status,
            deadline: assessment.due_date ? new Date(assessment.due_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'No deadline',
            description: assessment.description || 'No description provided.',
            stats: [
                { icon: 'timer', value: assessment.duration_minutes ? `${assessment.duration_minutes} mins` : 'Untimed', label: 'Time Limit' },
                { icon: 'history', value: `${attempts_used} of ${assessment.max_attempts || '∞'}`, label: 'Attempts Used' },
                { icon: 'stars', value: latest_attempt?.grade !== undefined && latest_attempt?.grade !== null ? latest_attempt.grade : '--', label: 'Latest Score' }
            ],
            reflectionGoals: [
                { label: 'Refresh knowledge and identify gaps' },
                { label: 'Achieve a high score' }
            ],
            canStart: (attempts_used < (assessment.max_attempts || 999)) && (!assessment.start_date || new Date(assessment.start_date) <= new Date()) && (!assessment.due_date || new Date(assessment.due_date) >= new Date())
        };
    }, [responseData]);

    if (loading) {
        return (
            <DashboardTemplate activeTab="tasks" title="Loading..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Loading assessment details...</div>
            </DashboardTemplate>
        );
    }

    if (!assessmentData) {
        return (
            <DashboardTemplate activeTab="tasks" title="Not Found" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Assessment not found.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate
            activeTab="tasks"
            title="Diajar"
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title="Assessment View - Diajar" />

            <div className="px-margin-mobile mt-6 max-w-3xl mx-auto space-y-stack-lg pb-32">
                {/* Header Section */}
                <section className="space-y-stack-sm">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                            {assessmentData.status}
                        </span>
                        <span className="font-label-md text-label-md text-outline">{assessmentData.subject}</span>
                    </div>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
                        {assessmentData.title}
                    </h2>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                        <Icon name="event" className="text-[18px]" />
                        <p className="font-body-md text-body-md">Deadline: <span className="font-semibold text-primary">{assessmentData.deadline}</span></p>
                    </div>
                </section>

                {/* Visual Anchor (Atmospheric Banner) */}
                {/* <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center p-6">
                        <div className="p-3 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-white/40">
                            <Icon name="science" className="text-primary scale-125" style={{ fontVariationSettings: "'FILL' 1" }} />
                        </div>
                    </div>
                </div> */}

                {/* Description Section */}
                <section className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
                    <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed" dangerouslySetInnerHTML={{ __html: assessmentData.description }} />
                </section>

                {/* Assessment Details Grid */}
                <AssessmentStatsGrid stats={assessmentData.stats} />

                {/* Page-integrated Actions */}
                <div className="pt-4 flex items-center gap-4">
                    {assessmentData.canStart ? (
                        <Link
                            href={route('student.assessments.attempt', { assessmentId })}
                            className="w-full bg-primary hover:bg-primary-container text-on-primary py-4 px-6 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            <span>Start Assessment</span>
                            <Icon name="play_arrow" className="text-[20px]" />
                        </Link>
                    ) : (
                        <div className="w-full bg-surface-container text-on-surface-variant py-4 px-6 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 text-center opacity-70">
                            <span>Assessment Unavailable</span>
                        </div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
