import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import SetupChecklist from '@/Components/features/admin-dashboard/SetupChecklist';
import QuickAccess from '@/Components/features/admin-dashboard/QuickAccess';
import RecentActivity from '@/Components/features/admin-dashboard/RecentActivity';
import useApiGet from '@/hooks/useApiGet';

export default function Homepage() {
    const { data: summaryData, loading: summaryLoading } = useApiGet('/dashboard/summary');
    const { data: checklistData, loading: checklistLoading } = useApiGet('/dashboard/checklist');
    const { data: activitiesResult, loading: activitiesLoading } = useApiGet('/activity-logs?days=7');

    const handleActionClick = (target) => {
        const routes = {
            'Accounts': '/admin/accounts',
            'Academic Settings': '/admin/academic',
            'Subjects': '/admin/academic',
            'Groups': '/admin/academic',
            'Classes': '/admin/classes',
        };

        if (routes[target]) {
            router.visit(routes[target]);
        }
    };

    // Transform API checklist to match component props
    const checklistSteps = (checklistData?.checklist || []).map(item => ({
        label: item.label,
        completed: item.complete,
        action: item.shortcut_url ? {
            label: 'Buka',
            onClick: () => router.visit(item.shortcut_url)
        } : undefined
    }));

    // Quick Access Configuration
    const quickAccessItems = [
        { label: 'Kelola Akun', icon: 'manage_accounts', onClick: () => handleActionClick('Accounts') },
        { label: 'Pengaturan Akademik', icon: 'settings_suggest', onClick: () => handleActionClick('Academic Settings') },
        { label: 'Kelola Mata Pelajaran', icon: 'book', onClick: () => handleActionClick('Subjects') },
        { label: 'Kelola Kelas', icon: 'meeting_room', onClick: () => handleActionClick('Classes') },
    ];

    // Transform API activities
    const activities = activitiesResult?.data || [];
    const recentActivities = activities.slice(0, 10).map(act => {
        // Convert created_at to a relative time or readable format
        const date = new Date(act.created_at);
        const now = new Date();
        const diffMs = now - date;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        let timeStr = `${diffHrs} jam yang lalu`;
        if (diffHrs < 1) timeStr = 'Baru saja';
        else if (diffHrs > 24) timeStr = `${Math.floor(diffHrs / 24)} hari yang lalu`;

        return {
            title: act.description || act.action,
            time: timeStr,
            meta: act.actor?.full_name || 'Sistem',
            dotColor: 'bg-primary'
        };
    });

    // Active Year Banner header element
    const bannerHeader = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Banner element */}
            <section className="w-full my-6 bg-primary-container text-on-primary-container rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md transition-shadow hover:shadow-lg">
                <div className="z-10">
                    <h2 className="font-headline-md text-headline-md font-bold mb-1">
                        {summaryData?.active_year?.name || 'Memuat Tahun Akademik...'}
                    </h2>
                    <div className="flex items-center gap-2 opacity-90">
                        <Icon name="calendar_today" className="text-[18px]" />
                        <p className="font-body-md text-body-md font-medium">
                            {summaryData?.active_year?.date_start && new Date(summaryData.active_year.date_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - {summaryData?.active_year?.date_end && new Date(summaryData.active_year.date_end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="z-10 flex items-center gap-3 bg-surface-container-lowest/20 backdrop-blur-md px-4 py-2 rounded-full w-fit">
                    <div className="w-2.5 h-2.5 bg-secondary-fixed rounded-full animate-pulse"></div>
                    <span className="font-label-md text-label-md font-bold tracking-wide">
                        {summaryData?.active_year?.status === 'active' ? 'Sistem Aktif' : 'Sistem Offline'}
                    </span>
                </div>
            </section>
        </div>
    );

    // Metrics grid section
    const metricsSection = (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
                <Icon name="group" className="text-primary text-2xl" />
                <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider">Total Siswa</p>
                <p className="text-on-surface font-headline-md text-headline-md font-bold">
                    {summaryLoading ? '...' : summaryData?.student_count || 0}
                </p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
                <Icon name="school" className="text-secondary text-2xl" />
                <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider">Guru Aktif</p>
                <p className="text-on-surface font-headline-md text-headline-md font-bold">
                    {summaryLoading ? '...' : summaryData?.teacher_count || 0}
                </p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
                <Icon name="menu_book" className="text-tertiary text-2xl" />
                <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider">Mata Pelajaran Aktif</p>
                <p className="text-on-surface font-headline-md text-headline-md font-bold">
                    {summaryLoading ? '...' : summaryData?.subject_count || 0}
                </p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
                <Icon name="event" className="text-primary-container text-2xl" />
                <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider">Tahun Akademik</p>
                <p className="text-on-surface font-headline-md text-headline-md font-bold">
                    {summaryLoading ? '...' : summaryData?.active_year?.name || 'Tidak ada'}
                </p>
            </div>
        </section>
    );

    return (
        <>
            <Head title="Dasbor Admin" />

            <DashboardTemplate
                activeTab="Dashboard"
                title="Diajar Admin"
                viewLabel="Tampilan Admin"
                showBack={false}
                headerSection={bannerHeader}
                statsSection={metricsSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <section className="flex flex-col gap-4">
                            {checklistLoading ? (
                                <div className="bg-surface-container-lowest p-6 rounded-2xl animate-pulse h-64 border border-outline-variant shadow-sm"></div>
                            ) : (
                                <SetupChecklist items={checklistSteps} />
                            )}
                        </section>
                        <section className="flex flex-col gap-4">
                            {activitiesLoading ? (
                                <div className="bg-surface-container-lowest p-6 rounded-2xl animate-pulse h-64 border border-outline-variant shadow-sm"></div>
                            ) : (
                                <RecentActivity
                                    activities={recentActivities}
                                    onViewLogs={() => router.visit('/admin/activity-logs')}
                                />
                            )}
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8">
                        <QuickAccess items={quickAccessItems} />
                    </div>
                </div>
            </DashboardTemplate>
        </>
    );
}
