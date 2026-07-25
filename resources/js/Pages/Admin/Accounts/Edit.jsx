import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AccountForm from '@/Components/features/accounts/AccountForm';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showSuccess, confirmAction } from '@/utils/swal';

export default function Edit({ accountId }) {
    const { data: user, loading } = useApiGet(`/users/${accountId}`);

    const handleBack = () => {
        router.visit(`/admin/accounts/${accountId}`);
    };

    const handleFormSubmit = async (formData, forceConfirm = false) => {
        try {
            const payload = { ...formData };
            if (forceConfirm) {
                payload.role_change_confirmed = true;
            }
            
            await api.put(`/users/${accountId}`, payload);
            showSuccess('Akun berhasil diperbarui!');
            router.visit(`/admin/accounts/${accountId}`);
        } catch (err) {
            if (err.response?.status === 422 && err.response.data.message === 'Role change requires role_change_confirmed: true') {
                const confirmed = await confirmAction('Ubah Peran?', 'Ini mungkin memengaruhi izin dan data terkait mereka. Lanjutkan?');
                if (confirmed) {
                    return handleFormSubmit(formData, true);
                }
            } else {
                throw err; // Re-throw to be caught by AccountForm error handler
            }
        }
    };

    if (loading) {
        return (
            <DashboardTemplate activeTab="Account" title="Memuat..." viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-on-surface-variant">Memuat detail akun...</div>
            </DashboardTemplate>
        );
    }

    if (!user) {
        return (
            <DashboardTemplate activeTab="Account" title="Tidak Ditemukan" viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-error">Pengguna tidak ditemukan.</div>
            </DashboardTemplate>
        );
    }

    const accountData = {
        id: user.id,
        name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.picture
    };

    return (
        <>
            <Head title={`Edit Akun ${user.full_name} - Diajar LMS`} />

            <DashboardTemplate
                activeTab="Account"
                title="Edit Akun"
                viewLabel="Tampilan Admin"
                showBack={true}
                onBack={handleBack}
            >
                <div className="w-full pb-12">
                    <AccountForm
                        isEdit={true}
                        initialData={accountData}
                        onSubmit={handleFormSubmit}
                        onCancel={handleBack}
                    />
                </div>
            </DashboardTemplate>
        </>
    );
}
