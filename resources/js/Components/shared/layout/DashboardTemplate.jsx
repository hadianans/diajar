import React from 'react';
import TopAppBar from '@/Components/shared/layout/TopAppBar';
import RoleNavbar from '@/Components/shared/layout/RoleNavbar';
import Breadcrumbs from '@/Components/shared/ui/Breadcrumbs';

export default function DashboardTemplate({
    role = 'admin',
    activeTab,
    onTabChange,
    title = 'Diajar LMS',
    viewLabel = 'Admin View',
    showBack = false,
    onBack,
    headerSection,
    statsSection,
    children,
}) {
    return (
        <div className="bg-surface-bright text-on-surface selection:bg-primary-fixed-dim min-h-screen flex flex-col">
            {/* Sidebar / Bottom Nav Navigation */}
            <RoleNavbar role={role} activeTab={activeTab} onTabChange={onTabChange} />

            {/* Offset the main content area by sidebar width on desktop */}
            <div className="md:pl-72 flex-grow flex flex-col min-h-screen">
                {/* Top Bar */}
                <TopAppBar title={title} viewLabel={viewLabel} onBack={onBack} showBack={showBack} />

                {/* Main Content Layout */}
                <main className="pt-28 pb-24 px-margin-mobile md:px-margin-desktop max-w-5xl w-full mx-auto flex-grow flex flex-col">
                    <div className="mb-6">
                        <Breadcrumbs />
                    </div>
                    {headerSection && <div className="mb-stack-lg">{headerSection}</div>}
                    {statsSection && <div className="mb-stack-lg">{statsSection}</div>}
                    <div className="flex-grow">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
