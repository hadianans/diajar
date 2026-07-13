import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentBasicInfoForm from '@/Components/features/teacher-assignments/AssignmentBasicInfoForm';
import RubricBuilder from '@/Components/features/teacher-assignments/RubricBuilder';
import AssignmentAttachmentForm from '@/Components/features/teacher-assignments/AssignmentAttachmentForm';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError, confirmDelete } from '@/utils/swal';

export default function Edit({ assignmentId }) {
    const { data: assignment, loading } = useApiGet(`/assignments/${assignmentId}`);
    const { data: classes } = useApiGet('/classes');
    const { data: chapters } = useApiGet('/chapters');

    const [formData, setFormData] = useState(null);
    const [rubric, setRubric] = useState({ title: '', description: '', criteria: [] });
    const [attachments, setAttachments] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Pre-populate form when assignment data loads
    useEffect(() => {
        if (assignment && !formData) {
            setFormData({
                class_id: assignment.class_id || '',
                chapter_id: assignment.chapter_id || '',
                material_id: assignment.material_id || null,
                title: assignment.title || '',
                description: assignment.description || '',
                due_date: assignment.due_date ? assignment.due_date.slice(0, 16) : '',
                grade: assignment.grade ?? 100,
                status: assignment.status || 'open',
            });

            // Pre-populate rubric if exists
            if (assignment.rubric) {
                setRubric({
                    id: assignment.rubric.id,
                    title: assignment.rubric.title || '',
                    description: assignment.rubric.description || '',
                    criteria: (assignment.rubric.criteria || []).map(c => ({
                        id: c.id,
                        title: c.title || '',
                        description: c.description || '',
                        weight: c.weight || 0,
                        levels: (c.levels || []).map(l => ({
                            id: l.id,
                            label: l.label || '',
                            score: l.score || 0,
                            description: l.description || '',
                        })),
                    })),
                });
            }

            if (assignment.attachments) {
                setAttachments(assignment.attachments.map(att => ({ ...att, isNew: false })));
            }
        }
    }, [assignment, formData]);

    const handleSave = async () => {
        setIsSaving(true);
        setErrors({});
        try {
            const payload = { ...formData };
            if (rubric && rubric.criteria && rubric.criteria.length > 0) {
                payload.rubric = rubric;
            }

            await api.put(`/assignments/${assignmentId}`, payload);

            const newAttachments = attachments.filter(a => a.isNew);
            if (newAttachments.length > 0) {
                const uploadData = new FormData();
                newAttachments.forEach((att) => {
                    uploadData.append('attachments[]', att.file);
                    uploadData.append('attachment_titles[]', att.title);
                });
                await api.post(`/assignments/${assignmentId}/attachments`, uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            router.visit(route('teacher.assignments.show', { assignmentId }));
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                showError('Error', err.response?.data?.message || 'Error updating assignment');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveExistingAttachment = async (attachmentId) => {
        const confirmed = await confirmDelete('Remove Attachment?', 'This action cannot be undone.');
        if (!confirmed) return;
        try {
            await api.delete(`/assignments/${assignmentId}/attachments/${attachmentId}`);
        } catch (err) {
            showError('Error', err.response?.data?.message || 'Error removing attachment');
        }
    };

    const handleBack = () => {
        router.visit(route('teacher.assignments.show', { assignmentId }));
    };

    if (loading || !formData) {
        return (
            <DashboardTemplate role="teacher" activeTab="assignments" title="Loading...">
                <div className="text-center py-12 text-on-surface-variant">Loading assignment data...</div>
            </DashboardTemplate>
        );
    }

    const headerSection = (
        <section className="mb-stack-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                    <button onClick={handleBack} className="hover:text-primary transition-colors flex items-center gap-1 text-label-md">
                        <Icon name="arrow_back" className="text-[18px]" />
                        Back to Assignment
                    </button>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Edit Assignment</h2>
                <p className="text-on-surface-variant font-body-md">Modify the assignment details below.</p>
            </div>
        </section>
    );

    return (
        <DashboardTemplate 
            role="teacher" 
            activeTab="assignments" 
            title="Edit Assignment" 
            headerSection={headerSection}
        >
            <Head title={`Edit Assignment: ${formData.title || ''}`} />

            <div className="space-y-stack-lg max-w-screen-md mx-auto w-full pb-32">
                <AssignmentBasicInfoForm 
                    formData={formData}
                    onChange={setFormData}
                    errors={errors}
                    classes={classes || []}
                    chapters={chapters || []}
                />
                <RubricBuilder 
                    rubric={rubric}
                    onChange={setRubric}
                    onClear={async () => {
                        const confirmed = await confirmDelete('Delete Rubric?', 'This will completely clear and delete this rubric.');
                        if (!confirmed) return;
                        try {
                            if (assignment.rubric) {
                                await api.delete(`/assignments/${assignmentId}/rubric`);
                            }
                            setRubric({ title: '', description: '', criteria: [] });
                        } catch (err) {
                            showError('Error', err.response?.data?.message || 'Error deleting rubric');
                        }
                    }}
                />
                
                <AssignmentAttachmentForm 
                    attachments={attachments}
                    onChange={setAttachments}
                    onRemoveExisting={handleRemoveExistingAttachment}
                />

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-outline-variant/50 mt-8">
                    <div className="hidden md:flex items-center gap-2 text-outline mr-auto">
                        <Icon name="edit_note" className="text-[18px]" />
                        <span className="text-label-sm">Editing: {formData.title || 'Untitled'}</span>
                    </div>
                    <button 
                        onClick={handleBack}
                        className="w-full sm:w-auto px-6 h-12 rounded-full border border-outline text-on-surface-variant font-label-md hover:bg-surface transition-colors active:scale-95"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full sm:w-auto px-8 h-12 rounded-full bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </DashboardTemplate>
    );
}
