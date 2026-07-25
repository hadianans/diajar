import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import YearGroupsList from '@/Components/features/academic/YearGroupsList';
import YearClassesList from '@/Components/features/academic/YearClassesList';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showSuccess, showError, confirmAction } from '@/utils/swal';

export default function Show({ yearId }) {
    const { data: year, loading, refetch } = useApiGet(`/school-years/${yearId}`);
    const [actionLoading, setActionLoading] = useState(false);

    const handleBack = () => {
        router.visit('/admin/academic');
    };

    const handleArchive = async () => {
        const confirmed = await confirmAction('Arsipkan tahun ini?', 'Ini akan mengunci semua data menjadi hanya-baca.');
        if (confirmed) {
            setActionLoading(true);
            try {
                await api.post(`/school-years/${yearId}/archive`);
                showSuccess('Tahun akademik berhasil diarsipkan.');
                refetch();
            } catch (err) {
                showError('Kesalahan', err.response?.data?.message || 'Gagal mengarsipkan tahun.');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleReactivate = async () => {
        const confirmed = await confirmAction('Aktifkan kembali tahun ini?', 'Hanya satu tahun yang dapat aktif pada satu waktu.');
        if (confirmed) {
            setActionLoading(true);
            try {
                await api.post(`/school-years/${yearId}/reactivate`);
                showSuccess('Tahun akademik berhasil diaktifkan kembali.');
                refetch();
            } catch (err) {
                showError('Kesalahan', err.response?.data?.message || 'Gagal mengaktifkan kembali tahun.');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const groups = useMemo(() => {
        if (!year?.group_years) return [];
        return year.group_years.map(gy => ({
            id: gy.id,
            groupName: gy.group.name,
            grade: gy.grade,
            studentsCount: gy.student_count || 0,
            warning: (gy.student_count || 0) === 0
        }));
    }, [year]);

    if (loading) {
        return (
            <DashboardTemplate activeTab="Academic" title="Memuat..." viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-on-surface-variant">Memuat detail tahun...</div>
            </DashboardTemplate>
        );
    }

    if (!year) {
        return (
            <DashboardTemplate activeTab="Academic" title="Tidak Ditemukan" viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-error">Tahun akademik tidak ditemukan.</div>
            </DashboardTemplate>
        );
    }

    const isActive = year.status === 'active';
    const yearDisplay = year.name;
    const dateRange = `${new Date(year.date_start).toLocaleDateString()} - ${new Date(year.date_end).toLocaleDateString()}`;

    // Top Header section
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Academic Year Info Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                            {yearDisplay}
                        </h2>
                        {isActive ? (
                            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-md rounded-full font-label-md flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                                AKTIF
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-label-md rounded-full font-label-md flex items-center gap-1">
                                DIARSIPKAN
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                    <Icon name="calendar_today" className="text-[18px]" />
                    <p className="font-body-md text-body-md">{dateRange}</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`Detail Tahun Akademik - ${yearDisplay}`} />

            <DashboardTemplate
                activeTab="Academic"
                title="Tahun Akademik"
                viewLabel="Tampilan Admin"
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
                    {/* Groups and Classes (Stacked in Mobile/Tablet, Left Panel in Desktop) */}
                    <div className="lg:col-span-8 flex flex-col gap-stack-lg order-2 lg:order-1">
                        <YearGroupsList
                            groups={groups}
                            onAddGroupClick={() => router.visit('/admin/academic/groups/create')}
                            onGroupClick={(group) => router.visit(`/admin/academic/groups/${group.id}`)}
                        />

                        <YearClassesList
                            classes={[]}
                            onViewAllClick={() => router.visit('/admin/classes')}
                            onGenerateClassClick={() => router.visit('/admin/classes/create')}
                            onClassMoreClick={(cls) => {}}
                        />
                    </div>

                    {/* Status Management (Top Panel in Mobile/Tablet, Right Side Panel in Desktop) */}
                    <div className="lg:col-span-4 order-1 lg:order-2">
                        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className={`font-label-md text-label-md ${isActive ? 'text-error' : 'text-primary'} font-bold mb-4 uppercase tracking-wider`}>
                                Manajemen Status
                            </h3>
                            {isActive ? (
                                <button
                                    onClick={handleArchive}
                                    disabled={actionLoading}
                                    className="w-full py-3 px-4 border-2 border-error text-error font-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-error-container/20 transition-all active:scale-[0.98] duration-150 disabled:opacity-50"
                                    type="button"
                                >
                                    <Icon name="archive" className="text-[20px]" />
                                    Arsipkan Tahun Ini
                                </button>
                            ) : (
                                <button
                                    onClick={handleReactivate}
                                    disabled={actionLoading}
                                    className="w-full py-3 px-4 border-2 border-primary text-primary font-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-primary-container/20 transition-all active:scale-[0.98] duration-150 disabled:opacity-50"
                                    type="button"
                                >
                                    <Icon name="unarchive" className="text-[20px]" />
                                    Aktifkan Kembali Tahun Ini
                                </button>
                            )}
                            
                            <div className="mt-3 flex items-start gap-2 text-on-surface-variant">
                                <Icon name="info" className="text-[18px] text-tertiary flex-shrink-0 mt-0.5" />
                                <p className="text-label-sm font-label-sm leading-relaxed">
                                    {isActive 
                                        ? "Pengarsipan mengunci semua data menjadi hanya-baca. Tindakan ini berdampak."
                                        : "Mengaktifkan kembali tahun ini akan memungkinkan pengeditan lagi. Pastikan tidak ada tahun lain yang aktif."}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </DashboardTemplate>
        </>
    );
}
