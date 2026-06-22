import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AccountForm from '@/Components/features/accounts/AccountForm';

export default function Create() {
    // Interactive demo presentation roles
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

    const viewLabelMap = {
        admin: 'Admin View',
        teacher: 'Teacher View',
        student: 'Student View',
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleFormSubmit = (formData) => {
        alert(`Account created successfully!\nName: ${formData.name}\nUsername: ${formData.username}\nRole: ${formData.role}`);
        window.history.back();
    };

    // Header info with role switcher
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-xl mx-auto">
            {/* Interactive demo role nav switcher */}
            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                        Interactive Demo Mode (Switch Navbars)
                    </span>
                    <p className="text-sm text-on-surface">Toggle role menus layout to check customized views:</p>
                </div>
                <div className="flex gap-2">
                    {['admin', 'teacher', 'student'].map((r) => (
                        <button
                            key={r}
                            onClick={() => handleRoleChange(r)}
                            className={`px-4 py-2 rounded-lg font-label-sm text-xs capitalize transition-all border ${
                                selectedRole === r
                                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
                             }`}
                            type="button"
                        >
                            {r} Navbar
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Invite New User - Diajar LMS" />

            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="New Account"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
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
