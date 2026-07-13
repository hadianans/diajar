import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AccountSearchBar({ value, onChange, onSortToggle }) {
    return (
        <section className="flex gap-stack-sm mb-stack-md">
            <div className="relative flex-1">
                <Icon
                    name="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl font-body-md text-body-md placeholder:text-outline/50 shadow-sm outline-none transition-all"
                    placeholder="Search accounts..."
                    type="text"
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                />
            </div>
            {onSortToggle && (
                <button
                    onClick={onSortToggle}
                    className="bg-surface-container-lowest border border-outline-variant p-3 rounded-xl shadow-sm hover:bg-surface-container hover:border-primary/20 transition-all active:scale-95 flex items-center justify-center"
                    type="button"
                    title="Toggle Sort Order"
                >
                    <Icon name="swap_vert" className="text-on-surface-variant" />
                </button>
            )}
        </section>
    );
}
