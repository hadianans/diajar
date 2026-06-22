import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import WarningBox from '@/Components/features/accounts/WarningBox';
import DangerZone from '@/Components/features/accounts/DangerZone';
import AccountOverviewCard from '@/Components/features/accounts/AccountOverviewCard';
import PerformanceRing from '@/Components/features/accounts/PerformanceRing';
import Icon from '@/Components/shared/ui/Icon';

const mockProfiles = {
    student: {
        id: 3,
        name: 'Liam Chen',
        role: 'Student',
        email: 'l.chen@diajar.edu',
        username: 'liamc_student',
        createdDate: 'Sep 01, 2024',
        lastLogin: 'Never',
        avatar: null
    },
    teacher: {
        id: 2,
        name: 'Sarah Miller',
        role: 'Teacher',
        email: 's.miller@diajar.edu',
        username: 's_miller_instructor',
        createdDate: 'Aug 28, 2024',
        lastLogin: 'Yesterday at 4:32 PM',
        avatar: null
    },
    admin: {
        id: 1,
        name: 'Alex Rivers',
        role: 'Admin',
        email: 'alex.rivers@lumen.edu',
        username: 'alex_rivers_lead',
        createdDate: 'Sep 12, 2024',
        lastLogin: '2 hours ago',
        avatar: null
    }
};

export default function Show({ accountId }) {
    // Interactive presentation states
    const [selectedRole, setSelectedRole] = useState('student'); // Default to student details as requested
    const [activeNavbarRole, setActiveNavbarRole] = useState('admin'); // Admin views this page
    const [activeTab, setActiveTab] = useState('Account');

    const handleRoleChange = (role) => {
        setSelectedRole(role);
    };

    const handleNavbarRoleChange = (role) => {
        setActiveNavbarRole(role);
        if (role === 'admin') {
            setActiveTab('Account');
        } else if (role === 'teacher') {
            setActiveTab('Class');
        } else {
            setActiveTab('Dashboard');
        }
    };

    const handleActionClick = (actionName) => {
        alert(`Executing: ${actionName} flow...`);
    };

    const handleBack = () => {
        window.history.back();
    };

    const accountData = mockProfiles[selectedRole] || mockProfiles.student;

    const viewLabelMap = {
        admin: 'Admin View',
        teacher: 'Teacher View',
        student: 'Student View',
    };

    // Header layout switcher and demo harness
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                            Interactive Demo Mode (Switch Profile Detail View)
                        </span>
                        <p className="text-sm text-on-surface">Toggle to view Student details, Teacher details, or Admin details:</p>
                    </div>
                    <div className="flex gap-2">
                        {['student', 'teacher', 'admin'].map((role) => (
                            <button
                                key={role}
                                onClick={() => handleRoleChange(role)}
                                className={`px-4 py-2 rounded-lg font-label-sm text-xs capitalize transition-all border ${
                                    selectedRole === role
                                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                                        : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
                                }`}
                                type="button"
                            >
                                {role} Details
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-outline-variant/30 pt-3">
                    <div>
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                            Interactive Demo Mode (Switch Navbars)
                        </span>
                        <p className="text-sm text-on-surface">Toggle active role for global menu routing layouts:</p>
                    </div>
                    <div className="flex gap-2">
                        {['admin', 'teacher', 'student'].map((role) => (
                            <button
                                key={role}
                                onClick={() => handleNavbarRoleChange(role)}
                                className={`px-4 py-2 rounded-lg font-label-sm text-xs capitalize transition-all border ${
                                    activeNavbarRole === role
                                        ? 'bg-secondary text-on-secondary border-secondary shadow-sm'
                                        : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
                                }`}
                                type="button"
                            >
                                {role} Nav
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`Account Detail - ${accountData.name}`} />

            <DashboardTemplate
                role={activeNavbarRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Account Detail"
                viewLabel={viewLabelMap[activeNavbarRole]}
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg w-full">
                    {/* Left Column: Profile overview */}
                    <div className="lg:col-span-4 flex flex-col gap-stack-md">
                        <AccountOverviewCard
                            account={accountData}
                            onEdit={() => handleActionClick('Edit Profile')}
                            onResetPassword={() => handleActionClick('Reset Password')}
                        />
                    </div>

                    {/* Right Column: Supplementary details */}
                    <div className="lg:col-span-8 flex flex-col gap-stack-lg">
                        {/* WARNING STATE: Student missing group assignment warning */}
                        {selectedRole === 'student' && (
                            <WarningBox
                                title="Missing Group Assignment"
                                description="This student is not assigned to any group. They will not be able to access any course content until linked."
                                buttonLabel="Go to Groups"
                                onButtonClick={() => handleActionClick('Groups Navigation')}
                            />
                        )}

                        {/* Bento Supplementary Info cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                            <div className="tonal-layer rounded-xl p-6 bg-white border border-outline-variant shadow-sm">
                                <h4 className="font-label-md text-primary mb-4 flex items-center gap-2 font-bold">
                                    <Icon name="history" className="text-lg" /> Recent Activity
                                </h4>
                                <div className="text-center py-8">
                                    <p className="font-label-sm text-outline font-medium">No activity recorded for this period.</p>
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
                            onDelete={() => {
                                if (confirm('Are you sure you want to delete this account? Once deleted, all records are permanently erased.')) {
                                    alert('Account deleted successfully.');
                                }
                            }}
                        />
                    </div>
                </div>
            </DashboardTemplate>
        </>
    );
}
