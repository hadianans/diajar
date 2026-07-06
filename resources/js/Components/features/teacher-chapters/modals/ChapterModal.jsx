import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import useApiGet from '@/hooks/useApiGet';

export default function ChapterModal({ show, onClose, onSuccess, initialData = null, classesData }) {
    const isEdit = !!initialData;
    const { data: subjects, loading: subjectsLoading } = useApiGet(show ? '/subjects' : null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subject_id: '',
        order: '',
        target_grade: '',
        target_groups: [],
        cover_image: '',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Extract grades and groups from classesData
    const gradesAndGroups = useMemo(() => {
        if (!classesData) return {};
        const map = {};
        classesData.forEach(cls => {
            cls.group_years?.forEach(gy => {
                if (gy.grade) {
                    if (!map[gy.grade]) map[gy.grade] = [];
                    if (gy.group && !map[gy.grade].find(g => g.id === gy.group.id)) {
                        map[gy.grade].push(gy.group);
                    }
                }
            });
        });
        return map;
    }, [classesData]);

    const availableGrades = Object.keys(gradesAndGroups).map(Number).sort((a, b) => a - b);
    const availableGroups = formData.target_grade ? (gradesAndGroups[formData.target_grade] || []) : [];

    useEffect(() => {
        if (show) {
            setFormData({
                name: initialData?.name || '',
                description: initialData?.description || '',
                subject_id: initialData?.subject_id || (subjects && subjects.length > 0 ? subjects[0].id : ''),
                order: initialData?.order || '',
                target_grade: initialData?.target_grade || '',
                target_groups: initialData?.target_groups || [],
                cover_image: initialData?.cover_image || '',
                tags: initialData?.tags || []
            });
            setTagInput('');
            setErrors({});
        }
    }, [show, initialData, subjects]);

    // Handle grade change and auto-check all groups
    const handleGradeChange = (grade) => {
        const selectedGrade = Number(grade);
        const groupsForGrade = gradesAndGroups[selectedGrade] || [];
        setFormData({
            ...formData,
            target_grade: selectedGrade,
            target_groups: groupsForGrade.map(g => g.id)
        });
    };

    // Initialize default groups if creating and grade is auto-selected
    useEffect(() => {
        if (show && !isEdit && formData.target_grade && formData.target_groups.length === 0) {
            const groupsForGrade = gradesAndGroups[formData.target_grade] || [];
            setFormData(prev => ({ ...prev, target_groups: groupsForGrade.map(g => g.id) }));
        }
    }, [show, isEdit, formData.target_grade, gradesAndGroups]);

    const handleGroupToggle = (groupId) => {
        setFormData(prev => {
            const groups = [...prev.target_groups];
            if (groups.includes(groupId)) {
                return { ...prev, target_groups: groups.filter(id => id !== groupId) };
            } else {
                return { ...prev, target_groups: [...groups, groupId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEdit) {
                await api.put(`/chapters/${initialData.id}`, formData);
            } else {
                await api.post('/chapters', formData);
            }
            onSuccess();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || 'An error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={loading ? undefined : onClose} maxWidth="md">
            <div className="p-6 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                        {isEdit ? 'Edit Chapter' : 'New Chapter'}
                    </h3>
                    <button onClick={onClose} disabled={loading} className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Subject *</label>
                        <select
                            value={formData.subject_id}
                            onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                            className={`w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.subject_id ? 'ring-2 ring-error' : ''}`}
                            disabled={isEdit || subjectsLoading}
                            required
                        >
                            <option value="" disabled>Select Subject</option>
                            {subjects?.map(s => (
                                <option key={s.id} value={s.id}>{s.subject_name}</option>
                            ))}
                        </select>
                        {errors.subject_id && <p className="text-error text-xs mt-1">{errors.subject_id[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Chapter Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.name ? 'ring-2 ring-error' : ''}`}
                            placeholder="e.g. Molecular Biology"
                            required
                        />
                        {errors.name && <p className="text-error text-xs mt-1">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md min-h-[100px] resize-y ${errors.description ? 'ring-2 ring-error' : ''}`}
                            placeholder="Brief description of the chapter..."
                        />
                        {errors.description && <p className="text-error text-xs mt-1">{errors.description[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Chapter Sequence</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                className={`w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.order ? 'ring-2 ring-error' : ''}`}
                                placeholder="e.g. 1"
                            />
                            {errors.order && <p className="text-error text-xs mt-1">{errors.order[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Target Grade Level</label>
                            <select
                                value={formData.target_grade}
                                onChange={(e) => handleGradeChange(e.target.value)}
                                className={`w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.target_grade ? 'ring-2 ring-error' : ''}`}
                            >
                                <option value="" disabled>Select Grade</option>
                                {availableGrades.map(grade => (
                                    <option key={grade} value={grade}>Grade {grade}</option>
                                ))}
                            </select>
                            {errors.target_grade && <p className="text-error text-xs mt-1">{errors.target_grade[0]}</p>}
                        </div>
                    </div>

                    {availableGroups.length > 0 && (
                        <div className="bg-surface-container-low rounded-xl p-4">
                            <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Target Groups (Visibility)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {availableGroups.map(group => (
                                    <label key={group.id} className="flex items-center gap-2 cursor-pointer group hover:bg-surface-container p-2 rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.target_groups.includes(group.id)}
                                            onChange={() => handleGroupToggle(group.id)}
                                        />
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${formData.target_groups.includes(group.id) ? 'bg-primary border-primary text-on-primary' : 'border-outline group-hover:border-primary text-transparent'}`}>
                                            <Icon name="check" className="text-[14px]" />
                                        </div>
                                        <span className="text-body-md font-body-md text-on-surface">{group.name}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.target_groups && <p className="text-error text-xs mt-2">{errors.target_groups[0]}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Tags (Max 3)</label>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (tagInput.trim() && formData.tags.length < 3) {
                                            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
                                            setTagInput('');
                                        }
                                    }
                                }}
                                disabled={formData.tags.length >= 3}
                                className={`flex-1 bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.tags ? 'ring-2 ring-error' : ''}`}
                                placeholder={formData.tags.length >= 3 ? "Maximum tags reached" : "Type and press Enter"}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (tagInput.trim() && formData.tags.length < 3) {
                                        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
                                        setTagInput('');
                                    }
                                }}
                                disabled={!tagInput.trim() || formData.tags.length >= 3}
                                className="px-4 py-3 bg-primary-container text-on-primary-container rounded-xl font-label-md font-bold disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag, idx) => (
                                    <div key={idx} className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-lg text-sm font-medium">
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }))}
                                            className="text-on-secondary-container/70 hover:text-on-secondary-container"
                                        >
                                            <Icon name="close" className="text-[16px]" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.tags && <p className="text-error text-xs mt-1">{errors.tags[0]}</p>}
                        {Object.keys(errors).filter(key => key.startsWith('tags.')).map(key => (
                            <p key={key} className="text-error text-xs mt-1">{errors[key][0]}</p>
                        ))}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl font-label-md text-label-md hover:bg-surface-variant text-on-surface transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Chapter'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
