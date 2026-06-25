import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

// Feature Components
import ActionRequiredCard from '@/Components/features/teacher-dashboard/ActionRequiredCard';
import ClassHealthMetrics from '@/Components/features/teacher-dashboard/ClassHealthMetrics';
import RecentActivityList from '@/Components/features/teacher-dashboard/RecentActivityList';
import SRLEngagementCard from '@/Components/features/teacher-dashboard/SRLEngagementCard';
import ChapterProgressList from '@/Components/features/teacher-dashboard/ChapterProgressList';
import UpcomingDeadlines from '@/Components/features/teacher-dashboard/UpcomingDeadlines';

export default function Homepage() {
    const { data: dashboardData, loading } = useApiGet('/dashboard');

    const summary = dashboardData || {};
    
    // Parse the data
    const ungradedCount = summary.pending_actions?.ungraded_submissions || 0;
    const reviewCount = summary.pending_actions?.pending_attempts || 0;
    
    const avgAssignment = summary.class_health?.avg_assignment_grade || 0;
    const avgAssessment = summary.class_health?.avg_assessment_score || 0;
    const avgOverall = (avgAssignment + avgAssessment) / (avgAssignment > 0 && avgAssessment > 0 ? 2 : 1);

    const activePlans = summary.srl_snapshot?.active_plans || 0;
    const newReflections = summary.srl_snapshot?.new_reflections || 0;

    const chapters = (summary.chapter_progress || []).map(ch => ({
        title: ch.name,
        progress: ch.completion
    }));

    const deadlines = [];
    if (summary.upcoming_deadlines?.assignment) {
        deadlines.push({
            title: summary.upcoming_deadlines.assignment.title,
            date: `Due ${moment(summary.upcoming_deadlines.assignment.due_date).format('MMM D')}`,
            isUrgent: moment(summary.upcoming_deadlines.assignment.due_date).isSameOrBefore(moment().add(2, 'days'))
        });
    }
    if (summary.upcoming_deadlines?.assessment) {
        deadlines.push({
            title: summary.upcoming_deadlines.assessment.title,
            date: `Due ${moment(summary.upcoming_deadlines.assessment.due_date).format('MMM D')}`,
            isUrgent: moment(summary.upcoming_deadlines.assessment.due_date).isSameOrBefore(moment().add(2, 'days'))
        });
    }

    const headerSection = (
        <section className="mb-stack-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                    <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Teacher Dashboard</h2>
                    <p className="text-on-surface-variant font-body-md">Overview of your classes and tasks</p>
                </div>
                <div className="hidden md:flex bg-primary-container/10 px-4 py-2 rounded-xl border border-primary-container/20 items-center gap-2">
                    <Icon name="event_note" className="text-primary" />
                    <span className="text-primary font-label-md">{moment().format('dddd, MMM Do')}</span>
                </div>
            </div>
        </section>
    );

    if (loading) {
        return (
            <DashboardTemplate role="teacher" activeTab="home" title="Dashboard">
                <div className="flex justify-center p-12 text-on-surface-variant">Loading dashboard data...</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="home"
            title="Dashboard"
            headerSection={headerSection}
        >
            <Head title="Teacher Dashboard | Diajar LMS" />
            
            <div className="max-w-[1280px] mx-auto pb-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Left Column: Pending Actions & Class Health */}
                    <div className="md:col-span-8 flex flex-col gap-gutter">
                        <ActionRequiredCard ungradedCount={ungradedCount} reviewCount={reviewCount} />
                        <ClassHealthMetrics completion={Math.round(avgOverall)} avgGrade={avgAssignment} avgScore={avgAssessment} />
                        {/* Mock Recent Activity since it's not in the API yet */}
                        <RecentActivityList activities={[
                            { studentName: 'System', action: 'Dashboard loaded', time: 'Just now', type: 'Info', icon: 'info', iconBg: 'bg-surface-container', iconColor: 'text-on-surface-variant' }
                        ]} />
                    </div>

                    {/* Right Column: SRL, Progress, Deadlines */}
                    <div className="md:col-span-4 flex flex-col gap-gutter">
                        <SRLEngagementCard activePlans={activePlans} newReflections={newReflections} avgComprehension={0} />
                        <ChapterProgressList chapters={chapters} />
                        <UpcomingDeadlines deadlines={deadlines} />
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    );
}
