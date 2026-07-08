import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import SubjectHero from '@/Components/features/student-subjects/SubjectHero';
import ChapterCard from '@/Components/features/student-subjects/ChapterCard';
import useApiGet from '@/hooks/useApiGet';

export default function Show({ subjectId }) {
    // We pass subjectId from web route: Route::get('/student/subjects/{id}', ...)
    const { data: subjectsData, loading: loadingSubjects } = useApiGet('/subjects');

    const classModel = useMemo(() => {
        if (!subjectsData) return null;
        return subjectsData.find(s => s.id == subjectId);
    }, [subjectsData, subjectId]);

    const actualSubjectId = classModel?.subject_id;
    const { data: chaptersData, loading: loadingChapters } = useApiGet(actualSubjectId ? `/subjects/${actualSubjectId}/chapters` : null);

    const subjectData = useMemo(() => {
        if (!classModel) return null;
        return {
            id: classModel.id,
            title: classModel.subject?.subject_name || classModel.subject?.name || 'Subject',
            description: classModel.subject?.description || 'Course details',
            progress: classModel.material_completion || 0,
            lessonsCompleted: 0,
            totalLessons: 0
        };
    }, [classModel]);

    const mappedChapters = useMemo(() => {
        if (!chaptersData) return [];
        return chaptersData.map((ch, idx) => ({
            id: ch.id,
            chapterNumber: ch.order || (idx + 1),
            title: ch.name || ch.title,
            status: ch.is_locked ? 'locked' : (ch.completion === 100 ? 'completed' : 'in_progress'),
            progress: ch.completion || 0,
            description: ch.description,
            tags: [],
            lessonsCount: ch.total_materials || 0,
            videosCount: ch.video_count || 0,
            textsCount: ch.text_count || 0
        }));
    }, [chaptersData]);

    if (loadingSubjects) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Loading..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Loading subject details...</div>
            </DashboardTemplate>
        );
    }

    if (!subjectData) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Not Found" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Subject not found or you don't have access.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate
            activeTab="Subject"
            title={subjectData.title}
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title={`${subjectData.title} Chapters`} />

            <div className="max-w-7xl mx-auto pb-8 mt-4">
                {/* Subject Hero Section */}
                <SubjectHero
                    title={subjectData.title}
                    description={subjectData.description}
                    progress={subjectData.progress}
                    lessonsCompleted={subjectData.lessonsCompleted}
                    totalLessons={subjectData.totalLessons}
                />

                {/* Chapter List Header */}
                <div className="flex items-center justify-between mb-stack-md mt-8">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Course Chapters</h3>
                    <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container p-1 px-3 rounded-full">
                        {mappedChapters.length} Chapters
                    </span>
                </div>

                {/* Chapter List */}
                <div className="flex flex-col gap-4">
                    {loadingChapters ? (
                        <div className="text-center py-4">Loading chapters...</div>
                    ) : mappedChapters.length > 0 ? (
                        mappedChapters.map(chapter => (
                            <ChapterCard key={chapter.id} subjectId={subjectId} {...chapter} />
                        ))
                    ) : (
                        <div className="text-center py-4 text-on-surface-variant">No chapters available for this subject.</div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
