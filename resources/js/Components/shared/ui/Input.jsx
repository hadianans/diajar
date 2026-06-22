import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function Input(
    { className = '', type = 'text', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={`w-full h-12 px-md bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${className}`}
            ref={localRef}
        />
    );
});
