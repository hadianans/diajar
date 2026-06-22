import React from 'react';
import { Head } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function GradingWorkspaceLayout({ 
    title,
    headerCenter, 
    headerRight,
    footerLeft,
    footerRight,
    onBack,
    children 
}) {
    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col">
            <Head title={title ? `${title} - Grading Workspace` : 'Grading Workspace'} />

            {/* TopAppBar */}
            <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile h-16 bg-surface border-b border-outline-variant shadow-none">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="hover:bg-surface-container-low transition-colors rounded-full p-2 scale-95 active:bg-surface-container-high active:scale-90"
                    >
                        <Icon name="arrow_back" className="text-primary" />
                    </button>
                    {headerCenter}
                </div>
                {headerRight}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 mt-16 pb-24 overflow-y-auto bg-surface-container-low">
                <div className="max-w-screen-xl mx-auto px-margin-mobile py-stack-md flex flex-col gap-stack-lg lg:grid lg:grid-cols-12">
                    {children}
                </div>
            </main>

            {/* Sticky Bottom Bar */}
            {(footerLeft || footerRight) && (
                <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile py-4 bg-surface-container-lowest border-t border-outline-variant shadow-lg dark:shadow-none rounded-t-xl">
                    {footerLeft}
                    {footerRight}
                </nav>
            )}
        </div>
    );
}
