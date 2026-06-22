import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import VideoPlayer from '@/Components/features/student-subjects/VideoPlayer';
import LessonTabs from '@/Components/features/student-subjects/LessonTabs';
import LessonActions from '@/Components/features/student-subjects/LessonActions';
import PromoBanner from '@/Components/features/student-subjects/PromoBanner';

// Mock Data
const lessonData = {
    id: 301,
    subjectId: 1,
    chapterId: 101,
    subjectTitle: 'Biology',
    chapterNumber: 1,
    chapterTitle: 'Principles of Growth',
    subchapterTitle: '1.1 Cell Theory',
    title: 'Introduction to Cell Theory',
    duration: '12:00',
    progress: 65,
    overview: {
        description: 'In this lesson, we dive deep into the fundamental unit of life. We will explore the three core principles of Cell Theory, the contributions of scientists like Schwann and Schleiden, and why this theory is essential to modern biology.',
        points: [
            { text: 'Definition of a biological cell.', checked: true },
            { text: 'The 3 principles of the classic Cell Theory.', checked: true },
            { text: 'Modern additions to Cell Theory.', checked: false },
        ]
    },
    resources: [
        {
            title: 'Summary Notes.pdf',
            meta: '2.4 MB',
            icon: 'description',
            bgClass: 'bg-error-container',
            textClass: 'text-error',
            actionIcon: 'download'
        },
        {
            title: 'Presentation Deck',
            meta: '12 Slides',
            icon: 'slideshow',
            bgClass: 'bg-primary-fixed',
            textClass: 'text-primary',
            actionIcon: 'open_in_new'
        }
    ]
};

export default function Show({ 
    subjectId = lessonData.subjectId, 
    chapterId = lessonData.chapterId, 
    lessonId = lessonData.id 
}) {
    // Header section for the DashboardTemplate
    const headerSection = (
        <section>
            <nav className="flex items-center gap-2 text-label-sm font-label-sm text-outline mb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href={route('student.subjects.index')} className="hover:underline hover:text-on-surface transition-colors">
                    {lessonData.subjectTitle}
                </Link>
                <Icon name="chevron_right" className="text-[14px]" />
                <Link href={route('student.subjects.chapters.show', { subjectId: subjectId, chapterId: chapterId })} className="hover:underline hover:text-on-surface transition-colors">
                    Chapter {lessonData.chapterNumber}
                </Link>
                <Icon name="chevron_right" className="text-[14px]" />
                <span className="text-primary-container font-semibold">{lessonData.subchapterTitle}</span>
            </nav>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
                        {lessonData.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-on-surface-variant">
                            <Icon name="play_circle" className="text-[18px]" />
                            <span className="font-label-sm text-label-sm">Video Material</span>
                        </div>
                        <div className="flex items-center gap-1 text-on-surface-variant">
                            <Icon name="schedule" className="text-[18px]" />
                            <span className="font-label-sm text-label-sm">{lessonData.duration.replace(':00', ' mins')}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-wider">Foundation</span>
                        <span className="px-2 py-0.5 bg-tertiary-fixed text-tertiary font-bold rounded-full text-[10px] uppercase tracking-wider">Core</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="p-2 h-10 w-10 flex items-center justify-center rounded-xl bg-surface-container-highest text-primary shadow-sm hover:scale-105 transition-transform" title="Save lesson">
                        <Icon name="bookmark" style={{ fontVariationSettings: "'FILL' 1" }} />
                    </button>
                    <div className="flex flex-col items-end">
                        <span className="text-label-sm font-label-sm text-outline-variant mb-1">In Progress</span>
                        <div className="w-32 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${lessonData.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-primary mt-1">{lessonData.progress}% Completed</span>
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <DashboardTemplate 
            role="student"
            activeTab="subjects"
            title="LMS"
            showBack={false}
            headerSection={headerSection}
        >
            <Head title={`${lessonData.subchapterTitle} - ${lessonData.subjectTitle}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
                {/* Video & Primary Content */}
                <div className="lg:col-span-8 space-y-stack-md">
                    <VideoPlayer 
                        title={lessonData.subchapterTitle}
                        duration={lessonData.duration}
                        progress={lessonData.progress}
                    />
                    
                    <LessonTabs 
                        overviewContent={lessonData.overview}
                        resources={lessonData.resources}
                    />
                </div>
                
                {/* Side Sidebar: Learning Actions */}
                <div className="lg:col-span-4 space-y-gutter">
                    <LessonActions 
                        onMarkCompleted={() => console.log('Mark as Completed')}
                        onPrevious={() => console.log('Previous')}
                        onNext={() => console.log('Next')}
                        onAddStudyPlan={() => console.log('Add to Study Plan')}
                        onWriteReflection={() => console.log('Write Reflection')}
                        onTakeQuiz={() => console.log('Take Quiz')}
                    />
                    
                    {/* Bento Style Card: Suggested Next */}
                    <PromoBanner 
                        title="RECOMMENDED FOR YOU"
                        description="Mastering Microscopy"
                        buttonText="Explore Topic"
                        icon="biotech"
                        onAction={() => console.log('Explore suggested topic')}
                    />
                </div>
            </div>
        </DashboardTemplate>
    );
}
