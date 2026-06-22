import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function BrandHeader({ title = 'Login' }) {
    return (
        <header className="mb-md text-center">
            <div className="flex items-center justify-center mb-sm">
                <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center text-on-primary-container shadow-md">
                    <Icon name="school" className="text-[32px]" />
                </div>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mb-xs">
                {title}
            </h1>
        </header>
    );
}
