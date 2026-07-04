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
        const newPassword = prompt('Enter new password for this user (min 8 characters):');
        if (!newPassword) return;
        
        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        setActionLoading(true);
        try {
            await api.patch(`/users/${accountId}/password`, { password: newPassword });
            alert('Password updated successfully.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this account? Once deleted, all records are permanently erased.')) {
            setActionLoading(true);
            try {
                await api.delete(`/users/${accountId}`);
                alert('Account deleted successfully.');
                router.visit('/admin/accounts');
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete account.');
                setActionLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <DashboardTemplate activeTab="Account" title="Loading..." viewLabel="Admin View" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-on-surface-variant">Loading account details...</div>
            </DashboardTemplate>
        );
    }

    if (!user) {
        return (
            <DashboardTemplate activeTab="Account" title="Not Found" viewLabel="Admin View" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-error">User not found.</div>
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
        lastLogin: user.active_at ? new Date(user.active_at).toLocaleString() : 'Never',
        avatar: user.picture
    };

    return (
        <>
            <Head title={`Account Detail - ${accountData.name}`} />

            <DashboardTemplate
                activeTab="Account"
                title="Account Detail"
                viewLabel="Admin View"
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
                                title="Missing Group Assignment"
                                description="This student is not assigned to any group. They will not be able to access any course content until linked."
                                buttonLabel="Go to Groups"
                                onButtonClick={() => router.visit('/admin/academic')}
                            />
                        )}

                        {/* Bento Supplementary Info cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                            <div className="tonal-layer rounded-xl p-6 bg-white border border-outline-variant shadow-sm">
                                <h4 className="font-label-md text-primary mb-4 flex items-center gap-2 font-bold">
                                    <Icon name="history" className="text-lg" /> Recent Activity
                                </h4>
                                <div className="text-center py-8">
                                    <p className="font-label-sm text-outline font-medium">Activity logs available in Dashboard feed.</p>
                                </div>
                            </div>
                            
                            <div className="tonal-layer rounded-xl p-6 relative overflow-hidden group bg-white border border-outline-variant shadow-sm">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <h4 className="font-label-md text-primary mb-4 flex items-center gap-2 font-bold">
                                    <Icon name="school" className="text-lg" /> Performance
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
