import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssessmentStatsGrid from '@/Components/features/student-assessments/AssessmentStatsGrid';
import AssessmentReflection from '@/Components/features/student-assessments/AssessmentReflection';

// Mock Data
const assessmentData = {
    id: 1,
    subject: 'Biology',
    title: 'Biology Midterm Quiz',
    status: 'Upcoming',
    deadline: 'Oct 28, 10:00 AM',
    description: 'This comprehensive midterm covers Chapters 1-4, focusing on Cell Theory, Organelle Functions, and Principles of Growth. Ensure you have a stable connection before starting.',
    stats: [
        { icon: 'timer', value: '45 mins', label: 'Time Limit' },
        { icon: 'quiz', value: '30 Questions', label: 'Total Count' },
        { icon: 'history', value: '1 of 2', label: 'Attempts Left' },
        { icon: 'stars', value: '--', label: 'Best Score' }
    ],
    reflectionGoals: [
        { label: 'Refresh knowledge and identify gaps' },
        { label: 'Achieve a score of 90% or higher' }
    ]
};

export default function Show({ assessmentId = assessmentData.id }) {
    return (
        <DashboardTemplate 
            role="student"
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
                <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center p-6">
                        <div className="p-3 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-white/40">
                            <Icon name="science" className="text-primary scale-125" style={{ fontVariationSettings: "'FILL' 1" }} />
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <section className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {assessmentData.description}
                    </p>
                </section>

                {/* Assessment Details Grid */}
                <AssessmentStatsGrid stats={assessmentData.stats} />

                {/* Pre-Assessment Reflection Card */}
                <AssessmentReflection 
                    goals={assessmentData.reflectionGoals} 
                    onSelect={(goal) => console.log('Goal selected:', goal)} 
                />

                {/* Sticky Bottom Actions */}
                <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant/20 p-4 md:px-margin-desktop z-40">
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        <Link 
                            href={route('student.assessments.attempt', { assessmentId })}
                            className="flex-1 bg-primary hover:bg-primary-container text-on-primary py-4 px-6 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            <span>Start Assessment</span>
                            <Icon name="play_arrow" className="text-[20px]" />
                        </Link>
                        <button className="w-14 h-14 border-2 border-outline-variant rounded-xl flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors active:scale-90">
                            <Icon name="playlist_add" />
                        </button>
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    );
}
