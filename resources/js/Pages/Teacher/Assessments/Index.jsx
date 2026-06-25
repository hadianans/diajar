import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssessmentFilterTabs from '@/Components/features/teacher-assessments/AssessmentFilterTabs';
import AssessmentCard from '@/Components/features/teacher-assessments/AssessmentCard';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function Index() {
    const { data: assessments, loading } = useApiGet('/assessments');

    const handleCreate = () => {
        router.visit(route('teacher.assessments.create'));
    };

    const customTitleSection = (
        <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Assessments</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Design and track student performance evaluations.</p>
        </div>
    );

    const actions = (
        <button 
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
            <Icon name="add" />
            Create Assessment
        </button>
    );

    const calculateTimeRemaining = (dueDate) => {
        if (!dueDate) return null;
        const diff = moment(dueDate).diff(moment(), 'minutes');
        if (diff <= 0) return null;
        if (diff > 24 * 60) return `${Math.floor(diff / (24 * 60))}d remaining`;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    return (
        <DashboardTemplate role="teacher" activeTab="assessments" customTitle={customTitleSection} actions={actions}>
            <Head title="Assessments | Diajar LMS" />
            
            <AssessmentFilterTabs />
            
            {/* Secondary Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-lg">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
                    <button className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap">All Chapters</button>
                </div>
                
                <div className="flex items-center gap-2 self-end">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
                    <button className="flex items-center gap-2 bg-white border border-outline-variant px-3 py-1.5 rounded-lg font-label-sm text-label-sm text-on-surface hover:border-primary transition-colors">
                        Newest
                        <Icon name="expand_more" className="text-[18px]" />
                    </button>
                </div>
            </div>

            {/* Assessment Grid */}
            {loading ? (
                <div className="text-center py-12 text-on-surface-variant">Loading assessments...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    {assessments && assessments.length > 0 ? (
                        assessments.map(a => (
                            <AssessmentCard 
                                key={a.id}
                                id={a.id.toString()}
                                title={a.title}
                                chapter={a.chapter?.name || "Uncategorized"}
                                state={a.lifecycle_status}
                                classAvg={a.avg_score ? `${a.avg_score}%` : "-"}
                                participationCompleted={a.attempt_count || 0}
                                participationTotal={30} // mocked class total
                                duration={a.duration || 0}
                                questionsCount={a.question_count || 0}
                                timeRemaining={a.lifecycle_status === 'active' ? calculateTimeRemaining(a.due_date) : null}
                                progressPercentage={a.attempt_count ? (a.attempt_count / 30) * 100 : 0}
                            />
                        ))
                    ) : (
                        <div className="col-span-full p-8 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                            You have no assessments.
                        </div>
                    )}
                </div>
            )}
            
        </DashboardTemplate>
    );
}
