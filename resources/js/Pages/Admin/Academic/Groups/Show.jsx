import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Badge from '@/Components/shared/ui/Badge';
import Icon from '@/Components/shared/ui/Icon';
import GroupStats from '@/Components/features/academic/GroupStats';
import StudentTable from '@/Components/features/academic/StudentTable';

const defaultStudents = [
    { id: 1, name: 'Alex Rivers', email: 'l.rivers@diajar.edu' },
    { id: 2, name: 'Sarah Miller', email: 's.miller@diajar.edu' },
    { id: 3, name: 'Jordan Davis', email: 'j.davis@diajar.edu' },
    { id: 4, name: 'Kevin Lee', email: 'k.lee@diajar.edu' },
];

export default function Show({ groupId = '10A' }) {
    // Role state for interactive presentation testing
    const [selectedRole, setSelectedRole] = useState('admin'); // 'admin', 'teacher', 'student'
    const [activeTab, setActiveTab] = useState('');

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        // Reset active tab depending on the role defaults
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
        console.log('Back button clicked');
        window.history.back();
    };

    // Header section
    const headerSection = (
        <section className="mb-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Presentation role toggler */}
            <div className="mb-6 p-4 bg-surface-container-low border border-outline-variant rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                        Interactive Demo Mode
                    </span>
                    <p className="text-sm text-on-surface">Toggle user roles to preview the responsive, custom navigation menus:</p>
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
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge>Grade 10</Badge>
                        <span className="text-on-surface-variant text-sm font-medium">2024/2025 Academic Year</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight">
                        {groupId} - Grade 10
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary px-6 py-3 rounded-xl font-label-md transition-all flex items-center gap-2 shadow-sm" type="button">
                        <Icon name="person_add" className="text-sm" />
                        Add Students
                    </button>
                    <button className="bg-surface-container-highest text-on-surface-variant hover:bg-surface-dim px-6 py-3 rounded-xl font-label-md transition-all flex items-center gap-2" type="button">
                        <Icon name="upload_file" className="text-sm" />
                        Import CSV
                    </button>
                </div>
            </div>
        </section>
    );

    return (
        <>
            <Head title={`Academic Group ${groupId || ''}`} />
            
            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Group Details"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
                statsSection={<GroupStats />}
            >
                <StudentTable initialStudents={defaultStudents} />
            </DashboardTemplate>
        </>
    );
}
