import React, { useState, useEffect } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';

export default function AcademicYearModal({ show, onClose, onSuccess, initialData = null }) {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        name: '',
        date_start: '',
        date_end: '',
        status: 'archive'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            setFormData({
                name: initialData?.year || '',
                date_start: initialData?.date_start ? new Date(initialData.date_start).toISOString().split('T')[0] : '',
                date_end: initialData?.date_end ? new Date(initialData.date_end).toISOString().split('T')[0] : '',
                status: (initialData?.status || 'Archived').toLowerCase() === 'active' ? 'active' : 'archive'
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
                await api.put(`/school-years/${initialData.id}`, formData);
            } else {
                await api.post('/school-years', formData);
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
                        {isEdit ? 'Edit Academic Year' : 'New Academic Year'}
                    </h3>
                    <button onClick={onClose} disabled={loading} className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Name (e.g. 2024/2025)</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full bg-[#F1F5F9] border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.name ? 'ring-2 ring-error' : ''}`}
                            required
                        />
                        {errors.name && <p className="text-error text-xs mt-1">{errors.name[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.date_start}
                                onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                                className={`w-full bg-[#F1F5F9] border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.date_start ? 'ring-2 ring-error' : ''}`}
                                required
                            />
                            {errors.date_start && <p className="text-error text-xs mt-1">{errors.date_start[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-label-md font-label-md text-on-surface-variant mb-1">End Date</label>
                            <input
                                type="date"
                                value={formData.date_end}
                                onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                                className={`w-full bg-[#F1F5F9] border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.date_end ? 'ring-2 ring-error' : ''}`}
                                required
                            />
                            {errors.date_end && <p className="text-error text-xs mt-1">{errors.date_end[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className={`w-full bg-[#F1F5F9] border-none rounded-xl p-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md ${errors.status ? 'ring-2 ring-error' : ''}`}
                        >
                            <option value="active">Active</option>
                            <option value="archive">Archived</option>
                        </select>
                        {errors.status && <p className="text-error text-xs mt-1">{errors.status[0]}</p>}
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
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
