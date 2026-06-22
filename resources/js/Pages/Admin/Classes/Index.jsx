import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ClassesBentoGrid from '@/Components/features/classes/ClassesBentoGrid';
import Icon from '@/Components/shared/ui/Icon';

const mockClasses = [
    { year: '2024/2025', subject: 'Biology', teacher: 'Prof. Anderson', group: '11A - Grade 11', schedule: 'Mon, Wed • 09:00 AM', studentsCount: 22, isComplete: true },
    { year: '2024/2025', subject: 'Mathematics', teacher: 'Sarah Miller', group: '10A - Grade 10', schedule: 'Tue, Thu • 10:30 AM', studentsCount: 24, isComplete: true },
    { year: '2024/2025', subject: 'Physics', teacher: 'Unassigned', group: '10B - Grade 10', schedule: 'Not set', studentsCount: 0, isComplete: false },
    { year: '2024/2025', subject: 'Chemistry', teacher: 'Dr. Watson', group: '12B - Grade 12', schedule: 'Fri • 02:00 PM', studentsCount: 18, isComplete: true },
    { year: '2023/2024', subject: 'Biology', teacher: 'Prof. Anderson', group: '10A - Grade 10', schedule: 'Mon, Wed • 09:00 AM', studentsCount: 20, isComplete: true },
    { year: '2023/2024', subject: 'Mathematics', teacher: 'Sarah Miller', group: '9A - Grade 9', schedule: 'Tue, Thu • 10:30 AM', studentsCount: 22, isComplete: true }
];

export default function Index() {
    // Presentation roles switcher states
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

    const handleActionClick = (actionName) => {
        alert(`Initiated action: ${actionName} flow...`);
    };

    const handleClassClick = (cls) => {
        alert(`Viewing Class Details for: ${cls.subject} (${cls.group})`);
    };

    // Header info with role selection controls
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Interactive demo mode switcher */}
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

            {/* Subject Classes Title & CTA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                        Subject Classes
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        48 total classes registered
                    </p>
                </div>
                <button
                    onClick={() => handleActionClick('Generate New Class')}
                    className="bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-label-md text-label-md active:scale-95 transition-all shadow-md"
                    type="button"
                >
                    <Icon name="add" className="text-[20px]" />
                    <span>Generate New Class</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Registry - Subject Classes" />

            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Subject Classes"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={false}
                headerSection={headerSection}
            >
                {/* Search, Filter, Sort, and Grid Organism */}
                <ClassesBentoGrid
                    initialClasses={mockClasses}
                    onClassClick={handleClassClick}
                />

                {/* Mobile-only Floating Action Button (FAB) */}
                <button
                    onClick={() => handleActionClick('Generate New Class')}
                    className="md:hidden fixed right-6 bottom-20 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl z-40 active:scale-90 transition-transform"
                    type="button"
                    title="Generate New Class"
                >
                    <Icon name="add" className="text-2xl" />
                </button>
            </DashboardTemplate>
        </>
    );
}
