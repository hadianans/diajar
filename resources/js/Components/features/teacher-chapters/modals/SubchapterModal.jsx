import React, { useState, useEffect } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import { showError } from '@/utils/swal';

export default function SubchapterModal({ show, onClose, onSuccess, initialData = null, chapterId }) {
    const isEdit = !!initialData;
    
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            setFormData({
                name: initialData?.name || '',
                description: initialData?.description || ''
            });
            setErrors({});
        }
    }, [show, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEdit) {
                await api.put(`/chapters/${chapterId}/subchapters/${initialData.id}`, formData);
            } else {
                await api.post(`/chapters/${chapterId}/subchapters`, formData);
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
                        {isEdit ? 'Edit Subchapter' : 'New Subchapter'}
                    </h3>
                    <button onClick={onClose} disabled={loading} className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Subchapter Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-body-md font-body-md ${errors.name ? 'ring-2 ring-error' : ''}`}
                            placeholder="e.g. Part 1: Basics"
                            required
                        />
                        {errors.name && <p className="text-error text-xs mt-1">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Description (Optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-body-md font-body-md min-h-[100px] resize-y ${errors.description ? 'ring-2 ring-error' : ''}`}
                            placeholder="Brief description..."
                        />
                        {errors.description && <p className="text-error text-xs mt-1">{errors.description[0]}</p>}
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
                            {loading ? 'Saving...' : 'Save Subchapter'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
