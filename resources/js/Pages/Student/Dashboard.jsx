import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import WeeklyCalendar from '@/Components/features/student-dashboard/WeeklyCalendar';
import TargetTaskCard from '@/Components/features/student-dashboard/TargetTaskCard';
import ProgressAnalytics from '@/Components/features/student-dashboard/ProgressAnalytics';
import ReflectionCard from '@/Components/features/student-dashboard/ReflectionCard';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function Dashboard() {
    const { data, loading } = useApiGet('/dashboard');

    const calendarDates = data?.calendar_dates || [];
    const plans = data?.plans || [];
    const reflectionsData = data?.reflections || [];

    const calendarDays = useMemo(() => {
        const days = [];
        const today = moment().startOf('day');
        // Let's create a simplified week view for now (Mon - Sun of current week)
        const startOfWeek = moment().startOf('isoWeek');
        for (let i = 0; i < 7; i++) {
            const date = startOfWeek.clone().add(i, 'days');
            const hasTask = calendarDates.includes(date.format('YYYY-MM-DD'));
            days.push({
                day: date.format('dd')[0], // M, T, W...
                date: date.date(),
                isToday: date.isSame(today, 'day'),
                hasTask: hasTask,
                taskColor: hasTask ? 'bg-secondary' : ''
            });
        }
        return days;
    }, [calendarDates]);

    const targetTasks = useMemo(() => {
        return plans.map(p => ({
            id: p.id,
            title: p.title,
            type: 'Material', // Defaulting to material for now
            dueDate: moment(p.target_date).format('MMM D, YYYY'),
            description: p.description || 'Focus on completing this target.',
            isUrgent: moment(p.target_date).isSameOrBefore(moment().add(1, 'days')) && p.progress < 100
        }));
    }, [plans]);

    const reflections = useMemo(() => {
        return reflectionsData.map(r => ({
            id: r.id,
            title: r.title,
            subject: 'Reflection',
            date: moment(r.created_at).format('MMM D'),
            content: r.content,
            isStale: moment().diff(moment(r.created_at), 'days') > 7
        }));
    }, [reflectionsData]);

    const comprehension = useMemo(() => {
        const dist = data?.comprehension_distribution || {};
        let total = 0;
        let strong = 0;
        let good = 0;
        let fair = 0;
        let needsWork = 0;

        Object.keys(dist).forEach(level => {
            const count = parseInt(dist[level], 10);
            total += count;
            if (level == 5 || level == 4) strong += count;
            else if (level == 3) good += count;
            else if (level == 2) fair += count;
            else if (level == 1) needsWork += count;
        });

        if (total === 0) return { strong: 0, good: 0, fair: 0, needsWork: 0 };

        return {
            strong: Math.round((strong / total) * 100),
            good: Math.round((good / total) * 100),
            fair: Math.round((fair / total) * 100),
            needsWork: Math.round((needsWork / total) * 100)
        };
    }, [data?.comprehension_distribution]);

    const urgentCount = targetTasks.filter(t => t.isUrgent).length;

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Learning Hub</h2>
            <p className="text-body-md text-on-surface-variant">Your personal control center for growth.</p>
        </section>
    );

    if (loading) {
        return (
            <DashboardTemplate role="student" activeTab="dashboard" title="Mindful Growth">
                <div className="flex justify-center p-12 text-on-surface-variant">Loading dashboard data...</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate 
            activeTab="Dashboard"
            title="Mindful Growth"
            headerSection={headerSection}
            showBack={false}
        >
            <Head title="Student Dashboard - Diajar" />

            <div className="flex flex-col gap-stack-lg pb-12">
                {/* Calendar */}
                <WeeklyCalendar days={calendarDays} />

                {/* Target Learning List */}
                <section className="flex flex-col gap-stack-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-headline-md font-headline-md text-on-surface">Target Learning</h3>
                        {urgentCount > 0 && (
                            <span className="text-label-sm font-label-sm text-error bg-error-container px-2 py-0.5 rounded-full">
                                {urgentCount} Urgent
                            </span>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-stack-sm">
                        {targetTasks.length > 0 ? targetTasks.map(task => (
                            <TargetTaskCard key={task.id} {...task} />
                        )) : (
                            <div className="text-on-surface-variant text-sm p-4 bg-surface-container rounded-xl">No active learning targets.</div>
                        )}
                    </div>
                </section>

                {/* Progress Analytics */}
                <ProgressAnalytics comprehension={comprehension} targetHistory={data?.plans ? data.plans.map(p => p.progress).slice(-5) : [0,0,0,0,0]} />

                {/* Reflection Section */}
                <section className="flex flex-col gap-stack-md mb-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-headline-md font-headline-md text-on-surface">Growth Journal</h3>
                        <div className="flex gap-2">
                            <button className="text-on-surface-variant p-2 hover:bg-surface-container-high rounded-full transition-colors">
                                <Icon name="search" />
                            </button>
                            <button className="text-on-surface-variant p-2 hover:bg-surface-container-high rounded-full transition-colors">
                                <Icon name="filter_list" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-stack-sm">
                        {reflections.length > 0 ? reflections.map(ref => (
                            <ReflectionCard key={ref.id} {...ref} />
                        )) : (
                            <div className="text-on-surface-variant text-sm p-4 bg-surface-container rounded-xl">No past reflections.</div>
                        )}
                    </div>
                </section>
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all duration-150 z-50 hover:bg-primary-container hover:text-on-primary-container">
                <Icon name="edit_note" className="text-[32px]" />
            </button>
        </DashboardTemplate>
    );
}
