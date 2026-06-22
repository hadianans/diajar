import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';

// Feature Components
import ClassSidebar from '@/Components/features/teacher-classes/ClassSidebar';
import StudentProfileHeader from '@/Components/features/teacher-student-detail/StudentProfileHeader';
import AcademicSummaryCard from '@/Components/features/teacher-student-detail/AcademicSummaryCard';
import GradeTrendChart from '@/Components/features/teacher-student-detail/GradeTrendChart';
import MaterialEngagementList from '@/Components/features/teacher-student-detail/MaterialEngagementList';
import SRLPlanCard from '@/Components/features/teacher-student-detail/SRLPlanCard';
import HistoryList from '@/Components/features/teacher-student-detail/HistoryList';
import LatestReflectionCard from '@/Components/features/teacher-student-detail/LatestReflectionCard';

// Mock Data
const studentDetails = {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD7m5rnaSVcC60mxOwDDslj_pfdiKW0YMWKlLw9MdqKRf3282T_YmNk9CeW1QulrDTRwLGDYzXaKOU-xums2LweplClxb5k30FHs887_yGvPT2Gb0jFe2lzEfx_Fabroraa9xOAWt02GaelUK4ktsBuX1iSMYzHJjU_4o9rDx9cNcMj1gcp8hB-PPaNUzA_QhH1kxu3ztFRGy565VHwBJ9mncX4OTNuYZIm9ImTKFaox8TNf0-PhCa0PTr9s5fo6lhMsIeiTrBf5Q',
    group: 'Group A',
    className: 'Biology - Class 11A',
    year: 'AY 2023/2024'
};

const trendData = [
    { label: 'Sep', value: 80 },
    { label: 'Oct 05', value: 82 },
    { label: 'Oct 15', value: 81 },
    { label: 'Oct 24', value: 85 },
    { label: 'Oct 28', value: 88 },
    { label: 'Now', value: 92 }
];

const engagementChapters = [
    { title: 'Chapter 1: Molecular Basis', progress: 100 },
    { title: 'Chapter 2: Cell Structure', progress: 100 },
    { title: 'Chapter 3: Genetics', progress: 85 },
    { title: 'Chapter 4: Ecology', progress: 40 }
];

const assignments = [
    {
        title: 'Genetics Lab Report', subtitle: 'Oct 24, 2023', score: '95/100', statusText: 'Graded',
        icon: 'description', iconBg: 'bg-primary-container/10', iconColor: 'text-primary'
    },
    {
        title: 'Cell Diagram', subtitle: 'Oct 15, 2023', score: '88/100', statusText: 'Graded',
        icon: 'draw', iconBg: 'bg-primary-container/10', iconColor: 'text-primary'
    }
];

const assessments = [
    {
        title: 'Biology Midterm Quiz', subtitle: 'Oct 28 • Time: 42m', score: '28/30',
        statusBadge: true, statusBadgeText: 'Excellent', statusBadgeBg: 'bg-secondary-container/20', statusBadgeColor: 'text-secondary',
        icon: 'quiz', iconBg: 'bg-tertiary-container/10', iconColor: 'text-tertiary'
    },
    {
        title: 'Intro to Cells Test', subtitle: 'Oct 05 • Time: 35m', score: '25/30',
        statusBadge: true, statusBadgeText: 'Pass', statusBadgeBg: 'bg-primary-container/20', statusBadgeColor: 'text-primary',
        icon: 'assignment_turned_in', iconBg: 'bg-tertiary-container/10', iconColor: 'text-tertiary'
    }
];

export default function StudentShow({ classId, studentId }) {
    return (
        <DashboardTemplate
            role="teacher"
            activeTab="classes"
            title="Student Progress Report"
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title={`Student Progress | Diajar LMS`} />

            <div className="max-w-[1280px] mx-auto pb-12 w-full">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    
                    {/* 1. Student Profile Header (Spans 8 columns on desktop) */}
                    <section className="md:col-span-8">
                        <StudentProfileHeader {...studentDetails} />
                    </section>

                    {/* 2. Academic Performance Summary (Spans 4 columns) */}
                    <section className="md:col-span-4">
                        <AcademicSummaryCard 
                            avgAssignment="A-" 
                            avgAssessment={92} 
                            completion={85} 
                            trend={4} 
                        />
                    </section>

                    {/* 3. Grade Trend Chart (Spans 12 columns) */}
                    <section className="md:col-span-12">
                        <GradeTrendChart dataPoints={trendData} />
                    </section>

                    {/* 4. Material Engagement (Spans 6 columns) */}
                    <section className="md:col-span-6">
                        <MaterialEngagementList 
                            totalCompleted={34} 
                            totalItems={40} 
                            timeSpent={12.5} 
                            chapters={engagementChapters} 
                        />
                    </section>

                    {/* 5. SRL Plans (Spans 6 columns) */}
                    <section className="md:col-span-6">
                        <SRLPlanCard 
                            title="Prepare for Final" 
                            linkedChapter="Chapter 4" 
                            targetDate="Nov 15" 
                            progress={20} 
                        />
                    </section>

                    {/* 6. History Lists (Combined Grid Spacing) */}
                    <section className="md:col-span-8 space-y-gutter flex flex-col h-full">
                        <div className="flex-1">
                            <HistoryList title="Assignment History" items={assignments} isAssessment={false} />
                        </div>
                        <div className="flex-1">
                            <HistoryList title="Assessment History" items={assessments} isAssessment={true} />
                        </div>
                    </section>

                    {/* 7. SRL Reflections (Spans 4 columns) */}
                    <section className="md:col-span-4 flex flex-col h-full">
                        <LatestReflectionCard 
                            taskName="Genetics Lab Report"
                            comment="I really enjoyed the hands-on part of this lab, it made the concepts stick."
                            rating={4}
                            feeling="Confidence"
                            feelingEmoji="😊"
                        />
                    </section>
                </div>
            </div>
        </DashboardTemplate>
    );
}
