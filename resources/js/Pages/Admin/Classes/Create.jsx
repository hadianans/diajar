import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import api from '@/utils/api';
import useApiGet from '@/hooks/useApiGet';
import Icon from '@/Components/shared/ui/Icon';
import { showSuccess, showError } from '@/utils/swal';
import GroupYearSelectionModal from '@/Components/features/academic/modals/GroupYearSelectionModal';

export default function Create() {
    const { data: subjects } = useApiGet('/subjects');
    const { data: groups } = useApiGet('/groups');

    const [form, setForm] = useState({
        subject_id: '',
        teacher_id: '',
        group_years_ids: [],
        day_schedule: '',
        time_schedule: '',
        assignment_weight: 50,
        assessment_weight: 50
    });

    const [teachers, setTeachers] = useState([]);
    const [groupYears, setGroupYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);

    useEffect(() => {
        if (form.subject_id && subjects) {
            const subject = subjects.find(s => s.id.toString() === form.subject_id.toString());
            if (subject && subject.subject_teachers) {
                setTeachers(subject.subject_teachers.map(st => st.teacher));
            } else {
                setTeachers([]);
            }
        } else {
            setTeachers([]);
        }
        setForm(prev => ({ ...prev, teacher_id: '' }));
    }, [form.subject_id, subjects]);

    useEffect(() => {
        if (groups) {
            // API returns GroupYear objects directly, not Groups.
            const allGroupYears = groups.map(gy => ({
                id: gy.id,
                group_name: gy.group?.name || 'Unknown',
                grade: gy.grade
            }));
            setGroupYears(allGroupYears);
        }
    }, [groups]);

    const handleChange = (e) => {
        if (e.target.name === 'group_years_ids') {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            setForm({ ...form, [e.target.name]: values });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/classes', {
                subject_id: parseInt(form.subject_id),
                teacher_id: parseInt(form.teacher_id),
                group_years_ids: form.group_years_ids.map(id => parseInt(id)),
                day_schedule: form.day_schedule ? parseInt(form.day_schedule) : null,
                time_schedule: form.time_schedule || null,
                assignment_weight: parseFloat(form.assignment_weight),
                assessment_weight: parseFloat(form.assessment_weight)
            });
            showSuccess('Class created successfully');
            router.visit('/admin/classes');
        } catch (err) {
            showError('Error', err.response?.data?.message || 'Failed to create class.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => router.visit('/admin/classes');

    return (
        <>
            <Head title="Generate New Class" />

            <DashboardTemplate
                activeTab="Classes"
                title="Generate New Class"
                viewLabel="Admin View"
                showBack={true}
                onBack={handleBack}
            >
                <div className="max-w-3xl mx-auto bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="font-headline-md text-headline-md font-bold mb-6">Class Configuration</h2>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-label-md text-on-surface-variant">Subject *</label>
                                <select required name="subject_id" value={form.subject_id} onChange={handleChange} className="p-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary">
                                    <option value="">Select a subject</option>
                                    {subjects?.map(s => (
                                        <option key={s.id} value={s.id}>{s.name || s.subject_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-label-md text-on-surface-variant">Teacher *</label>
                                <select required name="teacher_id" value={form.teacher_id} onChange={handleChange} className="p-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary" disabled={!form.subject_id}>
                                    <option value="">{form.subject_id ? "Select a linked teacher" : "Select a subject first"}</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-label-md text-on-surface-variant">Cohorts / Group Years *</label>
                            <div 
                                onClick={() => setIsCohortModalOpen(true)}
                                className="p-3 bg-surface-container-low rounded-xl border border-outline-variant hover:border-primary cursor-pointer flex justify-between items-center transition-colors min-h-[50px]"
                            >
                                <span className={form.group_years_ids.length > 0 ? "text-on-surface" : "text-on-surface-variant"}>
                                    {form.group_years_ids.length > 0 
                                        ? `${form.group_years_ids.length} cohort(s) selected` 
                                        : "Select cohorts..."}
                                </span>
                                <Icon name="expand_more" />
                            </div>
                            
                            {form.group_years_ids.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.group_years_ids.map(id => {
                                        const gy = groupYears.find(g => g.id === id);
                                        return gy ? (
                                            <span key={id} className="px-3 py-1 bg-primary-container text-on-primary-container rounded-lg text-sm font-medium flex items-center gap-1">
                                                {gy.group_name} {gy.grade ? `- Grade ${gy.grade}` : ''}
                                                <Icon name="close" className="text-[14px] cursor-pointer hover:text-error ml-1" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setForm(prev => ({
                                                        ...prev,
                                                        group_years_ids: prev.group_years_ids.filter(i => i !== id)
                                                    }));
                                                }} />
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-label-md text-on-surface-variant">Day of Week (Optional)</label>
                                <select name="day_schedule" value={form.day_schedule} onChange={handleChange} className="p-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary">
                                    <option value="">Not set</option>
                                    <option value="0">Sunday</option>
                                    <option value="1">Monday</option>
                                    <option value="2">Tuesday</option>
                                    <option value="3">Wednesday</option>
                                    <option value="4">Thursday</option>
                                    <option value="5">Friday</option>
                                    <option value="6">Saturday</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-label-md text-on-surface-variant">Time Schedule (Optional)</label>
                                <input type="time" name="time_schedule" value={form.time_schedule} onChange={handleChange} className="p-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-outline-variant rounded-xl bg-surface-container-low">
                            <div className="flex flex-col gap-2">
                                <label className="font-label-md text-on-surface-variant">Assignment Weight (%)</label>
                                <input type="number" required name="assignment_weight" value={form.assignment_weight} onChange={handleChange} min="0" max="100" className="p-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-label-md text-on-surface-variant">Assessment Weight (%)</label>
                                <input type="number" required name="assessment_weight" value={form.assessment_weight} onChange={handleChange} min="0" max="100" className="p-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <p className="md:col-span-2 text-xs text-on-surface-variant">Must sum to 100%.</p>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-outline-variant">
                            <button disabled={loading} type="submit" className="bg-primary text-on-primary px-8 py-3 rounded-xl font-label-lg shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Create Class'}
                            </button>
                        </div>
                    </form>
                </div>
            </DashboardTemplate>

            <GroupYearSelectionModal 
                show={isCohortModalOpen}
                onClose={() => setIsCohortModalOpen(false)}
                onApply={(selectedIds) => {
                    setForm(prev => ({ ...prev, group_years_ids: selectedIds }));
                }}
                groupYears={groupYears}
                initialSelected={form.group_years_ids}
            />
        </>
    );
}
