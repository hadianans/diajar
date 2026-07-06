import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';

export default function Edit({ assessmentId }) {
    const { data: assessment, loading } = useApiGet(`/assessments/${assessmentId}`);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        max_attempts: '',
        pass_threshold: '',
        start_date: '',
        due_date: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Pre-populate form when assessment loads
    useEffect(() => {
        if (assessment) {
            setFormData({
                title: assessment.title || '',
                description: assessment.description || '',
                duration: assessment.duration || '',
                max_attempts: assessment.max_attempts || '',
                pass_threshold: assessment.pass_threshold || '',
                start_date: assessment.start_date ? assessment.start_date.slice(0, 16) : '',
                due_date: assessment.due_date ? assessment.due_date.slice(0, 16) : '',
            });
        }
    }, [assessment]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrors({});

        try {
            await api.put(`/assessments/${assessmentId}`, {
                title: formData.title,
                description: formData.description || null,
                start_date: formData.start_date || null,
                due_date: formData.due_date || null,
                duration: parseInt(formData.duration),
                max_attempts: parseInt(formData.max_attempts),
                pass_threshold: parseFloat(formData.pass_threshold),
            });

            router.visit(route('teacher.assessments.show', { assessmentId }));
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || 'Error updating assessment');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        router.visit(route('teacher.assessments.show', { assessmentId }));
    };

    const headerSection = (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Edit Assessment</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Update assessment settings and scheduling.</p>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleBack}
                    className="flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest active:scale-95 transition-all shadow-sm"
                >
                    <Icon name="close" />
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
                >
                    <Icon name="save" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection}>
                <Head title="Edit Assessment | Diajar LMS" />
                <div className="text-center py-12 text-on-surface-variant">Loading assessment...</div>
            </DashboardTemplate>
        );
    }

    if (!assessment) {
        return (
            <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection}>
                <Head title="Edit Assessment | Diajar LMS" />
                <div className="text-center py-12 text-on-surface-variant">Assessment not found.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection} showBack={true} onBack={handleBack}>
            <Head title={`Edit ${formData.title || 'Assessment'} | Diajar LMS`} />

            <div className="space-y-stack-lg max-w-screen-md mx-auto w-full pb-32">
                {/* Error display */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20">
                        <p className="font-label-md mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside text-label-sm space-y-1">
                            {Object.entries(errors).map(([key, msgs]) => (
                                <li key={key}>{Array.isArray(msgs) ? msgs[0] : msgs}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Basic Info */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm space-y-stack-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                        <Icon name="edit_note" className="text-primary" />
                        Assessment Details
                    </h3>

                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface">Title <span className="text-error">*</span></label>
                        <input 
                            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary" 
                            type="text" 
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                        {errors.title && <p className="text-error text-label-sm">{errors.title[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface">Description</label>
                        <textarea 
                            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md h-24 resize-none focus:ring-2 focus:ring-primary" 
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface">Duration <span className="text-error">*</span></label>
                            <div className="relative">
                                <input 
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary" 
                                    type="number" 
                                    min="1"
                                    value={formData.duration}
                                    onChange={(e) => handleChange('duration', e.target.value)}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-outline">mins</span>
                            </div>
                            {errors.duration && <p className="text-error text-label-sm">{errors.duration[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface">Max Attempts <span className="text-error">*</span></label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary" 
                                type="number" 
                                min="1"
                                value={formData.max_attempts}
                                onChange={(e) => handleChange('max_attempts', e.target.value)}
                            />
                            {errors.max_attempts && <p className="text-error text-label-sm">{errors.max_attempts[0]}</p>}
                        </div>
                    </div>
                </div>

                {/* Scheduling */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm space-y-stack-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                        <Icon name="calendar_month" className="text-primary" />
                        Scheduling
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface">Start Date</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary" 
                                type="datetime-local"
                                value={formData.start_date}
                                onChange={(e) => handleChange('start_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface">Due Date</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary" 
                                type="datetime-local"
                                value={formData.due_date}
                                onChange={(e) => handleChange('due_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface">Pass Threshold <span className="text-error">*</span></label>
                            <div className="relative">
                                <input 
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary" 
                                    type="number" 
                                    min="0" max="100"
                                    value={formData.pass_threshold}
                                    onChange={(e) => handleChange('pass_threshold', e.target.value)}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-outline">%</span>
                            </div>
                            {errors.pass_threshold && <p className="text-error text-label-sm">{errors.pass_threshold[0]}</p>}
                        </div>
                    </div>
                </div>

                {/* Questions Info (read-only) */}
                {assessment.questions && assessment.questions.length > 0 && (
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm space-y-stack-md">
                        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                            <Icon name="quiz" className="text-primary" />
                            Questions ({assessment.questions.length})
                        </h3>
                        <p className="text-on-surface-variant font-body-md">Questions cannot be changed after creation. To modify questions, create a new assessment.</p>
                        <div className="space-y-2">
                            {assessment.questions.map((aq, idx) => {
                                const q = aq.class_question || aq.classQuestion || {};
                                const plainText = (q.question || '').replace(/<[^>]+>/g, '');
                                return (
                                    <div key={aq.id || idx} className="flex gap-4 p-3 rounded-lg bg-surface-container-low">
                                        <span className="font-label-sm font-bold text-outline shrink-0">{idx + 1}</span>
                                        <p className="text-body-md text-on-surface truncate flex-1">{plainText || 'Question'}</p>
                                        <span className="font-label-sm text-primary shrink-0">{q.score || 0} pts</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/50">
                    <button 
                        onClick={handleBack}
                        className="px-6 h-12 rounded-full border border-outline text-on-surface-variant font-label-md hover:bg-surface transition-colors active:scale-95"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 h-12 rounded-full bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </DashboardTemplate>
    );
}
