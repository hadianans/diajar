import React from 'react';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-outline-variant text-primary shadow-sm focus:ring-primary focus:ring-opacity-50 bg-surface-container-lowest transition-all ' +
                className
            }
        />
    );
}
