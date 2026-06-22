import React from 'react';

export default function Label({ htmlFor, children, className = '', ...props }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`font-label-md text-label-md text-on-surface ${className}`}
            {...props}
        >
            {children}
        </label>
    );
}
