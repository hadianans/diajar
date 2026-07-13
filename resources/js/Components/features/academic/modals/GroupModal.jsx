import React, { useState, useEffect } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import { showError } from '@/utils/swal';

export default function GroupModal({ show, onClose, onSuccess, initialData = null, activeYearId = null }) {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        name: '',
        grade: ''
    });
    const [groups, setGroups] = useState([{ name: '', grade: '' }]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            setFormData({
                name: initialData?.groupName || '',
                grade: initialData?.grade || ''
            });
            setGroups([{ name: '', grade: '' }]);
            setErrors({});
        }
    }, [show, initialData]);

    const handleAddGroupRow = () => {
        setGroups([...groups, { name: '', grade: '' }]);
    };

    const handleRemoveGroupRow = (index) => {
        setGroups(groups.filter((_, i) => i !== index));
    };

    const handleGroupChange = (index, field, value) => {
        const newGroups = [...groups];
        newGroups[index][field] = value;
        setGroups(newGroups);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEdit) {
                // To update a group, we might need to update name and grade separately based on backend structure
                const promises = [];
                
                if (formData.name !== initialData.groupName) {
                    promises.push(api.put(`/groups/${initialData.id}`, { name: formData.name }));
                }
                
                if (formData.grade !== initialData.grade) {
                    promises.push(api.patch(`/group-years/${initialData.groupYearId}/grade`, { grade: formData.grade }));
                }

                if (promises.length > 0) {
                    await Promise.all(promises);
                }
            } else {
                await api.post('/groups', {
                    groups: groups.filter(g => g.name.trim() !== '' && g.grade !== ''),
                    year_id: activeYearId
                });
            }
            onSuccess();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                showError('Error', err.response?.data?.message || 'An error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={loading ? undefined : onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                        {isEdit ? 'Edit Student Group' : 'New Student Group'}
                    </h3>
                    <button onClick={onClose} disabled={loading} className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isEdit && !activeYearId && (
                        <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm mb-4">
                            No active academic year found. You cannot create a group without an active academic year.
                        </div>
                    )}
                    
                    {isEdit ? (
                        <>
                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Group Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full bg-[#F1F5F9] border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-body-md font-body-md ${errors.name ? 'ring-2 ring-error' : ''}`}
                                    placeholder="e.g. Science Class A"
                                    required
                                />
                                {errors.name && <p className="text-error text-xs mt-1">{errors.name[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Grade Level</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    className={`w-full bg-[#F1F5F9] border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-body-md font-body-md ${errors.grade ? 'ring-2 ring-error' : ''}`}
                                    placeholder="e.g. 10"
                                    required
                                />
                                {errors.grade && <p className="text-error text-xs mt-1">{errors.grade[0]}</p>}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 pb-2">
                            {groups.map((group, index) => (
                                <div key={index} className="flex gap-3 items-start bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                                    <div className="flex-1">
                                        <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Group Name</label>
                                        <input
                                            type="text"
                                            value={group.name}
                                            onChange={(e) => handleGroupChange(index, 'name', e.target.value)}
                                            className={`w-full bg-surface-container-lowest border-none rounded-lg p-2.5 focus:ring-2 focus:ring-primary transition-all text-body-sm font-body-sm shadow-sm ${errors[`groups.${index}.name`] ? 'ring-2 ring-error' : ''}`}
                                            placeholder="e.g. Class 10A"
                                            required
                                        />
                                        {errors[`groups.${index}.name`] && <p className="text-error text-xs mt-1">{errors[`groups.${index}.name`][0]}</p>}
                                    </div>
                                    <div className="w-24 shrink-0">
                                        <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Grade</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={group.grade}
                                            onChange={(e) => handleGroupChange(index, 'grade', e.target.value)}
                                            className={`w-full bg-surface-container-lowest border-none rounded-lg p-2.5 focus:ring-2 focus:ring-primary transition-all text-body-sm font-body-sm shadow-sm ${errors[`groups.${index}.grade`] ? 'ring-2 ring-error' : ''}`}
                                            placeholder="e.g. 10"
                                            required
                                        />
                                        {errors[`groups.${index}.grade`] && <p className="text-error text-xs mt-1">{errors[`groups.${index}.grade`][0]}</p>}
                                    </div>
                                    {groups.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGroupRow(index)}
                                            className="mt-6 p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors shrink-0 flex items-center justify-center"
                                            title="Remove"
                                        >
                                            <Icon name="delete" className="text-[20px]" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddGroupRow}
                                className="w-full py-3 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary-container/10 transition-all font-label-md"
                            >
                                <Icon name="add" className="text-[20px]" />
                                Add Another Group
                            </button>
                            {errors.groups && <p className="text-error text-sm text-center">{errors.groups[0]}</p>}
                        </div>
                    )}

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
                            disabled={loading || (!isEdit && !activeYearId)}
                            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
