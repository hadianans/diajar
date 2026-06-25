import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AccountForm from '@/Components/features/accounts/AccountForm';
import api from '@/utils/api';

export default function Create() {
    const handleBack = () => {
        router.visit('/admin/accounts');
    };

    const handleFormSubmit = async (formData) => {
        const response = await api.post('/users', formData);
        // On success, redirect to the new user's show page or index
        router.visit(`/admin/accounts/${response.id}`);
    };

    return (
        <>
            <Head title="Invite New User - Diajar LMS" />

            <DashboardTemplate
                activeTab="Account"
                title="New Account"
                viewLabel="Admin View"
                showBack={true}
                onBack={handleBack}
            >
                <div className="w-full pb-12">
                    <AccountForm
                        isEdit={false}
                        onSubmit={handleFormSubmit}
                        onCancel={handleBack}
                    />
                </div>
            </DashboardTemplate>
        </>
    );
}
