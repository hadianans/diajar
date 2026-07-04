import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import AcademicYearItem from '@/Components/features/academic/AcademicYearItem';
import Pagination from '@/Components/shared/ui/Pagination';

export default function AcademicYearsBox({ years = [], onAddYearClick, onItemClick }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedYears = years.slice(startIndex, startIndex + itemsPerPage);
    return (
        <section className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-stack-md">
                <div className="flex items-center gap-2">
                    <Icon name="calendar_today" className="text-on-surface-variant text-xl" />
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Academic Years</h3>
                </div>
                {onAddYearClick && (
                    <button
                        onClick={onAddYearClick}
                        className="text-primary hover:bg-primary-container/10 p-2 rounded-full transition-colors flex items-center justify-center active:scale-95"
                        type="button"
                    >
                        <Icon name="add" />
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                {paginatedYears.map((year, idx) => (
                    <AcademicYearItem
                        key={idx}
                        year={year.year}
                        range={year.range}
                        status={year.status}
                        onClick={() => onItemClick ? onItemClick(year) : null}
                    />
                ))}
            </div>
            {years.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={years.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            )}
            {onAddYearClick && (
                <button
                    onClick={onAddYearClick}
                    className="mt-stack-md w-full py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
                    type="button"
                >
                    New Academic Year
                </button>
            )}
        </section>
    );
}
