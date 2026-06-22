import React from 'react';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-label-sm text-error mt-1 ' + className}
        >
            {message}
        </p>
    ) : null;
}
