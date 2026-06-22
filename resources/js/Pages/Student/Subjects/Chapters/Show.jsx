import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import LessonItem from '@/Components/features/student-subjects/LessonItem';

// Mock Data
const chapterData = {
    id: 101,
    subjectId: 1,
    subjectTitle: 'Biology',
    chapterNumber: 1,
    title: 'Principles of Growth',
    description: 'Understanding the fundamental building blocks of life and how organisms interact with their environment.',
    subchapters: [
        {
            id: 201,
            title: '1.1 Cell Theory',
            lessons: [
                {
                    id: 301,
                    title: 'Introduction to Cell Theory',
                    type: 'Video',
                    duration: '12 mins',
                    tag: 'Foundation',
                    status: 'completed'
                },
                {
                    id: 302,
                    title: 'Microscopy History',
                    type: 'Reading',
                    duration: '8 mins',
                    tag: 'Core',
                    status: 'pending'
                }
            ]
        },
        {
            id: 202,
            title: '1.2 Organelle Functions',
            lessons: [
                {
                    id: 303,
                    title: 'The Nucleus: Control Center',
                    type: 'Interactive',
                    duration: '15 mins',
                    tag: 'Essential',
                    status: 'pending'
                },
                {
                    id: 304,
                    title: 'Mitochondria & Energy',
                    type: 'Video',
                    duration: '10 mins',
                    tag: 'Complex',
                    status: 'pending'
                }
            ]
        }
    ]
};

export default function Show({ subjectId = chapterData.subjectId, chapterId = chapterData.id }) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <DashboardTemplate 
            role="student"
            activeTab="subjects"
            title={`Chapter ${chapterData.chapterNumber}: ${chapterData.title}`}
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title={`Chapter ${chapterData.chapterNumber} - ${chapterData.subjectTitle}`} />

            <div className="max-w-2xl mx-auto pb-8">
                {/* Chapter Context */}
                <section className="mt-stack-md">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                            {chapterData.subjectTitle}
                        </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        {chapterData.description}
                    </p>
                </section>

                {/* Search & Controls */}
                <section className="mt-stack-lg space-y-4">
                    <div className="relative flex items-center">
                        <Icon name="search" className="absolute left-4 text-outline" />
                        <input 
                            className="w-full h-12 pl-12 pr-4 bg-surface-container-low border-none rounded-xl font-body-md text-body-md focus:ring-2 focus:ring-primary focus:bg-surface transition-all" 
                            placeholder="Search materials..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors whitespace-nowrap">
                            Status <Icon name="expand_more" className="text-[18px]" />
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors whitespace-nowrap">
                            Type <Icon name="expand_more" className="text-[18px]" />
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors whitespace-nowrap">
                            Tags <Icon name="expand_more" className="text-[18px]" />
                        </button>
                        <div className="ml-auto flex items-center gap-1.5 px-4 py-2 font-label-md text-label-md text-primary font-bold whitespace-nowrap cursor-pointer">
                            <Icon name="sort" className="text-[18px]" /> Sort
                        </div>
                    </div>
                </section>

                {/* Material List */}
                <div className="mt-stack-lg space-y-10">
                    {chapterData.subchapters.map(subchapter => {
                        const filteredLessons = subchapter.lessons.filter(lesson => 
                            lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        if (filteredLessons.length === 0) return null;

                        return (
                            <section key={subchapter.id}>
                                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">{subchapter.title}</h2>
                                <div className="space-y-stack-sm">
                                    {filteredLessons.map(lesson => (
                                        <LessonItem 
                                            key={lesson.id} 
                                            subjectId={subjectId} 
                                            chapterId={chapterId} 
                                            {...lesson} 
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </DashboardTemplate>
    );
}
