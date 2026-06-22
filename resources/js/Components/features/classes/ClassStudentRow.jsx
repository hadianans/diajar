import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassStudentRow({ name, avatarUrl, onInfoClick }) {
    // Generate simple initials avatar if no avatar is provided
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'ST';

    return (
        <div className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
            {avatarUrl ? (
                <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all flex-shrink-0"
                    src={avatarUrl}
                    alt={name}
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold border-2 border-transparent group-hover:border-primary transition-all flex-shrink-0">
                    {initials}
                </div>
            )}
            
            <span className="font-body-md text-body-md text-on-surface flex-grow truncate font-medium">
                {name}
            </span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (onInfoClick) onInfoClick();
                }}
                className="p-1 hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center flex-shrink-0"
                type="button"
            >
                <Icon name="info" className="text-outline group-hover:text-primary transition-colors text-[20px]" />
            </button>
        </div>
    );
}
