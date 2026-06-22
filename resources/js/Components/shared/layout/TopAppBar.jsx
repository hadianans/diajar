import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function TopAppBar({ title = 'Group Details', viewLabel = 'Admin View', onBack, showBack = true }) {
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    return (
        <header className="fixed top-0 left-0 md:left-72 right-0 z-30 bg-surface-bright/85 backdrop-blur-md border-b border-outline-variant flex justify-center h-20 shadow-sm">
            <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-5xl">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="material-symbols-outlined text-primary hover:bg-surface-container p-2 rounded-full bg-white border border-outline-variant shadow-sm active:scale-95 transition-all flex items-center justify-center"
                            type="button"
                        >
                            arrow_back
                        </button>
                    )}
                    <h1 className="text-xl md:text-2xl font-extrabold text-primary tracking-tight">{title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-label-md text-label-sm text-on-surface-variant hidden md:block bg-surface-container px-3 py-1 rounded-full border border-outline-variant/30 font-medium">
                        {viewLabel}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white">
                        AU
                    </div>
                </div>
            </div>
        </header>
    );
}
