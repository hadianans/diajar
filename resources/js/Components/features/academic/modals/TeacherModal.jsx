import React, { useState, useEffect } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import { showError } from '@/utils/swal';

export default function TeacherModal({ show, onClose, onSuccess, subjectId, linkedTeacherIds = [] }) {
    const [teachers, setTeachers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (show) {
            fetchTeachers();
            setSelectedIds([]);
            setSearch('');
        }
    }, [show]);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                fetchTeachers(search);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [search, show]);

    const fetchTeachers = async (searchQuery = '') => {
        setFetching(true);
        try {
            const res = await api.get('/users', {
                params: { role: 'teacher', search: searchQuery }
            });
            // api interceptor unwraps to response.data, so res.users is the pagination object
            const allTeachers = res?.users?.data || [];
            setTeachers(allTeachers.filter(t => !linkedTeacherIds.includes(t.id)));
        } catch (err) {
            console.error('Failed to fetch teachers:', err);
        } finally {
            setFetching(false);
        }
    };

    const handleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedIds.length === 0) return;

        setLoading(true);
        try {
            await api.post(`/subjects/${subjectId}/teachers`, {
                teacher_ids: selectedIds
            });
            onSuccess();
        } catch (err) {
            showError('Error', err.response?.data?.message || 'Failed to link teachers.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={loading ? undefined : onClose} maxWidth="md">
            <div className="p-6 flex flex-col h-[80vh] md:h-auto md:max-h-[85vh]">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                        Link Teachers to Subject
                    </h3>
                    <button onClick={onClose} disabled={loading} className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" />
                    </button>
                </div>
                
                <div className="mb-4 shrink-0 relative">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#F1F5F9] border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-body-md font-body-md"
                    />
                </div>

                <div className="flex-1 overflow-y-auto min-h-[300px] bg-surface-container-lowest rounded-xl border border-outline-variant p-2 mb-4">
                    {fetching && teachers.length === 0 ? (
                        <div className="flex justify-center py-8 text-on-surface-variant text-sm">Loading...</div>
                    ) : teachers.length === 0 ? (
                        <div className="flex justify-center py-8 text-on-surface-variant text-sm">No unlinked teachers found.</div>
                    ) : (
                        <div className="space-y-1">
                            {teachers.map(teacher => (
                                <label 
                                    key={teacher.id} 
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors"
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.includes(teacher.id)}
                                        onChange={() => handleSelect(teacher.id)}
                                        className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <div className="text-body-md font-body-md font-medium text-on-surface">{teacher.full_name}</div>
                                        <div className="text-body-sm text-on-surface-variant">{teacher.email || teacher.username}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-between items-center shrink-0 border-t border-outline-variant">
                    <div className="text-sm text-on-surface-variant">
                        {selectedIds.length} selected
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl font-label-md text-label-md hover:bg-surface-variant text-on-surface transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || selectedIds.length === 0}
                            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Linking...' : 'Link Selected'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
