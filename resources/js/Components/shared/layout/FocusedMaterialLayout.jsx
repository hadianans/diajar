import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function FocusedMaterialLayout({ 
    title, 
    onBack, 
    actions, 
    children, 
    isCreateMode = false,
    className = ""
}) {
    return (
        <div className="bg-background text-on-background min-h-screen pb-32">
            {/* TopAppBar for Focused Mode */}
            <header className="bg-background fixed top-0 w-full h-16 z-50 flex items-center justify-between px-margin-mobile md:px-margin-desktop border-b border-outline-variant/30 transition-colors duration-200">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="hover:bg-surface-container-high rounded-full transition-colors active:scale-95 duration-200 p-2 text-on-surface-variant hover:text-primary"
                    >
                        <Icon name={isCreateMode ? "close" : "arrow_back"} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="font-headline-md text-headline-md text-on-surface truncate">{title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            </header>

            {/* Main Content Area */}
            <main className={`pt-24 px-margin-mobile md:max-w-[1280px] md:mx-auto ${className}`}>
                {children}
            </main>
        </div>
    );
}
