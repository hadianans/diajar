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

    const totalLessons = useMemo(() => mappedChapters.reduce((sum, ch) => sum + (ch.lessonsCount || 0), 0), [mappedChapters]);
    const lessonsCompleted = useMemo(() => mappedChapters.filter(ch => ch.status === 'completed').reduce((sum, ch) => sum + (ch.lessonsCount || 0), 0), [mappedChapters]);

    if (loadingSubjects) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Memuat..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Memuat detail mata pelajaran...</div>
            </DashboardTemplate>
        );
    }

    if (!subjectData) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Mata Pelajaran Tidak Ditemukan" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Mata pelajaran tidak ditemukan atau Anda tidak memiliki akses.</div>
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
            <Head title={`${subjectData.title} Bab`} />

            <div className="max-w-7xl mx-auto pb-8 mt-4">
                {/* Subject Hero Section */}
                <SubjectHero
                    title={subjectData.title}
                    description={subjectData.description}
                    progress={subjectData.progress}
                    lessonsCompleted={lessonsCompleted}
                    totalLessons={totalLessons}
                />

                {/* Chapter List Header */}
                <div className="flex items-center justify-between mb-stack-md mt-8">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Bab Kursus</h3>
                    <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container p-1 px-3 rounded-full">
                        {mappedChapters.length} Bab
                    </span>
                </div>

                {/* Chapter List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {loadingChapters ? (
                        <div className="col-span-full text-center py-12 text-on-surface-variant font-body-lg animate-pulse">Memuat bab...</div>
                    ) : mappedChapters.length > 0 ? (
                        mappedChapters.map(chapter => (
                            <ChapterCard key={chapter.id} subjectId={subjectId} {...chapter} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-4 text-on-surface-variant">Tidak ada bab yang tersedia untuk mata pelajaran ini.</div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
