import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AccountList from '@/Components/features/accounts/AccountList';

const mockAccounts = [
    {
        id: 1,
        name: 'Alex Rivers',
        role: 'Admin',
        email: 'alex.rivers@lumen.edu',
        createdDate: 'Sep 12, 2024',
        avatar: null
    },
    {
        id: 2,
        name: 'Sarah Miller',
        role: 'Teacher',
        email: 's.miller@lumen.edu',
        createdDate: 'Aug 28, 2024',
        avatar: null
    },
    {
        id: 3,
        name: 'Liam Chen',
        role: 'Student',
        email: 'l.chen@lumen.edu',
        createdDate: 'Sep 01, 2024',
        avatar: null
    },
    {
        id: 4,
        name: 'Maria Garcia',
        role: 'Student',
        email: 'm.garcia@lumen.edu',
        createdDate: 'Sep 01, 2024',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBndjxPbIT8l_r5jpDmQqUSoPW8N7Pwt-2rW03GW7kKDrKvThKpexTHZDMYcEPdXejYnqBVEMGOZMi9wzjJuPkTbwsfC93W4BBSkvZmcIJkZ7nQ-6CZMeqpXaJIvjPV6azBxf8OBLMV_zINocOR707klhbS_GW4Z6F52_7XNvpzmCJ9LVCP4JpgHpajcyQ0lDxrAvTs-k3H1bhk08gSxTwoysezySuVoDiPkFnw9GUd12f88YGVnLPAT0P5ymqttaZqHMHmVK5lKX8'
    },
    {
        id: 5,
        name: 'John Smith',
        role: 'Student',
        email: 'j.smith@lumen.edu',
        createdDate: 'Aug 30, 2024',
        avatar: null
    }
];

export default function Index() {
    const [selectedRole, setSelectedRole] = useState('admin');
    const [activeTab, setActiveTab] = useState('Account');

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        if (role === 'admin') {
            setActiveTab('Account');
        } else if (role === 'teacher') {
            setActiveTab('Class');
        } else {
            setActiveTab('Dashboard');
        }
    };

    const handleCreateAccount = () => {
        alert('Initiating "Create Account" setup flow...');
    };

    const viewLabelMap = {
        admin: 'Admin View',
        teacher: 'Teacher View',
        student: 'Student View',
    };

    const headerSection = (
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
                            className={`px-4 py-2 rounded-lg font-label-sm text-xs capitalize transition-all border ${
                                selectedRole === role
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
        </div>
    );

    return (
        <>
            <Head title="Admin Accounts" />

            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Lumen Admin"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={false}
                headerSection={headerSection}
            >
                <div className="max-w-2xl mx-auto w-full">
                    <AccountList
                        initialAccounts={mockAccounts}
                        onCreateClick={handleCreateAccount}
                    />
                </div>
            </DashboardTemplate>
        </>
    );
}
