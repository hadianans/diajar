import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import VideoPlayerOverlay from '@/Components/features/teacher-lessons/VideoPlayerOverlay';
import AttachmentList from '@/Components/features/teacher-lessons/AttachmentList';
import EngagementPanel from '@/Components/features/teacher-lessons/EngagementPanel';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import moment from 'moment';

export default function LessonShow({ chapterId, lessonId }) {
    const { data: material, loading, refetch } = useApiGet(`/materials/${lessonId}`);

    const handleBack = () => {
        router.visit(route('teacher.chapters.show', { chapterId }));
    };

    const handleEdit = () => {
        router.visit(route('teacher.chapters.lessons.edit', { lessonId }));
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this material?')) return;
        try {
            await api.delete(`/materials/${lessonId}`);
            router.visit(route('teacher.chapters.show', { chapterId: material.chapter_id || chapterId }));
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting material');
        }
    };

    const handleTogglePublish = async () => {
        const action = material.status === 'published' ? 'unpublish' : 'publish';
        try {
            await api.patch(`/materials/${lessonId}/${action}`);
            refetch();
        } catch (err) {
            alert(err.response?.data?.message || `Error attempting to ${action} material`);
        }
    };

    if (loading) {
        return (
            <DashboardTemplate role="teacher" title="Loading..." showBack={true} onBack={handleBack}>
                <div className="text-center py-12 text-on-surface-variant">Loading lesson...</div>
            </DashboardTemplate>
        );
    }

    if (!material) {
        return (
            <DashboardTemplate role="teacher" title="Not Found" showBack={true} onBack={handleBack}>
                <div className="text-center py-12 text-on-surface-variant">Lesson not found.</div>
            </DashboardTemplate>
        );
    }

    const stats = {
        completionRate: material.completion_count ? Math.round((material.completion_count / (material.chapter?.target_students_count || 1)) * 100) : 0, 
        completedCount: material.completion_count || 0,
        totalStudents: material.chapter?.target_students_count || 'N/A',
        avgTime: material.avg_time_seconds ? Math.round(material.avg_time_seconds / 60) : 0,
        comprehension: material.avg_comprehension || 0,
        quality: material.avg_material_quality || 0,
        emotions: {
            happy: 10,
            thinking: 5,
            amazed: 2
        },
        activities: material.activities || []
    };

    const attachments = (material.attachments || []).map(att => ({
        name: att.file_name,
        type: att.file_type || 'file',
        size: 'Unknown',
        date: moment(att.created_at).format('MMM D')
    }));

    const actions = (
        <div className="flex items-center gap-2">
            <button 
                onClick={handleTogglePublish}
                className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full font-label-md transition-colors active:scale-95 ${material.status === 'published' ? 'bg-error-container text-error' : 'bg-primary-container text-on-primary-container'}`}
            >
                <Icon name={material.status === 'published' ? 'unpublished' : 'rocket_launch'} className="text-[18px]" />
                {material.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
            <button 
                onClick={handleEdit}
                className="active:scale-95 transition-transform duration-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high"
                title="Edit Material"
            >
                <Icon name="edit" className="text-primary" />
            </button>
            <button 
                onClick={handleDelete}
                className="active:scale-95 transition-transform duration-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/20"
                title="Delete Material"
            >
                <Icon name="delete" className="text-error" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container ml-2">
                <img 
                    className="w-full h-full object-cover" 
                    alt="Teacher" 
                    src="https://ui-avatars.com/api/?name=Teacher&background=random" 
                />
            </div>
        </div>
    );

    return (
        <DashboardTemplate 
            role="teacher"
            activeTab="chapters"
            title={material.chapter?.name || "Chapter View"} 
            showBack={true}
            onBack={handleBack} 
            actions={actions}
        >
            <Head title={`${material.title} - Lesson View`} />

            {/* Video Player Section */}
            {material.file_type === 'video' && material.file_url && (
                <VideoPlayerOverlay title={material.title} url={material.file_url} />
            )}

            {/* Content & Attachments */}
            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{material.title}</h2>
                        
                        {material.file_type === 'text' ? (
                            material.content ? (
                                <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed" dangerouslySetInnerHTML={{ __html: material.content }} />
                            ) : material.file_url ? (
                                <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low border border-outline-variant rounded-2xl">
                                    <Icon name="description" className="text-4xl text-primary mb-4" />
                                    <p className="text-body-lg text-on-surface mb-4">This lesson contains an attached document.</p>
                                    <a 
                                        href={material.file_url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <Icon name="open_in_new" className="text-[18px]" />
                                        View Document
                                    </a>
                                </div>
                            ) : (
                                <p className="font-body-md text-body-md text-on-surface-variant italic">No content available.</p>
                            )
                        ) : (
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                {material.description || "No description provided."}
                            </p>
                        )}
                    </div>
                    
                    {attachments.length > 0 && <AttachmentList attachments={attachments} />}
                </div>
                
                {/* Desktop analytics space could go here, but sticking to sticky bottom logic */}
                <div className="hidden lg:block lg:col-span-4"></div>
            </div>

            {/* Engagement Panel */}
            <EngagementPanel stats={stats} />

        </DashboardTemplate>
    );
}
