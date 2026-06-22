import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function RoleSelectCard({ title, description, isSelected, onClick }) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                if (onClick) onClick();
            }}
            className={`text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] w-full flex items-center justify-between gap-4 cursor-pointer ${
                isSelected
                    ? 'border-primary bg-surface-container-low'
                    : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low'
            }`}
            type="button"
        >
            <div className="min-w-0">
                <span className="block font-headline-md text-headline-md text-on-surface font-semibold truncate">
                    {title}
                </span>
                <span className="block font-body-md text-body-md text-on-surface-variant truncate mt-0.5">
                    {description}
                </span>
            </div>
            
            <Icon
                name="check_circle"
                className={`text-[24px] flex-shrink-0 transition-all ${
                    isSelected ? 'text-primary opacity-100' : 'text-outline-variant opacity-0'
                }`}
                style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
            />
        </button>
    );
}
