import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import WeeklyCalendar from '@/Components/features/student-dashboard/WeeklyCalendar';
import TargetTaskCard from '@/Components/features/student-dashboard/TargetTaskCard';
import ProgressAnalytics from '@/Components/features/student-dashboard/ProgressAnalytics';
import ReflectionCard from '@/Components/features/student-dashboard/ReflectionCard';

// Mock Data
const calendarDays = [
    { day: 'M', date: 23 },
    { day: 'T', date: 24, isToday: true, hasTask: true, taskColor: 'bg-secondary' },
    { day: 'W', date: 25, hasTask: true, taskColor: 'bg-secondary' },
    { day: 'T', date: 26 },
    { day: 'F', date: 27, hasTask: true, taskColor: 'bg-secondary' },
    { day: 'S', date: 28 },
    { day: 'S', date: 29 }
];

const targetTasks = [
    {
        id: 1,
        title: 'Quantum Mechanics Intro',
        type: 'Material',
        dueDate: 'Today, 2:00 PM',
        description: 'Review Chapter 4 notes and complete the derivation exercise.',
        isUrgent: false
    },
    {
        id: 2,
        title: 'Stats Assignment 3',
        type: 'Assignment',
        dueDate: 'Due tomorrow, 11:59 PM',
        description: 'Data visualization project using the Python library Seaborn.',
        isUrgent: false
    },
    {
        id: 3,
        title: 'Biology Unit Quiz',
        type: 'Assessment',
        dueDate: 'Today, 4:30 PM (Priority)',
        description: 'Final self-assessment for the Cell Biology module.',
        isUrgent: true
    }
];

const reflections = [
    {
        id: 1,
        title: 'Mastering Fluid Dynamics',
        subject: 'Physics 101',
        date: 'Oct 24',
        content: "Today I finally grasped Bernoulli's principle. The connection between pressure and velocity felt like a 'lightbulb' moment.",
        teacherFeedback: {
            author: 'Dr. Sarah',
            message: 'Great insight, Alex! Applying this to real-world aerodynamics next week will be exciting.'
        },
        isStale: false
    },
    {
        id: 2,
        title: 'Struggles with Stats',
        subject: 'Biostatistics',
        date: 'Oct 22',
        content: "Still finding p-values confusing. Need to spend more time on null hypothesis testing this weekend.",
        isStale: true
    }
];

export default function Dashboard() {
    const urgentCount = targetTasks.filter(t => t.isUrgent).length;

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Learning Hub</h2>
            <p className="text-body-md text-on-surface-variant">Your personal control center for growth.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            role="student"
            activeTab="dashboard" // Might map to 'home'
            title="Mindful Growth"
            headerSection={headerSection}
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
                        {targetTasks.map(task => (
                            <TargetTaskCard key={task.id} {...task} />
                        ))}
                    </div>
                </section>

                {/* Progress Analytics */}
                <ProgressAnalytics />

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
                        {reflections.map(ref => (
                            <ReflectionCard key={ref.id} {...ref} />
                        ))}
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
