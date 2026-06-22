import React from 'react';

export default function Icon({ name, className = '', style = {}, ...props }) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={style}
            data-icon={name}
            {...props}
        >
            {name}
        </span>
    );
}
