import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import Pagination from '@/Components/shared/ui/Pagination';

export default function GroupYearSelectionModal({ show, onClose, onApply, groupYears = [], initialSelected = [] }) {
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [search, setSearch] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        if (show) {
            const initial = groupYears.filter(gy => initialSelected.includes(gy.id));
            setSelectedGroups(initial);
            setSearch('');
            setCurrentPage(1);
        }
    }, [show, initialSelected, groupYears]);

    const filteredGroupYears = useMemo(() => {
        if (!search) return groupYears;
        const lowerSearch = search.toLowerCase();
        return groupYears.filter(gy => {
            const nameMatch = gy.group_name?.toLowerCase().includes(lowerSearch);
            const gradeMatch = gy.grade?.toString().includes(lowerSearch);
            return nameMatch || gradeMatch;
        });
    }, [groupYears, search]);

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedGroupYears = filteredGroupYears.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handleSelect = (group) => {
        setSelectedGroups(prev => 
            prev.some(g => g.id === group.id) 
                ? prev.filter(g => g.id !== group.id) 
                : [...prev, group]
        );
    };

    const handleRemoveSelected = (id) => {
        setSelectedGroups(prev => prev.filter(g => g.id !== id));
    };

    const handleApply = () => {
        onApply(selectedGroups.map(g => g.id));
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="p-6 flex flex-col h-[85vh] md:h-[600px]">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                            Select Cohorts / Group Years
                        </h3>
                        <p className="text-body-sm text-on-surface-variant mt-1">Select groups from the list to add them.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" />
                    </button>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                    {/* Left Column: Group List */}
                    <div className="flex-1 flex flex-col min-w-0 border border-outline-variant/50 rounded-2xl overflow-hidden bg-surface">
                        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                                <input
                                    type="text"
                                    placeholder="Search cohorts..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-[#F1F5F9] border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-body-md font-body-md shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-surface-container-lowest">
                            {filteredGroupYears.length === 0 ? (
                                <div className="flex justify-center py-8 text-on-surface-variant text-sm">
                                    {groupYears.length === 0 ? 'No cohorts available.' : 'No cohorts match your search.'}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {paginatedGroupYears.map(gy => (
                                        <label 
                                            key={gy.id} 
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors border border-transparent hover:border-outline-variant/30"
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={selectedGroups.some(g => g.id === gy.id)}
                                                onChange={() => handleSelect(gy)}
                                                className="w-5 h-5 rounded border-outline text-primary focus:ring-primary transition-all"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-body-md font-body-md font-medium text-on-surface truncate">
                                                    {gy.group_name}
                                                </div>
                                                {gy.grade && (
                                                    <div className="text-body-sm text-on-surface-variant truncate">
                                                        Grade {gy.grade}
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {filteredGroupYears.length > 0 && (
                            <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0">
                                <Pagination 
                                    currentPage={currentPage}
                                    totalItems={filteredGroupYears.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                    itemsPerPageOptions={[10, 20, 50, 100]}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Selected Groups */}
                    <div className="w-full md:w-1/3 flex flex-col min-w-0 border border-outline-variant/50 rounded-2xl overflow-hidden bg-surface-container-lowest shrink-0">
                        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
                            <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">Selected</h4>
                            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
                                {selectedGroups.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {selectedGroups.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant/70 space-y-3 px-4">
                                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
                                        <Icon name="group_add" className="text-3xl opacity-50" />
                                    </div>
                                    <p className="text-sm">No cohorts selected yet. Check the boxes on the left to add them.</p>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {selectedGroups.map(group => (
                                        <div key={group.id} className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 shadow-sm max-w-full">
                                            <span className="text-sm font-medium text-on-surface truncate">{group.group_name}</span>
                                            <button 
                                                onClick={() => handleRemoveSelected(group.id)}
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
                        {selectedGroups.length > 0 && (
                            <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end">
                                <button
                                    onClick={() => setSelectedGroups([])}
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
                            className="px-5 py-2.5 rounded-xl font-label-md text-label-md hover:bg-surface-variant text-on-surface transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
                        >
                            {`Apply Selection (${selectedGroups.length})`}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
