import React from 'react';

export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 30, 50, 100]
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    return (
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-2 mt-6 border-t border-outline-variant/30 pt-4">
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-on-surface-variant hidden min-[400px]:inline">Show</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        onItemsPerPageChange(Number(e.target.value));
                        onPageChange(1); // Reset to page 1
                    }}
                    className="bg-surface-container border border-outline-variant rounded-md text-sm py-1 pl-2 pr-8 focus:ring-primary focus:border-primary"
                >
                    {itemsPerPageOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <span className="text-sm text-on-surface-variant">/ page</span>
            </div>
            
            <div className="flex items-center gap-1 min-[400px]:gap-2 shrink-0">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-2 py-1 min-[400px]:px-3 rounded border border-outline-variant hover:bg-surface-container disabled:opacity-50 text-sm transition-colors"
                >
                    Prev
                </button>
                <span className="text-sm text-on-surface-variant px-1 min-[400px]:px-2 whitespace-nowrap">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-2 py-1 min-[400px]:px-3 rounded border border-outline-variant hover:bg-surface-container disabled:opacity-50 text-sm transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
