import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';

export default function Index() {
    return (
        <DashboardTemplate role="teacher" activeTab="resources">
            <Head title="Resources Bank | Diajar LMS" />
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 text-primary">
                    <Icon name="construction" className="text-4xl" filled />
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Resource Bank is Coming Soon</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                    We are currently building this feature. Soon you'll be able to manage your reusable chapters, assignments, and assessments here.
                </p>
            </div>
        </DashboardTemplate>
    );
}
