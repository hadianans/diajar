import React from 'react';
import { Head, router } from '@inertiajs/react';
import FocusedMaterialLayout from '@/Components/shared/layout/FocusedMaterialLayout';
import VideoPlayerOverlay from '@/Components/features/teacher-lessons/VideoPlayerOverlay';
import AttachmentList from '@/Components/features/teacher-lessons/AttachmentList';
import EngagementPanel from '@/Components/features/teacher-lessons/EngagementPanel';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonShow({ chapterId, lessonId }) {
    
    const handleBack = () => {
        router.visit(route('teacher.chapters.show', { chapterId }));
    };

    const handleEdit = () => {
        router.visit(route('teacher.chapters.lessons.edit', { lessonId }));
    };

    const mockStats = {
        completionRate: 88,
        completedCount: 28,
        totalStudents: 32,
        avgTime: 12.5,
        comprehension: 4.2,
        quality: 4.5,
        emotions: {
            happy: 18,
            thinking: 6,
            amazed: 4
        }
    };

    const mockAttachments = [
        { name: 'Chapter 2 Summary.pdf', type: 'pdf', size: '1.2 MB', date: 'Oct 12' },
        { name: 'Cell Diagram Diagram.svg', type: 'image', size: '450 KB', date: 'Oct 12' }
    ];

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
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeK-OlYk3LEqtzQuKtiYTSJp4jNNZ7D6WM8BiMwpwMfD2cvTvWdXjgj5IYIs0TRcwGWZvOh8kBRPN95WKn9a7XhqbOe4Jz7tggu187uQU7SAuTgpO18hY_Ce917yHEjdf-_uxBNLkLG4K8OURJUKa1G7QgzvGhMP7CRorIDBCsFQ9mwntTKIMztAiy60nTo0ev-yoFuv7sLloCjK2Z1ffo61DCXiG0Y99Jy2ttbWFke7TL3YYwj9Z8pzSbqGAghzGDiAXgqCFvjKQ" 
                />
            </div>
        </>
    );

    return (
        <FocusedMaterialLayout 
            title="Cell Theory" 
            onBack={handleBack} 
            actions={actions}
        >
            <Head title="Cell Theory - Lesson View" />

            {/* Video Player Section */}
            <VideoPlayerOverlay title="Cell Structure and Function" />

            {/* Content & Attachments */}
            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Introduction to Cell Theory</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                            This lesson covers the three fundamental tenets of cell theory and explains why the cell is the basic building block of all living organisms. We'll examine the historical contributions of Hooke, Schwann, and Virchow.
                        </p>
                    </div>
                    
                    <AttachmentList attachments={mockAttachments} />
                </div>
                
                {/* Desktop analytics space could go here, but sticking to sticky bottom logic */}
                <div className="hidden lg:block lg:col-span-4"></div>
            </div>

            {/* Engagement Panel */}
            <EngagementPanel stats={mockStats} />

        </FocusedMaterialLayout>
    );
}
