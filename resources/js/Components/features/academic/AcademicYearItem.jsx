import React from 'react';

export default function AcademicYearItem({ year, range, status, onClick }) {
    const isActive = status.toLowerCase() === 'active';

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl transition-all ${
                isActive
                    ? 'bg-primary-container/5 border-2 border-primary shadow-sm'
                    : 'border border-outline-variant hover:bg-surface-container-low cursor-pointer shadow-sm'
            }`}
        >
            <div className="flex justify-between items-start gap-2">
                <div>
                    <p className={`font-label-md text-label-md font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                        {year}
                    </p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant font-medium">{range}</p>
                </div>
                <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isActive
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-variant text-on-surface-variant'
                    }`}
                >
                    {status}
                </span>
            </div>
        </div>
    );
}
