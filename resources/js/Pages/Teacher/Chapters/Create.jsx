import React from 'react';
import { Head, router } from '@inertiajs/react';
import FocusedMaterialLayout from '@/Components/shared/layout/FocusedMaterialLayout';
import LessonForm from '@/Components/features/teacher-lessons/LessonForm';
import Icon from '@/Components/shared/ui/Icon';

export default function Create() {
    
    const handleClose = () => {
        router.visit(route('teacher.chapters.show', { chapterId: 1 })); // Assuming going back to Chapter 1
    };

    const actions = (
        <>
            <button className="hidden md:block text-primary font-bold px-4 py-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95 duration-200">
                Save Draft
            </button>
            <button className="bg-primary-container text-on-primary-container font-bold px-6 py-2 rounded-full shadow-lg active:scale-95 duration-200">
                Publish
            </button>
        </>
    );

    return (
        <FocusedMaterialLayout 
            title="New Lesson" 
            onBack={handleClose} 
            actions={actions}
            isCreateMode={true}
        >
            <Head title="Create New Lesson Material" />

            <LessonForm />

            {/* Mobile Bottom Navigation Bar (replaces typical BottomNavbar for save/publish) */}
            <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter py-3 bg-surface shadow-[0_-4px_12px_rgba(15,23,42,0.05)] rounded-t-xl md:hidden">
                <div className="flex-1 flex justify-center">
                    <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors px-4 py-2">
                        <Icon name="visibility" />
                        <span className="font-label-md text-label-md">Preview</span>
                    </button>
                </div>
                <div className="flex-1 flex justify-center">
                    <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-8 py-2 active:scale-95 transition-transform">
                        <Icon name="rocket_launch" filled />
                        <span className="font-label-md text-label-md">Publish</span>
                    </button>
                </div>
            </nav>

            {/* Floating UI for Desktop Only Status */}
            <div className="hidden md:flex fixed bottom-10 right-10 flex-col gap-3">
                <button className="bg-white border border-outline-variant text-primary shadow-lg p-4 rounded-full hover:shadow-xl transition-all flex items-center gap-3 group active:scale-95">
                    <Icon name="visibility" />
                    <span className="font-label-md text-label-md pr-2">Preview Material</span>
                </button>
            </div>

        </FocusedMaterialLayout>
    );
}
