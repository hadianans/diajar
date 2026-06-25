import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import FocusedMaterialLayout from '@/Components/shared/layout/FocusedMaterialLayout';
import VideoPlayerOverlay from '@/Components/features/teacher-lessons/VideoPlayerOverlay';
import AttachmentList from '@/Components/features/teacher-lessons/AttachmentList';
import EngagementPanel from '@/Components/features/teacher-lessons/EngagementPanel';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function LessonShow({ chapterId, lessonId }) {
    const { data: material, loading } = useApiGet(`/materials/${lessonId}`);

    const handleBack = () => {
        router.visit(route('teacher.chapters.show', { chapterId }));
    };

    const handleEdit = () => {
        router.visit(route('teacher.chapters.lessons.edit', { lessonId }));
    };

    if (loading) {
        return (
            <FocusedMaterialLayout title="Loading..." onBack={handleBack} actions={<></>}>
                <div className="text-center py-12 text-on-surface-variant">Loading lesson...</div>
            </FocusedMaterialLayout>
        );
    }

    if (!material) {
        return (
            <FocusedMaterialLayout title="Not Found" onBack={handleBack} actions={<></>}>
                <div className="text-center py-12 text-on-surface-variant">Lesson not found.</div>
            </FocusedMaterialLayout>
        );
    }

    const mockStats = {
        completionRate: material.completion_count ? Math.round((material.completion_count / 30) * 100) : 0, // Mock 30 students
        completedCount: material.completion_count || 0,
        totalStudents: 30,
        avgTime: material.avg_time_seconds ? Math.round(material.avg_time_seconds / 60) : 0,
        comprehension: material.avg_comprehension || 0,
        quality: material.avg_material_quality || 0,
        emotions: {
            happy: 10,
            thinking: 5,
            amazed: 2
        }
    };

    const attachments = (material.attachments || []).map(att => ({
        name: att.file_name,
        type: att.file_type || 'file',
        size: 'Unknown',
        date: moment(att.created_at).format('MMM D')
    }));

    const actions = (
        <>
            <button 
                onClick={handleEdit}
                className="active:scale-95 transition-transform duration-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low"
            >
                <Icon name="edit" className="text-primary" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
                <img 
                    className="w-full h-full object-cover" 
                    alt="Teacher" 
                    src="https://ui-avatars.com/api/?name=Teacher&background=random" 
                />
            </div>
        </>
    );

    return (
        <FocusedMaterialLayout 
            title={material.chapter?.name || "Chapter View"} 
            onBack={handleBack} 
            actions={actions}
        >
            <Head title={`${material.title} - Lesson View`} />

            {/* Video Player Section */}
            {material.type === 'video' && material.video_url && (
                <VideoPlayerOverlay title={material.title} url={material.video_url} />
            )}

            {/* Content & Attachments */}
            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{material.title}</h2>
                        
                        {material.type === 'text' ? (
                            <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed" dangerouslySetInnerHTML={{ __html: material.text_content }} />
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
            <EngagementPanel stats={mockStats} />

        </FocusedMaterialLayout>
    );
}
