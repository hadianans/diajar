import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import LinkedTeachersBox from '@/Components/features/academic/LinkedTeachersBox';
import SubjectStatsBox from '@/Components/features/academic/SubjectStatsBox';
import SubjectClassCard from '@/Components/features/academic/SubjectClassCard';
import Icon from '@/Components/shared/ui/Icon';

const initialTeachers = [
    { name: 'Prof. Anderson', email: 'p.anderson@diajar.edu', initials: 'PA' },
    { name: 'Dr. Sarah Miller', email: 's.miller@diajar.edu', initials: 'SM' }
];

const activeClasses = [
    { group: '11A - Grade 11', teacher: 'Sarah Miller', academicYear: '2024/2025' }
];

const statsData = [
    { label: 'Total Students', value: '32' },
    { label: 'Avg. Grade', value: 'B+' },
    { label: 'Content Modules', value: '12' }
];

const previewImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCbqlx1v1t2GV9BBmKKmVSMMU4KpSOUdKake4dHr9dWoiVWFh-q0En3iYsIjcoOIOXzP2KoEh39sgSwXoqTxMx_G0cQWQG40ZhkyO20hr7F58uUIu5_FjO28NcyP3B-zZesO2A4fTja7Y-F-9rLAmwe5Ie1ff6Yjd3JLHWQST6ZlKHclHr_jHu7RqG5Kn4UtlOqGt8h2Q_RgTaZ6xhlc7OA2I7pQtNEdhlBbPcKs9wwXM_yp9zx5BPks3Bwsz6S7kJQszJ6sDPinM';

export default function Show({ subjectId }) {
    // Interactive demo presentation roles
    const [selectedRole, setSelectedRole] = useState('admin');
    const [activeTab, setActiveTab] = useState('Academic');
    const [teachers, setTeachers] = useState(initialTeachers);

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
        alert(`Initiated action: ${actionName} flow...`);
    };

    const handleUnlinkTeacher = (teacher) => {
        if (confirm(`Are you sure you want to unlink ${teacher.name}?`)) {
            setTeachers(teachers.filter(t => t.email !== teacher.email));
        }
    };

    const subjectDisplay = subjectId
        ? subjectId.charAt(0).toUpperCase() + subjectId.slice(1)
        : 'Biology';

    // Top switcher in headerSection
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
        </div>
    );

    return (
        <>
            <Head title={`Subject Details - ${subjectDisplay}`} />

            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Subject Details"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-lg">
                    {/* Left Column: Primary Content */}
                    <div className="md:col-span-8 flex flex-col gap-stack-lg">
                        
                        {/* Subject Header Card */}
                        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm overflow-hidden relative hover:shadow-md transition-shadow duration-300">
                            {/* Decorative background logo */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                                <Icon
                                    name="urology"
                                    className="text-[120px] translate-x-8 -translate-y-8"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                                        {subjectDisplay}
                                    </h2>
                                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-sm font-label-sm rounded-full font-bold">
                                        Science Dept
                                    </span>
                                </div>
                                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-6">
                                    The study of living organisms and their interactions with the environment.
                                </p>
                                <div className="flex items-center gap-2 text-on-surface-variant">
                                    <Icon name="calendar_today" className="text-[18px]" />
                                    <span className="font-label-md text-label-md font-medium">
                                        Created on: Aug 24, 2024
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Linked Teachers List Section */}
                        <LinkedTeachersBox
                            teachers={teachers}
                            onLinkTeacherClick={() => handleActionClick('Link Teacher')}
                            onUnlinkTeacher={handleUnlinkTeacher}
                        />

                        {/* Active Classes Card */}
                        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="p-6 border-b border-outline-variant">
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                                    Active Classes
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    {activeClasses.map((cls, idx) => (
                                        <SubjectClassCard
                                            key={idx}
                                            group={cls.group}
                                            teacher={cls.teacher}
                                            academicYear={cls.academicYear}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Destructive Actions Zone */}
                        <div className="mt-8 pt-8 border-t border-outline-variant">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-error/5 rounded-xl border border-error/10">
                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-error font-bold">
                                        Danger Zone
                                    </span>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                        Deletion is restricted while classes are actively linked to this subject.
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleActionClick('Delete Subject')}
                                    className="px-6 py-2.5 bg-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md cursor-not-allowed opacity-60 flex items-center gap-2 transition-all"
                                    disabled={true}
                                    type="button"
                                >
                                    <Icon name="delete" className="text-[18px]" />
                                    Delete Subject
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sidebar Stats */}
                    <div className="md:col-span-4">
                        <SubjectStatsBox
                            subjectName={subjectDisplay}
                            stats={statsData}
                            previewImageUrl={previewImageUrl}
                        />
                    </div>
                </div>
            </DashboardTemplate>
        </>
    );
}
