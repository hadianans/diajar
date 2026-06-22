import React from 'react';

export default function Avatar({ src, initials, className = '', bgClassName = 'bg-primary-fixed text-on-primary-fixed' }) {
    if (src) {
        return (
            <img
                src={src}
                alt="Profile"
                className={`rounded-full object-cover ${className}`}
            />
        );
    }
    return (
        <div className={`rounded-full flex items-center justify-center font-bold ${bgClassName} ${className}`}>
            {initials}
        </div>
    );
}
