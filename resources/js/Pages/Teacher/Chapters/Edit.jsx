import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import FocusedMaterialLayout from '@/Components/shared/layout/FocusedMaterialLayout';
import LessonForm from '@/Components/features/teacher-lessons/LessonForm';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import useApiGet from '@/hooks/useApiGet';

export default function Edit({ lessonId }) {
    const { data: chapters } = useApiGet('/chapters');
    const { data: material, loading } = useApiGet(`/materials/${lessonId}`);
    
    const [subchapters, setSubchapters] = useState([]);
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (material && !formData) {
            setFormData({
                chapter_id: material.chapter_id || '',
                subchapter_id: material.subchapter_id || '',
                title: material.title || '',
                description: material.description || '',
                type: material.type || 'video',
                video_url: material.video_url || '',
                content: material.content || '',
                order: material.order || 1,
                estimated_minutes: material.estimated_minutes || 15
            });
        }
    }, [material, formData]);

    useEffect(() => {
        if (formData?.chapter_id) {
            api.get(`/chapters/${formData.chapter_id}`).then(res => {
                setSubchapters(res.data.data.subchapters || []);
            }).catch(console.error);
        } else {
            setSubchapters([]);
        }
    }, [formData?.chapter_id]);

    const handleSave = async (status = 'draft') => {
        setIsSaving(true);
        setErrors({});
        try {
            await api.put(`/materials/${lessonId}`, { ...formData, status });
            router.visit(`/teacher/chapters/${formData.chapter_id}/${lessonId}`);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || 'Error updating material');
            }
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleClose = () => {
        router.visit(route('teacher.chapters.lessons.show', { chapterId: formData?.chapter_id || 1, lessonId }));
    };

    const actions = (
        <>
            <button 
                onClick={() => handleSave('draft')}
                disabled={isSaving || !formData}
                className="hidden md:block text-primary font-bold px-4 py-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95 duration-200 disabled:opacity-50"
            >
                Save Draft
            </button>
            <button 
                onClick={() => handleSave('published')}
                disabled={isSaving || !formData}
                className="bg-primary-container text-on-primary-container font-bold px-6 py-2 rounded-full shadow-lg active:scale-95 duration-200 disabled:opacity-50"
            >
                Save Changes
            </button>
        </>
    );

    if (loading || !formData) {
        return <div className="p-8 text-center text-on-surface-variant">Loading material data...</div>;
    }

    return (
        <FocusedMaterialLayout 
            title={`Edit Lesson ${lessonId}`} 
            onBack={handleClose} 
            actions={actions}
            isCreateMode={true}
        >
            <Head title={`Edit Lesson ${lessonId}`} />

            <LessonForm 
                formData={formData} 
                onChange={setFormData} 
                errors={errors} 
                chapters={chapters || []} 
                subchapters={subchapters} 
            />

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter py-3 bg-surface shadow-[0_-4px_12px_rgba(15,23,42,0.05)] rounded-t-xl md:hidden">
                <div className="flex-1 flex justify-center">
                    <button 
                        onClick={() => handleSave('draft')}
                        disabled={isSaving}
                        className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors px-4 py-2 disabled:opacity-50"
                    >
                        <Icon name="save" />
                        <span className="font-label-md text-label-md">Save Draft</span>
                    </button>
                </div>
                <div className="flex-1 flex justify-center">
                    <button 
                        onClick={() => handleSave('published')}
                        disabled={isSaving}
                        className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-8 py-2 active:scale-95 transition-transform disabled:opacity-50"
                    >
                        <Icon name="save" filled />
                        <span className="font-label-md text-label-md">Save Changes</span>
                    </button>
                </div>
            </nav>

            {/* Floating UI for Desktop */}
            <div className="hidden md:flex fixed bottom-10 right-10 flex-col gap-3">
                <button className="bg-white border border-outline-variant text-primary shadow-lg p-4 rounded-full hover:shadow-xl transition-all flex items-center gap-3 group active:scale-95">
                    <Icon name="visibility" />
                    <span className="font-label-md text-label-md pr-2">Preview Material</span>
                </button>
            </div>

        </FocusedMaterialLayout>
    );
}
