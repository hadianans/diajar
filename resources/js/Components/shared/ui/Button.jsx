import React from 'react';

export default function Button({ children, className = '', disabled, variant = 'primary', ...props }) {
    const baseStyles = 'w-full h-12 font-label-md text-label-md rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none hover:opacity-90 active:scale-[0.98]';
    
    let variantStyles = '';
    if (variant === 'primary') {
        variantStyles = 'bg-primary-container text-on-primary-container';
    } else if (variant === 'secondary') {
        variantStyles = 'bg-surface-variant text-on-surface';
    } else if (variant === 'danger') {
        variantStyles = 'bg-error text-on-error';
    }

    return (
        <button
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
