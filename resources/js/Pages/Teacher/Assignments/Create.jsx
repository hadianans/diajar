import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentBasicInfoForm from '@/Components/features/teacher-assignments/AssignmentBasicInfoForm';
import RubricBuilder from '@/Components/features/teacher-assignments/RubricBuilder';
import AssignmentAttachmentForm from '@/Components/features/teacher-assignments/AssignmentAttachmentForm';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError, confirmAction } from '@/utils/swal';

export default function Create() {
    const { data: classes } = useApiGet('/classes');
    const { data: chapters } = useApiGet('/chapters');

    const [formData, setFormData] = useState({
        class_id: '',
        chapter_id: '',
        material_id: null,
        title: '',
        description: '',
        due_date: '',
        grade: 100,
    });

    const [rubric, setRubric] = useState({
        title: '',
        description: '',
        criteria: [],
    });

    const [attachments, setAttachments] = useState([]);

    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (status = 'open') => {
        setIsSaving(true);
        setErrors({});
        try {
            const payload = { ...formData, status };

            // Only include rubric if it has criteria
            if (rubric.criteria.length > 0 && rubric.title) {
                payload.rubric = rubric;
            }

            const response = await api.post('/assignments', payload);
            const assignmentId = response.id;

            if (attachments.length > 0) {
                const uploadData = new FormData();
                attachments.forEach((att) => {
                    uploadData.append('attachments[]', att.file);
                    uploadData.append('attachment_titles[]', att.title);
                });
                await api.post(`/assignments/${assignmentId}/attachments`, uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            router.visit(route('teacher.assignments.index'));
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                showError('Kesalahan', err.response?.data?.message || 'Kesalahan saat membuat tugas');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        router.visit(route('teacher.assignments.index'));
    };

    const headerSection = (
        <section className="mb-stack-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                    <button onClick={handleBack} className="hover:text-primary transition-colors flex items-center gap-1 text-label-md">
                        <Icon name="arrow_back" className="text-[18px]" />
                        Kembali ke Tugas
                    </button>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Buat Tugas</h2>
                <p className="text-on-surface-variant font-body-md">Siapkan tugas baru untuk kelas Anda.</p>
            </div>
        </section>
    );

    return (
        <DashboardTemplate 
            role="teacher" 
            activeTab="assignments" 
            title="Buat Tugas" 
            headerSection={headerSection}
        >
            <Head title="Buat Tugas" />

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
                        const confirmed = await confirmAction('Bersihkan Rubrik?', 'Apakah Anda yakin ingin membersihkan rubrik?');
                        if (confirmed) {
                            setRubric({ title: '', description: '', criteria: [] });
                        }
                    }}
                />
                
                <AssignmentAttachmentForm 
                    attachments={attachments}
                    onChange={setAttachments}
                />

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-outline-variant/50 mt-8">
                    <div className="hidden md:flex items-center gap-2 text-outline mr-auto">
                        <Icon name="info" className="text-[18px]" />
                        <span className="text-label-sm">Isi semua bidang yang wajib diisi untuk menerbitkan.</span>
                    </div>
                    <button 
                        onClick={() => handleSave('closed')}
                        disabled={isSaving}
                        className="w-full sm:w-auto px-6 h-12 rounded-full border border-outline text-on-surface-variant font-label-md hover:bg-surface transition-colors active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Draf'}
                    </button>
                    <button 
                        onClick={() => handleSave('open')}
                        disabled={isSaving}
                        className="w-full sm:w-auto px-8 h-12 rounded-full bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Menerbitkan...' : 'Terbitkan Sekarang'}
                    </button>
                </div>
            </div>
        </DashboardTemplate>
    );
}
