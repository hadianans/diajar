import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import SetupChecklist from '@/Components/features/admin-dashboard/SetupChecklist';
import QuickAccess from '@/Components/features/admin-dashboard/QuickAccess';
import RecentActivity from '@/Components/features/admin-dashboard/RecentActivity';

export default function Homepage() {
    const [selectedRole, setSelectedRole] = useState('admin');
    const [activeTab, setActiveTab] = useState('Dashboard');

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        if (role === 'admin') {
            setActiveTab('Dashboard');
        } else if (role === 'teacher') {
            setActiveTab('Class');
        } else {
            setActiveTab('Dashboard');
        }
    };

    const handleActionClick = (target) => {
        alert(`Navigating to ${target} setup flow...`);
    };

    // Checklist steps configuration
    const checklistSteps = [
        { label: 'Academic year created', completed: true },
        { label: 'Subjects established', completed: true },
        {
            label: 'Teachers linked to subjects',
            completed: false,
            action: {
                label: 'Go to Subjects',
                onClick: () => handleActionClick('Subjects'),
            },
        },
        { label: 'Student groups created', completed: true },
        {
            label: 'Students linked to groups',
            completed: false,
            action: {
                label: 'Go to Groups',
                onClick: () => handleActionClick('Groups'),
            },
        },
        { label: 'Class schedules generated', completed: true },
    ];

    // Quick Access Configuration
    const quickAccessItems = [
        { label: 'Manage Accounts', icon: 'manage_accounts', onClick: () => handleActionClick('Accounts') },
        { label: 'Academic Settings', icon: 'settings_suggest', onClick: () => handleActionClick('Academic Settings') },
        { label: 'Manage Subjects', icon: 'book', onClick: () => handleActionClick('Subjects') },
        { label: 'Manage Classes', icon: 'meeting_room', onClick: () => handleActionClick('Classes') },
    ];

    // Recent activity list
    const recentActivities = [
        { title: 'New teacher: Sarah Miller', time: '2 hours ago', meta: 'HR Department', dotColor: 'bg-primary' },
        { title: 'Subject updated: Biology', time: '5 hours ago', meta: 'Academic Office', dotColor: 'bg-secondary' },
        { title: 'Student group 10B finalized', time: 'Yesterday', meta: 'System Automated', dotColor: 'bg-outline' },
    ];

    const viewLabelMap = {
        admin: 'Admin View',
        teacher: 'Teacher View',
        student: 'Student View',
    };

    // Active Year Banner header element
    const bannerHeader = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Interactive demo layout switcher */}
            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                        Interactive Demo Mode
                    </span>
                    <p className="text-sm text-on-surface">Toggle roles to preview the customized responsive navigation structures:</p>
                </div>
                <div className="flex gap-2">
                    {['admin', 'teacher', 'student'].map((role) => (
                        <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`px-4 py-2 rounded-lg font-label-sm text-xs capitalize transition-all border ${selectedRole === role
                                ? 'bg-primary text-on-primary border-primary shadow-sm'
                                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
                                }`}
                            type="button"
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Banner element */}
            <section className="w-full my-6 bg-primary-container text-on-primary-container rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md transition-shadow hover:shadow-lg">
                <div className="z-10">
                    <h2 className="font-headline-md text-headline-md font-bold mb-1">2024/2025 Academic Year</h2>
                    <div className="flex items-center gap-2 opacity-90">
                        <Icon name="calendar_today" className="text-[18px]" />
                        <p className="font-body-md text-body-md font-medium">Sep 1, 2024 - Jun 30, 2025</p>
                    </div>
                </div>
                <div className="z-10 flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit">
                    <div className="w-2.5 h-2.5 bg-secondary-fixed rounded-full animate-pulse"></div>
                    <span className="font-label-md text-label-md font-bold tracking-wide">System Active</span>
                </div>
            </section>
        </div>
    );

    // Metrics grid section
    const metricsSection = (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
            <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
                <Icon name="group" className="text-primary text-2xl" />
                <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider">Total Students</p>
                <p className="text-on-surface font-headline-md text-headline-md font-bold">1,240</p>
            </div>
            <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
                <Icon name="school" className="text-secondary text-2xl" />
                <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider">Active Teachers</p>
                <p className="text-on-surface font-headline-md text-headline-md font-bold">86</p>
            </div>
            <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
                <Icon name="menu_book" className="text-tertiary text-2xl" />
                <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider">Active Subjects</p>
                <p className="text-on-surface font-headline-md text-headline-md font-bold">24</p>
            </div>
            <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm flex flex-col gap-2 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
                <Icon name="event" className="text-primary-container text-2xl" />
                <p className="text-on-surface-variant font-label-sm text-[12px] uppercase tracking-wider">Academic Year</p>
                <p className="text-on-surface font-headline-md text-headline-md font-bold">2024/2025</p>
            </div>
        </section>
    );

    return (
        <>
            <Head title="Admin Dashboard" />

            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Lumen Admin"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={false}
                headerSection={bannerHeader}
                statsSection={metricsSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
                    <section className="lg:col-span-8 flex flex-col gap-stack-md">
                        <SetupChecklist items={checklistSteps} />
                    </section>
                    <aside className="lg:col-span-4 flex flex-col gap-stack-lg">
                        <QuickAccess items={quickAccessItems} />
                        <RecentActivity
                            activities={recentActivities}
                            onViewLogs={() => alert('Opening full activity log logs...')}
                        />
                    </aside>
                </div>
            </DashboardTemplate>
        </>
    );
}
