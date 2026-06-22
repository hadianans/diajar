import React from 'react';
import Checkbox from '@/Components/shared/ui/Checkbox';

export default function RememberMe({ checked, onChange, name = 'remember' }) {
    return (
        <div className="block">
            <label className="flex items-center cursor-pointer">
                <Checkbox
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="rounded border-outline-variant text-primary shadow-sm focus:ring-primary/20"
                />
                <span className="ms-2 font-label-md text-label-md text-on-surface-variant">
                    Remember me
                </span>
            </label>
        </div>
    );
}
