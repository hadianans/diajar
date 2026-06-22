import React from 'react';

export default function Badge({ children, className = '' }) {
    return (
        <span className={`bg-primary-container text-on-primary-container px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${className}`}>
            {children}
        </span>
    );
}
