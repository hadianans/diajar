import React, { useState, useEffect } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import Pagination from '@/Components/shared/ui/Pagination';
import api from '@/utils/api';

export default function StudentModal({ show, onClose, onSuccess, groupId, yearId }) {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        if (show && yearId) {
            fetchUnlinkedStudents();
            setSelectedStudents([]);
            setSearch('');
            setCurrentPage(1);
        }
    }, [show, yearId]);

    useEffect(() => {
        if (show && yearId) {
            const timer = setTimeout(() => {
                fetchUnlinkedStudents(search);
                setCurrentPage(1); // reset page on search
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [search, show, yearId]);

    const fetchUnlinkedStudents = async (searchQuery = '') => {
        setFetching(true);
        try {
            const res = await api.get('/groups/unlinked-students', {
                params: { year_id: yearId, search: searchQuery }
            });
            setStudents(res || []);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setFetching(false);
        }
    };

    const handleSelect = (student) => {
        setSelectedStudents(prev => 
            prev.some(s => s.id === student.id) 
                ? prev.filter(s => s.id !== student.id) 
                : [...prev, student]
        );
    };

    const handleRemoveSelected = (id) => {
        setSelectedStudents(prev => prev.filter(s => s.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedStudents.length === 0) return;

        setLoading(true);
        try {
            await api.post(`/groups/${groupId}/students`, {
                year_id: yearId,
                student_ids: selectedStudents.map(s => s.id)
            });
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add students.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedStudents = students.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Modal show={show} onClose={loading ? undefined : onClose} maxWidth="4xl">
            <div className="p-6 flex flex-col h-[85vh] md:h-[600px]">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                            Add Students to Group
                        </h3>
                        <p className="text-body-sm text-on-surface-variant mt-1">Select students from the list to add them.</p>
                    </div>
                    <button onClick={onClose} disabled={loading} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" />
                    </button>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                    {/* Left Column: Student List */}
                    <div className="flex-1 flex flex-col min-w-0 border border-outline-variant/50 rounded-2xl overflow-hidden bg-surface">
                        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-[#F1F5F9] border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-white">
                            {fetching && students.length === 0 ? (
                                <div className="flex justify-center py-8 text-on-surface-variant text-sm">Loading...</div>
                            ) : students.length === 0 ? (
                                <div className="flex justify-center py-8 text-on-surface-variant text-sm">No unlinked students found.</div>
                            ) : (
                                <div className="space-y-1">
                                    {paginatedStudents.map(student => (
                                        <label 
                                            key={student.id} 
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors border border-transparent hover:border-outline-variant/30"
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={selectedStudents.some(s => s.id === student.id)}
                                                onChange={() => handleSelect(student)}
                                                className="w-5 h-5 rounded border-outline text-primary focus:ring-primary transition-all"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-body-md font-body-md font-medium text-on-surface truncate">{student.full_name}</div>
                                                <div className="text-body-sm text-on-surface-variant truncate">{student.email || student.username}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {students.length > 0 && (
                            <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0">
                                <Pagination 
                                    currentPage={currentPage}
                                    totalItems={students.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                    itemsPerPageOptions={[10, 20, 50, 100]}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Selected Students */}
                    <div className="w-full md:w-1/3 flex flex-col min-w-0 border border-outline-variant/50 rounded-2xl overflow-hidden bg-surface-container-lowest shrink-0">
                        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
                            <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">Selected</h4>
                            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
                                {selectedStudents.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {selectedStudents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant/70 space-y-3 px-4">
                                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
                                        <Icon name="person_add" className="text-3xl opacity-50" />
                                    </div>
                                    <p className="text-sm">No students selected yet. Check the boxes on the left to add them.</p>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {selectedStudents.map(student => (
                                        <div key={student.id} className="flex items-center gap-2 bg-white border border-outline-variant/60 rounded-lg px-3 py-1.5 shadow-sm max-w-full">
                                            <span className="text-sm font-medium text-on-surface truncate">{student.full_name}</span>
                                            <button 
                                                onClick={() => handleRemoveSelected(student.id)}
                                                className="text-on-surface-variant hover:text-error hover:bg-error-container rounded-full p-0.5 transition-colors shrink-0"
                                                type="button"
                                                title="Remove"
                                            >
                                                <Icon name="close" className="text-[16px]" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selectedStudents.length > 0 && (
                            <div className="p-4 border-t border-outline-variant/30 bg-white flex justify-end">
                                <button
                                    onClick={() => setSelectedStudents([])}
                                    className="text-error text-sm font-medium hover:underline px-2 py-1"
                                    type="button"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-6 flex justify-end items-center shrink-0 border-t border-outline-variant mt-6">
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
                            disabled={loading || selectedStudents.length === 0}
                            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2"
                        >
                            {loading && <Icon name="progress_activity" className="animate-spin text-[18px]" />}
                            {loading ? 'Adding...' : `Add ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
