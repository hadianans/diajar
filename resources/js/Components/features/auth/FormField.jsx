import React, { useState } from 'react';
import Label from '@/Components/shared/ui/Label';
import Input from '@/Components/shared/ui/Input';
import Icon from '@/Components/shared/ui/Icon';

export default function FormField({
    label,
    id,
    type = 'text',
    error,
    placeholder,
    value,
    onChange,
    required = false,
    autoComplete,
    isFocused = false,
    className = '',
    headerAction,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';

    const inputType = isPasswordType && showPassword ? 'text' : type;

    return (
        <div className={`space-y-xs ${className}`}>
            <div className="flex justify-between items-center">
                {label && <Label htmlFor={id}>{label}</Label>}
                {headerAction}
            </div>
            <div className="relative">
                <Input
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    autoComplete={autoComplete}
                    autoFocus={isFocused}
                    className={isPasswordType ? 'pr-xl pl-md' : 'px-md'}
                    {...props}
                />
                {isPasswordType && (
                    <button
                        type="button"
                        aria-label="Toggle password visibility"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <Icon
                            name={showPassword ? 'visibility_off' : 'visibility'}
                            className="text-[20px]"
                        />
                    </button>
                )}
            </div>
            {error && (
                <p className="font-label-sm text-[12px] text-error mt-1">{error}</p>
            )}
        </div>
    );
}
