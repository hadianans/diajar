import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import WarningBox from '@/Components/features/accounts/WarningBox';
import DangerZone from '@/Components/features/accounts/DangerZone';
import AccountOverviewCard from '@/Components/features/accounts/AccountOverviewCard';
import PerformanceRing from '@/Components/features/accounts/PerformanceRing';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showSuccess, showError, confirmDelete, promptInput } from '@/utils/swal';

export default function Show({ accountId }) {
    const { data: user, loading, refetch } = useApiGet(`/users/${accountId}`);
    const [actionLoading, setActionLoading] = useState(false);

    const handleBack = () => {
        router.visit('/admin/accounts');
    };

    const handleEdit = () => {
        router.visit(`/admin/accounts/${accountId}/edit`);
    };

    const handleResetPassword = async () => {
        const newPassword = await promptInput('Masukkan kata sandi baru untuk pengguna ini', { inputLabel: 'Min 8 karakter', inputPlaceholder: 'Kata sandi baru', inputType: 'text' });
        if (!newPassword) return;
        
        if (newPassword.length < 8) {
            showError('Kata Sandi Tidak Valid', 'Kata sandi minimal harus 8 karakter.');
            return;
        }

        setActionLoading(true);
        try {
            await api.patch(`/users/${accountId}/password`, { password: newPassword });
            showSuccess('Kata sandi berhasil diperbarui.');
        } catch (err) {
            showError('Kesalahan', err.response?.data?.message || 'Gagal memperbarui kata sandi.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = await confirmDelete('Hapus Akun?', 'Setelah dihapus, semua catatan akan dihapus secara permanen.');
        if (confirmed) {
            setActionLoading(true);
            try {
                await api.delete(`/users/${accountId}`);
                showSuccess('Akun berhasil dihapus.');
                router.visit('/admin/accounts');
            } catch (err) {
                showError('Kesalahan', err.response?.data?.message || 'Gagal menghapus akun.');
                setActionLoading(false);
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
        role: user.role,
        email: user.email,
        username: user.username,
        gender: user.gender,
        isActive: user.is_active,
        createdDate: new Date(user.created_at).toLocaleDateString(),
        lastLogin: user.active_at ? new Date(user.active_at).toLocaleString() : 'Tidak pernah',
        avatar: user.picture
    };

    return (
        <>
            <Head title={`Detail Akun - ${accountData.name}`} />

            <DashboardTemplate
                activeTab="Account"
                title="Detail Akun"
                viewLabel="Tampilan Admin"
                showBack={true}
                onBack={handleBack}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg w-full">
                    {/* Left Column: Profile overview */}
                    <div className="lg:col-span-4 flex flex-col gap-stack-md">
                        <AccountOverviewCard
                            account={accountData}
                            onEdit={handleEdit}
                            onResetPassword={handleResetPassword}
                        />
                    </div>

                    {/* Right Column: Supplementary details */}
                    <div className="lg:col-span-8 flex flex-col gap-stack-lg">
                        {/* WARNING STATE: Student missing group assignment warning */}
                        {accountData.role === 'student' && (!user.student_groups || user.student_groups.length === 0) && (
                            <WarningBox
                                title="Penugasan Grup Hilang"
                                description="Siswa ini tidak ditugaskan ke grup mana pun. Mereka tidak akan dapat mengakses konten kursus apa pun hingga ditautkan."
                                buttonLabel="Buka Grup"
                                onButtonClick={() => router.visit('/admin/academic')}
                            />
                        )}

                        {/* Bento Supplementary Info cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                            <div className="tonal-layer rounded-xl p-6 bg-surface-container-lowest border border-outline-variant shadow-sm">
                                <h4 className="font-label-md text-primary mb-4 flex items-center gap-2 font-bold">
                                    <Icon name="history" className="text-lg" /> Aktivitas Terbaru
                                </h4>
                                <div className="text-center py-8">
                                    <p className="font-label-sm text-outline font-medium">Catatan aktivitas tersedia di umpan Dasbor.</p>
                                </div>
                            </div>
                            
                            <div className="tonal-layer rounded-xl p-6 relative overflow-hidden group bg-surface-container-lowest border border-outline-variant shadow-sm">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <h4 className="font-label-md text-primary mb-4 flex items-center gap-2 font-bold">
                                    <Icon name="school" className="text-lg" /> Performa
                                </h4>
                                <PerformanceRing percentage={0} />
                            </div>
                        </div>

                        {/* Danger zone actions */}
                        <DangerZone
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </DashboardTemplate>
        </>
    );
}
