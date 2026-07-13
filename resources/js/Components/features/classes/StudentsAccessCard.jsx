import React, { useState, useMemo, useEffect } from 'react';
import ClassStudentRow from '@/Components/features/classes/ClassStudentRow';
import Icon from '@/Components/shared/ui/Icon';
import Pagination from '@/Components/shared/ui/Pagination';

export default function StudentsAccessCard({
    students = [],
    onViewAllClick,
    onStudentClick
}) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = useMemo(() => {
        if (searchQuery.trim() === '') return students;
        return students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [students, searchQuery]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    return (
        <article className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant rounded-xl p-6 h-full flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Students with Access ({students.length})
                </h3>
                <button
                    onClick={() => {
                        setIsSearchOpen(!isSearchOpen);
                        if (isSearchOpen) setSearchQuery('');
                    }}
                    className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                        isSearchOpen ? 'bg-primary-container/10 text-primary' : 'text-primary hover:bg-surface-container-low'
                    }`}
                    type="button"
                    title="Search Students"
                >
                    <Icon name="search" className="text-[20px]" />
                </button>
            </div>

            {isSearchOpen && (
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl text-label-md font-label-md py-2 px-3 focus:ring-2 focus:ring-primary-container animate-in slide-in-from-top-2 duration-200"
                    placeholder="Search by student name..."
                    type="text"
                    autoFocus
                />
            )}

            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredStudents.length === 0 ? (
                    <div className="py-8 text-center text-on-surface-variant text-label-md font-semibold">
                        No students found.
                    </div>
                ) : (
                    paginatedStudents.map((student) => (
                        <ClassStudentRow
                            key={student.id}
                            name={student.name}
                            avatarUrl={student.avatarUrl}
                            onInfoClick={() => {
                                if (onStudentClick) onStudentClick(student);
                            }}
                        />
                    ))
                )}
            </div>
            
            {filteredStudents.length > 0 && (
                <div className="mt-2 pt-2 border-t border-outline-variant/30">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredStudents.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                    />
                </div>
            )}

            <button
                onClick={onViewAllClick}
                className="mt-auto pt-4 text-center text-primary font-label-md text-label-md hover:underline cursor-pointer block font-semibold transition-all active:scale-95 duration-100"
                type="button"
            >
                View All Students
            </button>
        </article>
    );
}
