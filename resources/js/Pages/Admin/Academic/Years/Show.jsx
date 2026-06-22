import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import YearGroupsList from '@/Components/features/academic/YearGroupsList';
import YearClassesList from '@/Components/features/academic/YearClassesList';
import Icon from '@/Components/shared/ui/Icon';

const mockGroups = [
    { groupName: '10A', grade: 'Grade 10', studentsCount: 24 },
    { groupName: '10B', grade: 'Grade 10', studentsCount: 0, warning: true },
    { groupName: '11A', grade: 'Grade 11', studentsCount: 22 }
];

const mockClasses = [
    { subject: 'Biology', teacher: 'Prof. Anderson', group: '11A', icon: 'science' },
    { subject: 'Mathematics', teacher: 'Sarah Miller', group: '10A', icon: 'functions' },
    { subject: 'Physics', teacher: '', group: '', icon: 'bolt', isWarning: true, warningMessage: 'Unassigned (10B)' }
];

export default function Show({ yearId }) {
    // Interactive demo presentation roles
    const [selectedRole, setSelectedRole] = useState('admin');
    const [activeTab, setActiveTab] = useState('Academic');

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        if (role === 'admin') {
            setActiveTab('Academic');
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

    const handleActionClick = (actionName) => {
        alert(`Initiated action: ${actionName} setup flow...`);
    };

    const yearDisplay = yearId || '2024/2025';

    // Top Header section
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

            {/* Academic Year Info Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                            {yearDisplay}
                        </h2>
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-md rounded-full font-label-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            ACTIVE
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                    <Icon name="calendar_today" className="text-[18px]" />
                    <p className="font-body-md text-body-md">Sep 1, 2024 - Jun 30, 2025</p>
                    <button
                        onClick={() => handleActionClick('Edit Dates')}
                        className="p-1.5 hover:bg-surface-container-high transition-colors rounded-full text-primary active:scale-95 duration-150 flex items-center justify-center"
                        type="button"
                    >
                        <Icon name="edit" className="text-[20px]" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`Academic Year Details - ${yearDisplay}`} />

            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Academic Year"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
                    {/* Groups and Classes (Stacked in Mobile/Tablet, Left Panel in Desktop) */}
                    <div className="lg:col-span-8 flex flex-col gap-stack-lg order-2 lg:order-1">
                        <YearGroupsList
                            groups={mockGroups}
                            onAddGroupClick={() => handleActionClick('Add Group to Academic Year')}
                            onGroupClick={(group) => handleActionClick(`View Details of Group ${group.groupName}`)}
                        />

                        <YearClassesList
                            classes={mockClasses}
                            onViewAllClick={() => handleActionClick('View All Subject Classes')}
                            onGenerateClassClick={() => handleActionClick('Generate New Class')}
                            onClassMoreClick={(cls) => handleActionClick(`Open Options for Class ${cls.subject}`)}
                        />
                    </div>

                    {/* Status Management (Top Panel in Mobile/Tablet, Right Side Panel in Desktop) */}
                    <div className="lg:col-span-4 order-1 lg:order-2">
                        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-label-md text-label-md text-error font-bold mb-4 uppercase tracking-wider">
                                Status Management
                            </h3>
                            <button
                                onClick={() => handleActionClick('Archive Academic Year')}
                                className="w-full py-3 px-4 border-2 border-error text-error font-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-error-container/20 transition-all active:scale-[0.98] duration-150"
                                type="button"
                            >
                                <Icon name="archive" className="text-[20px]" />
                                Archive This Year
                            </button>
                            <div className="mt-3 flex items-start gap-2 text-on-surface-variant">
                                <Icon name="info" className="text-[18px] text-tertiary flex-shrink-0 mt-0.5" />
                                <p className="text-label-sm font-label-sm leading-relaxed">
                                    Archiving locks all data as read-only. This action is consequential.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </DashboardTemplate>
        </>
    );
}
