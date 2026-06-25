import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import LessonItem from '@/Components/features/student-subjects/LessonItem';
import useApiGet from '@/hooks/useApiGet';

export default function Show({ subjectId, chapterId }) {
    const { data: subjectsData, loading: loadingSubjects } = useApiGet('/subjects');

    const classModel = useMemo(() => {
        if (!subjectsData) return null;
        return subjectsData.find(s => s.id == subjectId);
    }, [subjectsData, subjectId]);

    const actualSubjectId = classModel?.subject_id;
    const subjectTitle = classModel?.subject?.subject_name || classModel?.subject?.name || 'Subject';

    const { data: chaptersData, loading: loadingChapters } = useApiGet(actualSubjectId ? `/subjects/${actualSubjectId}/chapters` : null);
    
    const chapterDataInfo = useMemo(() => {
        if (!chaptersData) return null;
        return chaptersData.find(c => c.id == chapterId);
    }, [chaptersData, chapterId]);

    const { data: materialsData, loading: loadingMaterials } = useApiGet(
        actualSubjectId && chapterId ? `/subjects/${actualSubjectId}/chapters/${chapterId}/materials` : null
    );

    const subchapters = useMemo(() => {
        if (!materialsData) return [];
        const result = [];
        Object.keys(materialsData).forEach(subId => {
            const mats = materialsData[subId];
            if (mats.length === 0) return;
            
            const firstMat = mats[0];
            const subTitle = subId === 'root' ? 'General' : (firstMat.subchapter?.name || 'Lessons');
            
            result.push({
                id: subId,
                title: subTitle,
                lessons: mats.map(m => ({
                    id: m.id,
                    title: m.title,
                    type: m.file_type === 'video' ? 'Video' : 'Reading',
                    duration: m.duration || 'N/A',
                    tag: m.tags && m.tags.length > 0 ? m.tags[0].name : '',
                    status: m.is_completed ? 'completed' : 'pending',
                    originalId: m.id
                }))
            });
        });
        return result;
    }, [materialsData]);

    const [searchQuery, setSearchQuery] = useState('');

    const loading = loadingSubjects || loadingChapters || loadingMaterials;

    if (loading) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Loading..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Loading chapter materials...</div>
            </DashboardTemplate>
        );
    }

    if (!chapterDataInfo) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Not Found" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Chapter not found.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate 
            activeTab="Subject"
            title={`Chapter ${chapterDataInfo.order || 1}: ${chapterDataInfo.name || chapterDataInfo.title}`}
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title={`${chapterDataInfo.name || chapterDataInfo.title} - ${subjectTitle}`} />

            <div className="max-w-2xl mx-auto pb-8 mt-4">
                {/* Chapter Context */}
                <section className="mt-stack-md">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                            {subjectTitle}
                        </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        {chapterDataInfo.description}
                    </p>
                </section>

                {/* Search & Controls */}
                <section className="mt-stack-lg space-y-4">
                    <div className="relative flex items-center">
                        <Icon name="search" className="absolute left-4 text-outline" />
                        <input 
                            className="w-full h-12 pl-12 pr-4 bg-surface-container-low border-none rounded-xl font-body-md text-body-md focus:ring-2 focus:ring-primary focus:bg-surface transition-all shadow-sm" 
                            placeholder="Search materials..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Material List */}
                <div className="mt-stack-lg space-y-10">
                    {subchapters.length === 0 ? (
                        <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">No materials available for this chapter.</div>
                    ) : (
                        subchapters.map(subchapter => {
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
                        })
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
