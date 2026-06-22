import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ProgressMetricCard from '@/Components/features/academic/ProgressMetricCard';
import AcademicYearsBox from '@/Components/features/academic/AcademicYearsBox';
import SubjectsBox from '@/Components/features/academic/SubjectsBox';
import GroupsBox from '@/Components/features/academic/GroupsBox';
import EcosystemBanner from '@/Components/features/academic/EcosystemBanner';

const mockYears = [
    { year: '2024/2025', range: 'Sep 1, 2024 - Jun 30, 2025', status: 'Active' },
    { year: '2023/2024', range: 'Sep 1, 2023 - Jun 30, 2024', status: 'Archived' },
    { year: '2022/2023', range: 'Sep 1, 2022 - Jun 30, 2023', status: 'Archived' }
];

const mockSubjects = [
    { name: 'Biology', teachersCount: 3, icon: 'biotech' },
    { name: 'Mathematics', teachersCount: 4, icon: 'calculate' },
    { name: 'Physics', teachersCount: 0, icon: 'precision_manufacturing', warning: true },
    { name: 'Chemistry', teachersCount: 2, icon: 'science' }
];

const mockGroups = [
    { groupName: '10A', grade: 'Grade 10', studentsCount: 24 },
    { groupName: '10B', grade: 'Grade 10', studentsCount: 0, warning: true },
    { groupName: '11A', grade: 'Grade 11', studentsCount: 22 },
    { groupName: '12C', grade: 'Grade 12', studentsCount: 18 }
];

const bannerImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAugxZOwpAEuPgRLfjnGSAvR4IKQLMzp3eBMEm4HH4hq979R4Kh8MtPYPwxVlg0HR2J_WJlO8bAEjnHg3HO-xefEH69SQj2YB3W4HTkjBsbxZoySpXJzJTeavwhX6WVxRHm-k_RzcyiHZjhVwI6G46BWZIOd6z2oMtLfthV8WJYEW0kECUGZ3amsK2NFipU3IJlnWnLfWICI4nSXn44z40pddEmNxP-xWPBaMxhQHi1KumvRzE7lO94u4dH2rGGum4bQ1f8ylS-6fE';

export default function Index() {
    const [selectedRole, setSelectedRole] = useState('admin');
    const [activeNavbarRole, setActiveNavbarRole] = useState('admin');
    const [activeTab, setActiveTab] = useState('Academic');

    const handleNavbarRoleChange = (role) => {
        setActiveNavbarRole(role);
        if (role === 'admin') {
            setActiveTab('Academic');
        } else if (role === 'teacher') {
            setActiveTab('Class');
        } else {
            setActiveTab('Dashboard');
        }
    };

    const handleActionClick = (actionName) => {
        alert(`Initiated action: ${actionName} setup flow...`);
    };

    const viewLabelMap = {
        admin: 'Admin View',
        teacher: 'Teacher View',
        student: 'Student View',
    };

    // Header switcher section
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Interactive demo layout switcher */}
            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                        Interactive Demo Mode (Switch Navbars)
                    </span>
                    <p className="text-sm text-on-surface">Toggle role menus layout to check customized views:</p>
                </div>
                <div className="flex gap-2">
                    {['admin', 'teacher', 'student'].map((role) => (
                        <button
                            key={role}
                            onClick={() => handleNavbarRoleChange(role)}
                            className={`px-4 py-2 rounded-lg font-label-sm text-xs capitalize transition-all border ${
                                activeNavbarRole === role
                                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
                            }`}
                            type="button"
                        >
                            {role} Navbar
                        </button>
                    ))}
                </div>
            </div>

            {/* Intro text */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                        Academic Hub
                    </h2>
                    <p className="text-on-surface-variant font-body-md text-body-md mt-1">
                        Manage institutional structures and learning cohorts.
                    </p>
                </div>
                <div className="inline-flex items-center bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant shadow-sm">
                    <span className="text-label-sm font-label-sm text-on-surface-variant mr-2 font-medium">Active Year:</span>
                    <span className="text-label-sm font-label-sm text-primary font-bold">2024/2025</span>
                </div>
            </div>
        </div>
    );

    // Metrics progress strip
    const metricsSection = (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <ProgressMetricCard
                label="Subjects with teachers"
                value="22/24"
                icon="badge"
                bgClass="bg-primary-container/10"
                textClass="text-primary"
            />
            <ProgressMetricCard
                label="Groups with students"
                value="10/12"
                icon="groups"
                bgClass="bg-secondary-container/20"
                textClass="text-secondary"
            />
            <ProgressMetricCard
                label="Classes generated"
                value="48"
                icon="auto_stories"
                bgClass="bg-tertiary-container/10"
                textClass="text-tertiary"
            />
        </section>
    );

    return (
        <>
            <Head title="Academic Management Hub" />

            <DashboardTemplate
                role={activeNavbarRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Academic Management"
                viewLabel={viewLabelMap[activeNavbarRole]}
                showBack={false}
                headerSection={headerSection}
                statsSection={metricsSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
                    {/* Academic Years Box */}
                    <div className="lg:col-span-4">
                        <AcademicYearsBox
                            years={mockYears}
                            onAddYearClick={() => handleActionClick('New Academic Year')}
                        />
                    </div>

                    {/* Subjects Box */}
                    <div className="lg:col-span-4">
                        <SubjectsBox
                            subjects={mockSubjects}
                            onAddSubjectClick={() => handleActionClick('New Subject')}
                            onViewAllSubjects={() => handleActionClick('View All Subjects')}
                        />
                    </div>

                    {/* Student Groups Box */}
                    <div className="lg:col-span-4">
                        <GroupsBox
                            groups={mockGroups}
                            onAddGroupClick={() => handleActionClick('New Student Group')}
                            onViewAllGroups={() => handleActionClick('View All Student Groups')}
                        />
                    </div>

                    {/* Ecosystem Premium Banner */}
                    <div className="lg:col-span-12 hidden lg:block">
                        <EcosystemBanner
                            imageUrl={bannerImageUrl}
                            title="Streamline your academic ecosystem"
                            subtitle="Unified management for years, subjects, and student cohorts designed for administrative clarity."
                        />
                    </div>
                </div>
            </DashboardTemplate>
        </>
    );
}
