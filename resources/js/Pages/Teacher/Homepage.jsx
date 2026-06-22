import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';

// Feature Components
import ActionRequiredCard from '@/Components/features/teacher-dashboard/ActionRequiredCard';
import ClassHealthMetrics from '@/Components/features/teacher-dashboard/ClassHealthMetrics';
import RecentActivityList from '@/Components/features/teacher-dashboard/RecentActivityList';
import SRLEngagementCard from '@/Components/features/teacher-dashboard/SRLEngagementCard';
import ChapterProgressList from '@/Components/features/teacher-dashboard/ChapterProgressList';
import UpcomingDeadlines from '@/Components/features/teacher-dashboard/UpcomingDeadlines';

// Mock Data
const mockActivities = [
    { studentName: 'Alex Johnson', action: 'submitted Genetics Lab Report', time: '2h ago', type: 'Assignment', icon: 'lab_profile', iconBg: 'bg-secondary-container', iconColor: 'text-on-secondary-container' },
    { studentName: 'Maria Garcia', action: 'completed Photosynthesis Module', time: '4h ago', type: 'Learning Path', icon: 'menu_book', iconBg: 'bg-primary-container', iconColor: 'text-white' },
    { studentName: 'Liam Chen', action: 'submitted Biology Quiz', time: '6h ago', type: 'Assessment', icon: 'quiz', iconBg: 'bg-tertiary-container', iconColor: 'text-white' }
];

const mockChapters = [
    { title: 'Chapter 3: Cell Structure', progress: 85 },
    { title: 'Chapter 4: Metabolism', progress: 40 }
];

const mockDeadlines = [
    { title: 'Final Lab Report', date: 'Due Oct 30', isUrgent: true },
    { title: 'Evolution Quiz', date: 'Due Nov 2', isUrgent: false }
];

export default function Homepage() {
    const headerSection = (
        <section className="mb-stack-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                    <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Good Morning, Sarah!</h2>
                    <p className="text-on-surface-variant font-body-md">Academic Year: 2023/2024 • Academic Portal</p>
                </div>
                <div className="hidden md:flex bg-primary-container/10 px-4 py-2 rounded-xl border border-primary-container/20 items-center gap-2">
                    <Icon name="event_note" className="text-primary" />
                    <span className="text-primary font-label-md">Monday, Oct 23rd</span>
                </div>
            </div>
        </section>
    );

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="home"
            title="Biology - Class 11A"
            headerSection={headerSection}
        >
            <Head title="Teacher Dashboard | Diajar LMS" />
            
            <div className="max-w-[1280px] mx-auto pb-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Left Column: Pending Actions & Class Health */}
                    <div className="md:col-span-8 flex flex-col gap-gutter">
                        <ActionRequiredCard ungradedCount={12} reviewCount={5} />
                        <ClassHealthMetrics completion={78} avgGrade={82} avgScore={75} />
                        <RecentActivityList activities={mockActivities} />
                    </div>

                    {/* Right Column: SRL, Progress, Deadlines */}
                    <div className="md:col-span-4 flex flex-col gap-gutter">
                        <SRLEngagementCard activePlans={24} newReflections={18} avgComprehension={4.2} />
                        <ChapterProgressList chapters={mockChapters} />
                        <UpcomingDeadlines deadlines={mockDeadlines} />
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    );
}
