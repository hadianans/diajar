import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import VideoPlayer from '@/Components/features/student-subjects/VideoPlayer';
import LessonTabs from '@/Components/features/student-subjects/LessonTabs';
import LessonActions from '@/Components/features/student-subjects/LessonActions';
import PromoBanner from '@/Components/features/student-subjects/PromoBanner';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';

export default function Show({ 
    subjectId, 
    chapterId, 
    lessonId 
}) {
    const { data: materialData, loading, setData } = useApiGet(`/materials/${lessonId}`);

    const [accessLogId, setAccessLogId] = useState(null);

    // Track access start
    useEffect(() => {
        if (materialData && !accessLogId) {
            api.post(`/materials/${lessonId}/access/start`)
                .then(res => setAccessLogId(res.log_id))
                .catch(err => console.error('Error starting access:', err));
        }

        return () => {
            if (accessLogId) {
                api.patch(`/materials/access/${accessLogId}/end`, { interaction_data: { type: 'exit' } })
                    .catch(console.error);
            }
        };
    }, [materialData, lessonId, accessLogId]);

    const lesson = useMemo(() => {
        if (!materialData) return null;
        return {
            id: materialData.id,
            subjectId: subjectId,
            chapterId: chapterId,
            subjectTitle: 'Course', // We don't have the subject name readily available unless we fetch /subjects
            chapterNumber: 1, // Need to find chapter order if possible
            chapterTitle: materialData.chapter?.name || 'Chapter',
            subchapterTitle: materialData.subchapter?.name || 'General',
            title: materialData.title,
            duration: materialData.duration || 'N/A',
            progress: materialData.is_completed ? 100 : 0,
            overview: {
                description: materialData.description || 'No description available.',
                points: [] // We could parse from rich text, but keeping it empty for now
            },
            resources: materialData.attachments?.map(att => ({
                id: att.id,
                title: att.file_name,
                meta: 'Attachment',
                icon: 'description',
                bgClass: 'bg-primary-container',
                textClass: 'text-primary',
                actionIcon: 'download',
                url: att.file_path
            })) || [],
            isCompleted: materialData.is_completed,
            isBookmarked: materialData.is_bookmarked,
            prevId: materialData.prev_material_id,
            nextId: materialData.next_material_id,
            relatedAssessment: materialData.related_assessment
        };
    }, [materialData, subjectId, chapterId]);

    const handleToggleComplete = async () => {
        try {
            if (lesson.isCompleted) {
                await api.patch(`/materials/${lessonId}/incomplete`);
                setData({ ...materialData, is_completed: false });
            } else {
                await api.patch(`/materials/${lessonId}/complete`);
                setData({ ...materialData, is_completed: true });
            }
        } catch (error) {
            console.error('Error toggling completion status', error);
        }
    };

    const handleToggleBookmark = async () => {
        try {
            if (lesson.isBookmarked) {
                await api.delete(`/bookmarks/${lessonId}?type=App\\Models\\Material`);
                setData({ ...materialData, is_bookmarked: false });
            } else {
                await api.post(`/bookmarks`, { bookmarkable_id: lessonId, bookmarkable_type: 'App\\Models\\Material' });
                setData({ ...materialData, is_bookmarked: true });
            }
        } catch (error) {
            console.error('Error toggling bookmark', error);
        }
    };

    // Header section for the DashboardTemplate
    const headerSection = lesson ? (
        <section>
            <nav className="flex items-center gap-2 text-label-sm font-label-sm text-outline mb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href={route('student.subjects.index')} className="hover:underline hover:text-on-surface transition-colors">
                    My Courses
                </Link>
                <Icon name="chevron_right" className="text-[14px]" />
                <Link href={route('student.subjects.chapters.show', { subjectId: subjectId, chapterId: chapterId })} className="hover:underline hover:text-on-surface transition-colors">
                    {lesson.chapterTitle}
                </Link>
                <Icon name="chevron_right" className="text-[14px]" />
                <span className="text-primary-container font-semibold">{lesson.subchapterTitle}</span>
            </nav>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
                        {lesson.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-on-surface-variant">
                            <Icon name="play_circle" className="text-[18px]" />
                            <span className="font-label-sm text-label-sm">{materialData?.file_type || 'Material'}</span>
                        </div>
                        {lesson.duration !== 'N/A' && (
                            <div className="flex items-center gap-1 text-on-surface-variant">
                                <Icon name="schedule" className="text-[18px]" />
                                <span className="font-label-sm text-label-sm">{lesson.duration}</span>
                            </div>
                        )}
                        {materialData?.tags?.map(tag => (
                            <span key={tag.id} className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-wider">{tag.name}</span>
                        ))}
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleToggleBookmark}
                        className={`p-2 h-10 w-10 flex items-center justify-center rounded-xl bg-surface-container-highest shadow-sm hover:scale-105 transition-transform ${lesson.isBookmarked ? 'text-primary' : 'text-on-surface-variant'}`} 
                        title={lesson.isBookmarked ? "Remove bookmark" : "Save lesson"}
                    >
                        <Icon name="bookmark" style={{ fontVariationSettings: lesson.isBookmarked ? "'FILL' 1" : "'FILL' 0" }} />
                    </button>
                    <div className="flex flex-col items-end">
                        <span className="text-label-sm font-label-sm text-outline-variant mb-1">
                            {lesson.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                        <div className="w-32 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${lesson.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-primary mt-1">{lesson.progress}% Completed</span>
                    </div>
                </div>
            </div>
        </section>
    ) : null;

    if (loading) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Loading..." showBack={false}>
                <div className="text-center py-12">Loading lesson details...</div>
            </DashboardTemplate>
        );
    }

    if (!lesson) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Not Found" showBack={false}>
                <div className="text-center py-12">Lesson not found.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate 
            activeTab="Subject"
            title="Lesson Details"
            showBack={false}
            headerSection={headerSection}
        >
            <Head title={`${lesson.title} - ${lesson.chapterTitle}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 mt-4">
                {/* Video & Primary Content */}
                <div className="lg:col-span-8 space-y-stack-md">
                    <VideoPlayer 
                        title={lesson.title}
                        duration={lesson.duration}
                        progress={lesson.progress}
                        // Assume video material types have a specific UI. The mockup uses a placeholder.
                    />
                    
                    <LessonTabs 
                        overviewContent={lesson.overview}
                        resources={lesson.resources}
                        content={materialData?.content}
                    />
                </div>
                
                {/* Side Sidebar: Learning Actions */}
                <div className="lg:col-span-4 space-y-gutter">
                    <LessonActions 
                        isCompleted={lesson.isCompleted}
                        onMarkCompleted={handleToggleComplete}
                        onPrevious={() => {
                            if (lesson.prevId) router.visit(`/student/subjects/${subjectId}/chapters/${chapterId}/lessons/${lesson.prevId}`);
                        }}
                        onNext={() => {
                            if (lesson.nextId) router.visit(`/student/subjects/${subjectId}/chapters/${chapterId}/lessons/${lesson.nextId}`);
                        }}
                        hasNext={!!lesson.nextId}
                        hasPrev={!!lesson.prevId}
                        onAddStudyPlan={() => alert('Feature coming soon: Add to Study Plan')}
                        onWriteReflection={() => alert('Feature coming soon: Write Reflection')}
                        onTakeQuiz={() => {
                            if (lesson.relatedAssessment) {
                                router.visit(`/student/assessments/${lesson.relatedAssessment.id}`);
                            } else {
                                alert('No assessment tied to this lesson.');
                            }
                        }}
                        hasQuiz={!!lesson.relatedAssessment}
                    />
                    
                    {/* Bento Style Card: Suggested Next */}
                    {lesson.nextId && (
                        <PromoBanner 
                            title="UP NEXT"
                            description="Continue to the next lesson to keep your momentum going."
                            buttonText="Go to Next Lesson"
                            icon="arrow_forward"
                            onAction={() => router.visit(`/student/subjects/${subjectId}/chapters/${chapterId}/lessons/${lesson.nextId}`)}
                        />
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
