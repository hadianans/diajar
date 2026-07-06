import React from 'react';

export default function Icon({ name, className = '', style = {}, filled = false, ...props }) {
    // If filled is true, merge the FILL font-variation setting into the style
    const iconStyle = filled 
        ? { ...style, fontVariationSettings: '"FILL" 1' } 
        : style;

    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={iconStyle}
            data-icon={name}
            {...props}
        >
            {name}
        </span>
    );
}
