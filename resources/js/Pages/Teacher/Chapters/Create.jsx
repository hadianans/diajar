import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import LessonForm from '@/Components/features/teacher-lessons/LessonForm';
import MaterialPreviewModal from '@/Components/features/teacher-lessons/MaterialPreviewModal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import useApiGet from '@/hooks/useApiGet';

export default function Create({ chapterId }) {
    const { url } = usePage();
    const { data: chapters } = useApiGet('/chapters');
    const [subchapters, setSubchapters] = useState([]);

    // Parse query params safely
    const queryParams = new URLSearchParams(url.split('?')[1] || '');
    const initialSubchapterId = queryParams.get('subchapter_id') ? Number(queryParams.get('subchapter_id')) : '';

    const [formData, setFormData] = useState({
        chapter_id: chapterId || '',
        subchapter_id: initialSubchapterId,
        title: '',
        description: '',
        file_type: 'video',
        file_url: '',
        core_file: null,
        content: '',
        order: 1,
        duration_minutes: 15
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (formData.chapter_id) {
            api.get(`/chapters/${formData.chapter_id}`).then(res => {
                setSubchapters(res?.subchapters || []);
            }).catch(console.error);
        } else {
            setSubchapters([]);
        }
    }, [formData.chapter_id]);

    const handleSave = async (status = 'draft') => {
        setIsSaving(true);
        setErrors({});
        try {
            const formDataPayload = new FormData();
            
            // Append basic fields
            Object.keys(formData).forEach(key => {
                if (key !== 'attachments' && formData[key] !== null && formData[key] !== undefined) {
                    formDataPayload.append(key, formData[key]);
                }
            });
            
            // Append calculated fields
            formDataPayload.append('status', status);
            formDataPayload.append('duration_seconds', (parseInt(formData.duration_minutes) || 0) * 60);

            if (formData.core_file) {
                formDataPayload.append('core_file', formData.core_file);
            }

            // Append attachments
            if (formData.attachments && formData.attachments.length > 0) {
                formData.attachments.forEach((item) => {
                    formDataPayload.append('attachments[]', item.file);
                    formDataPayload.append('attachment_titles[]', item.title || '');
                });
            }

            await api.post('/materials', formDataPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            router.visit(`/teacher/chapters/${formData.chapter_id}`);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || 'Error saving material');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        router.visit(route('teacher.chapters.show', { chapterId: formData.chapter_id || chapterId || 1 }));
    };

    const headerSection = (
        <section className="mb-stack-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                    <button onClick={handleClose} className="hover:text-primary transition-colors flex items-center gap-1 text-label-md">
                        <Icon name="arrow_back" className="text-[18px]" />
                        Back to Chapter
                    </button>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Create New Lesson</h2>
                <p className="text-on-surface-variant font-body-md">Draft and publish educational materials for your students.</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => handleSave('draft')}
                    disabled={isSaving}
                    className="text-primary font-bold px-5 py-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95 duration-200 disabled:opacity-50 border border-primary/20"
                >
                    Save Draft
                </button>
                <button
                    onClick={() => handleSave('published')}
                    disabled={isSaving}
                    className="bg-primary-container text-on-primary-container font-bold px-6 py-2 rounded-full shadow-md hover:shadow-lg active:scale-95 duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                    <Icon name="rocket_launch" />
                    Publish
                </button>
            </div>
        </section>
    );

    return (
        <DashboardTemplate role="teacher" activeTab="chapters" title="New Lesson" headerSection={headerSection}>
            <Head title="Create New Lesson Material" />

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
                        <Icon name="rocket_launch" />
                        <span className="font-label-md text-label-md">Publish</span>
                    </button>
                </div>
            </nav>

            {/* Floating UI for Desktop Only Status */}
            <div className="hidden md:flex fixed bottom-10 right-10 flex-col gap-3">
                <button 
                    onClick={() => setShowPreview(true)}
                    className="bg-white border border-outline-variant text-primary shadow-lg p-4 rounded-full hover:shadow-xl transition-all flex items-center gap-3 group active:scale-95"
                >
                    <Icon name="visibility" />
                    <span className="font-label-md text-label-md pr-2">Preview Material</span>
                </button>
            </div>

            <MaterialPreviewModal 
                show={showPreview} 
                onClose={() => setShowPreview(false)} 
                formData={formData} 
            />

        </DashboardTemplate>
    );
}
