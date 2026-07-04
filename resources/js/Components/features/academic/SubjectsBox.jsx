import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import SubjectItem from '@/Components/features/academic/SubjectItem';
import Pagination from '@/Components/shared/ui/Pagination';

export default function SubjectsBox({ subjects = [], onAddSubjectClick, onViewAllSubjects, onItemClick }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSubjects = subjects.slice(startIndex, startIndex + itemsPerPage);
    return (
        <section className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-stack-md">
                <div className="flex items-center gap-2">
                    <Icon name="book_5" className="text-on-surface-variant text-xl" />
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Subjects</h3>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                {paginatedSubjects.map((sub, idx) => (
                    <SubjectItem
                        key={idx}
                        name={sub.name}
                        teachersCount={sub.teachersCount}
                        icon={sub.icon}
                        warning={sub.warning}
                        onClick={() => onItemClick ? onItemClick(sub) : null}
                    />
                ))}
            </div>
            {subjects.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={subjects.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            )}
            <div className="mt-stack-md flex flex-col gap-2">
                {onViewAllSubjects && (
                    <button
                        onClick={onViewAllSubjects}
                        className="text-center font-label-md text-label-md text-primary hover:underline py-2 active:scale-95"
                        type="button"
                    >
                        View all subjects
                    </button>
                )}
                {onAddSubjectClick && (
                    <button
                        onClick={onAddSubjectClick}
                        className="w-full py-3 bg-surface-container-highest text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-variant transition-colors border border-outline-variant active:scale-[0.98]"
                        type="button"
                    >
                        New Subject
                    </button>
                )}
            </div>
        </section>
    );
}
