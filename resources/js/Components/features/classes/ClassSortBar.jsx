import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassSortBar({ sortBy = 'Subject', onSortChange, isDescending, onToggleDirection }) {
    const sortOptions = ['Subject', 'Teacher', 'Grade', 'Recent'];

    return (
        <div className="flex items-center justify-between mb-stack-md py-2 border-b border-outline-variant bg-transparent">
            <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Sort by:</span>
                <div className="flex gap-4">
                    {sortOptions.map((option) => {
                        const isActive = sortBy.toLowerCase() === option.toLowerCase();
                        return (
                            <button
                                key={option}
                                onClick={() => onSortChange && onSortChange(option)}
                                className={`font-label-sm text-label-sm transition-colors active:scale-95 ${
                                    isActive
                                        ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                                        : 'text-on-surface-variant hover:text-primary'
                                }`}
                                type="button"
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
            
            <button
                onClick={onToggleDirection}
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full hover:bg-surface-container-low active:scale-90"
                type="button"
                title={`Toggle Sort Order (${isDescending ? 'Descending' : 'Ascending'})`}
            >
                <Icon name="sort" className={`text-lg transition-transform ${isDescending ? 'rotate-180' : ''}`} />
            </button>
        </div>
    );
}
