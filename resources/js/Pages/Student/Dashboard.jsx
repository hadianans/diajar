import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function Dashboard() {
    const { data, loading } = useApiGet('/dashboard');

    const upcomingPlans = data?.upcoming_plans || [];
    const stats = data?.weekly_stats || { total: 0, completed: 0, progress: 0 };
    const pendingReflections = data?.pending_reflections || [];
    const lmsProgress = data?.lms_progress || { material: 0, assignment: 0, assessment: 0 };
    
    // Process comprehension distribution
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

        if (total === 0) return { total: 0, strong: 0, good: 0, fair: 0, needsWork: 0 };

        return {
            total,
            strong: Math.round((strong / total) * 100),
            good: Math.round((good / total) * 100),
            fair: Math.round((fair / total) * 100),
            needsWork: Math.round((needsWork / total) * 100)
        };
    }, [data?.comprehension_distribution]);

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Learning Hub</h2>
            <p className="text-body-md text-on-surface-variant">Your personal snapshot for planning, monitoring, and reflection.</p>
        </section>
    );

    if (loading) {
        return (
            <DashboardTemplate role="student" activeTab="dashboard" title="Learning Hub">
                <div className="flex justify-center p-12 text-on-surface-variant">Loading hub data...</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate 
            role="student"
            activeTab="dashboard"
            title="Learning Hub"
            headerSection={headerSection}
            showBack={false}
        >
            <Head title="Student Hub - Diajar" />

            {/* CSS Grid for Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter pb-12 items-start">
                
                {/* COLUMN 1: Monitoring Snapshot */}
                <div className="flex flex-col gap-stack-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-headline-md font-headline-md text-on-surface">Monitoring Snapshot</h3>
                    </div>

                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-6">
                        
                        {/* Weekly Plans Progress */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-label-md font-label-md text-on-surface-variant mb-1">Weekly Plan Progress</p>
                                <p className="text-display-sm font-display-sm text-on-surface">
                                    {stats.completed} <span className="text-headline-sm text-on-surface-variant">/ {stats.total}</span>
                                </p>
                            </div>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-surface-container-high" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="text-primary transition-all duration-1000 ease-out" strokeDasharray={`${stats.progress}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-label-sm font-label-sm text-on-surface">{stats.progress}%</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-outline-variant/30" />

                        {/* Overall Completion */}
                        <div className="flex flex-col gap-3">
                            <p className="text-label-md font-label-md text-on-surface-variant">LMS Completion Rate</p>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Materials</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary transition-all" style={{width: `${lmsProgress.material}%`}}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.material}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Assignments</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-tertiary transition-all" style={{width: `${lmsProgress.assignment}%`}}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.assignment}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Assessments</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all" style={{width: `${lmsProgress.assessment}%`}}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.assessment}%</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-outline-variant/30" />

                        {/* Comprehension Distribution */}
                        <div className="flex flex-col gap-3">
                            <p className="text-label-md font-label-md text-on-surface-variant">Average Comprehension Stats</p>
                            {comprehension.total > 0 ? (
                                <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                                    <div className="bg-success" style={{ width: `${comprehension.strong}%` }} title={`Strong: ${comprehension.strong}%`}></div>
                                    <div className="bg-primary" style={{ width: `${comprehension.good}%` }} title={`Good: ${comprehension.good}%`}></div>
                                    <div className="bg-tertiary" style={{ width: `${comprehension.fair}%` }} title={`Fair: ${comprehension.fair}%`}></div>
                                    <div className="bg-error" style={{ width: `${comprehension.needsWork}%` }} title={`Needs Work: ${comprehension.needsWork}%`}></div>
                                </div>
                            ) : (
                                <p className="text-label-sm text-on-surface-variant italic">No reflections recorded yet.</p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-label-sm text-on-surface-variant mt-1">
                                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> Strong</div>
                                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Good</div>
                                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Fair</div>
                                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error"></span> Needs Work</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* COLUMN 2: Planning Snapshot */}
                <div className="flex flex-col gap-stack-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-headline-md font-headline-md text-on-surface">Up Next</h3>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => router.visit('/student/plans')}
                                className="text-primary font-label-md hover:underline"
                            >
                                View All
                            </button>
                            <button 
                                onClick={() => router.visit('/student/planner')}
                                className="text-primary font-label-md hover:underline"
                            >
                                + New
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        {upcomingPlans.length > 0 ? upcomingPlans.map(plan => (
                            <div key={plan.id} className="bg-surface-container-low p-4 rounded-xl flex justify-between items-center border border-outline-variant/30 group hover:border-primary/30 transition-all cursor-pointer" onClick={() => router.visit('/student/planner')}>
                                <div>
                                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{plan.title}</h4>
                                    <p className="text-label-md text-on-surface-variant flex items-center gap-1 mt-1">
                                        <Icon name="event" className="text-[16px]" />
                                        {moment(plan.target_date).format('MMM D, YYYY')}
                                    </p>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 text-primary hover:bg-primary-container rounded-full transition-all">
                                    <Icon name="edit" />
                                </button>
                            </div>
                        )) : (
                            <div className="text-on-surface-variant text-body-md p-6 bg-surface-container-low rounded-xl text-center border border-outline-variant/30">
                                Your schedule is clear. Take some time to plan your upcoming studies!
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 3: Reflection Prompts */}
                <div className="flex flex-col gap-stack-md xl:col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-headline-md font-headline-md text-on-surface">Reflection Queue</h3>
                        <button 
                            onClick={() => router.visit('/student/reflections')}
                            className="text-primary font-label-md hover:underline"
                        >
                            History
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {pendingReflections.length > 0 ? pendingReflections.map((ref, idx) => (
                            <div key={`${ref.type}-${ref.id}-${idx}`} className="bg-secondary-container/20 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-secondary-container">
                                <div>
                                    <h4 className="font-headline-sm text-headline-sm text-on-surface">How did you do on "{ref.title}"?</h4>
                                    <p className="text-label-md text-on-surface-variant mt-1">You recently completed this {ref.type}. Take a moment to reflect on your strategy and confidence.</p>
                                </div>
                                <button 
                                    onClick={() => router.visit(`/student/reflect?type=${ref.type}&id=${ref.id}`)}
                                    className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors whitespace-nowrap shadow-sm"
                                >
                                    Reflect
                                </button>
                            </div>
                        )) : (
                            <div className="text-on-surface-variant text-body-md p-6 bg-surface-container-low rounded-xl text-center border border-outline-variant/30 flex flex-col items-center gap-2">
                                <Icon name="done_all" className="text-primary text-[32px]" />
                                All caught up! No pending reflections.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </DashboardTemplate>
    );
}
