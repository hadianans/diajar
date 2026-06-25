import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AccountList from '@/Components/features/accounts/AccountList';

export default function Index() {
    const handleCreateAccount = () => {
        router.visit('/admin/accounts/create');
    };

    return (
        <>
            <Head title="Admin Accounts" />

            <DashboardTemplate
                activeTab="Account"
                title="Lumen Admin"
                viewLabel="Admin View"
                showBack={false}
            >
                <div className="max-w-2xl mx-auto w-full">
                    <AccountList onCreateClick={handleCreateAccount} />
                </div>
            </DashboardTemplate>
        </>
    );
}
