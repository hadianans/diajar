import React, { useState, useEffect } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import useApiGet from '@/hooks/useApiGet';

export default function ChapterModal({ show, onClose, onSuccess, initialData = null }) {
    const isEdit = !!initialData;
    const { data: subjects, loading: subjectsLoading } = useApiGet(show ? '/subjects' : null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subject_id: '',
        order: '',
        cover_image: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            setFormData({
                name: initialData?.name || '',
                description: initialData?.description || '',
                subject_id: initialData?.subject_id || (subjects && subjects.length > 0 ? subjects[0].id : ''),
                order: initialData?.order || '',
                cover_image: initialData?.cover_image || ''
            });
            setErrors({});
        }
    }, [show, initialData, subjects]);

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
            <div className="p-6">
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
                    
                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Chapter Sequence (Order)</label>
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
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Cover Image URL (Optional)</label>
                        <input
                            type="url"
                            value={formData.cover_image}
                            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                            className={`w-full bg-surface-container-low border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.cover_image ? 'ring-2 ring-error' : ''}`}
                            placeholder="https://..."
                        />
                        {errors.cover_image && <p className="text-error text-xs mt-1">{errors.cover_image[0]}</p>}
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
