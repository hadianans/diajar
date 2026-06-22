import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import SubjectHero from '@/Components/features/student-subjects/SubjectHero';
import ChapterCard from '@/Components/features/student-subjects/ChapterCard';

// Mock Data
const subjectData = {
    id: 1,
    title: 'Biology: Fundamentals of Life',
    description: 'Explore the fascinating world of living organisms, from microscopic cells to complex ecosystems.',
    progress: 75,
    lessonsCompleted: 18,
    totalLessons: 24,
    chapters: [
        {
            id: 101,
            chapterNumber: 1,
            title: 'Cell Structure & Function',
            status: 'completed',
            description: 'Learn about the building blocks of life and how they operate internally to sustain life.',
            tags: ['Organelles', 'Cell Membrane', 'Transport'],
            lessonsCount: 8,
            videosCount: 5
        },
        {
            id: 102,
            chapterNumber: 2,
            title: 'Genetics & Inheritance',
            status: 'in_progress',
            progress: 45,
            description: 'Understanding DNA, genes, and how complex biological traits are passed down through generations.',
            tags: ['Mendelian Genetics', 'DNA Replication'],
            lessonsCount: 12,
            videosCount: 8
        },
        {
            id: 103,
            chapterNumber: 3,
            title: 'Ecology & Ecosystems',
            status: 'locked',
            description: 'Interactions between organisms and their environment, nutrient cycles, and biodiversity patterns.',
            lessonsCount: 10,
            textsCount: 4
        }
    ]
};

export default function Show({ subjectId = subjectData.id }) {
    return (
        <DashboardTemplate
            role="student"
            activeTab="subjects"
            title="Biology"
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title="Biology Chapters" />

            <div className="max-w-7xl mx-auto pb-8">
                {/* Subject Hero Section */}
                <SubjectHero
                    title={subjectData.title}
                    description={subjectData.description}
                    progress={subjectData.progress}
                    lessonsCompleted={subjectData.lessonsCompleted}
                    totalLessons={subjectData.totalLessons}
                />

                {/* Chapter List Header */}
                <div className="flex items-center justify-between mb-stack-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Course Chapters</h3>
                    <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container p-1 px-3 rounded-full">
                        {subjectData.chapters.length} Chapters
                    </span>
                </div>

                {/* Chapter List */}
                <div className="flex flex-col gap-4">
                    {subjectData.chapters.map(chapter => (
                        <ChapterCard key={chapter.id} subjectId={subjectId} {...chapter} />
                    ))}
                </div>
            </div>
        </DashboardTemplate>
    );
}
