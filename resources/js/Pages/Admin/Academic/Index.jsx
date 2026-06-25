import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ProgressMetricCard from '@/Components/features/academic/ProgressMetricCard';
import AcademicYearsBox from '@/Components/features/academic/AcademicYearsBox';
import SubjectsBox from '@/Components/features/academic/SubjectsBox';
import GroupsBox from '@/Components/features/academic/GroupsBox';
import EcosystemBanner from '@/Components/features/academic/EcosystemBanner';
import useApiGet from '@/hooks/useApiGet';

const bannerImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAugxZOwpAEuPgRLfjnGSAvR4IKQLMzp3eBMEm4HH4hq979R4Kh8MtPYPwxVlg0HR2J_WJlO8bAEjnHg3HO-xefEH69SQj2YB3W4HTkjBsbxZoySpXJzJTeavwhX6WVxRHm-k_RzcyiHZjhVwI6G46BWZIOd6z2oMtLfthV8WJYEW0kECUGZ3amsK2NFipU3IJlnWnLfWICI4nSXn44z40pddEmNxP-xWPBaMxhQHi1KumvRzE7lO94u4dH2rGGum4bQ1f8ylS-6fE';

export default function Index() {
    const { data: yearsData, loading: yearsLoading } = useApiGet('/school-years');
    const { data: subjectsData, loading: subjectsLoading } = useApiGet('/subjects');
    const { data: groupsData, loading: groupsLoading } = useApiGet('/groups');

    const handleActionClick = (actionName) => {
        alert(`Initiated action: ${actionName} setup flow...`);
    };

    // Format data for the UI components
    const years = useMemo(() => {
        if (!yearsData) return [];
        return yearsData.map(y => ({
            id: y.id,
            year: y.name,
            range: `${new Date(y.date_start).toLocaleDateString()} - ${new Date(y.date_end).toLocaleDateString()}`,
            status: y.status === 'active' ? 'Active' : 'Archived'
        }));
    }, [yearsData]);

    const activeYear = years.find(y => y.status === 'Active');

    const subjects = useMemo(() => {
        if (!subjectsData) return [];
        return subjectsData.map(s => ({
            id: s.id,
            name: s.name,
            teachersCount: s.teacher_count || 0,
            icon: 'menu_book', // Mock icon or can be mapped dynamically
            warning: s.has_no_teacher
        }));
    }, [subjectsData]);

    const groups = useMemo(() => {
        if (!groupsData) return [];
        return groupsData.map(gy => ({
            id: gy.group_id,
            groupYearId: gy.id,
            groupName: gy.group.name,
            grade: gy.grade,
            studentsCount: gy.student_count || 0,
            warning: gy.has_no_students
        }));
    }, [groupsData]);

    // Header switcher section
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                {activeYear && (
                    <div className="inline-flex items-center bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant shadow-sm">
                        <span className="text-label-sm font-label-sm text-on-surface-variant mr-2 font-medium">Active Year:</span>
                        <span className="text-label-sm font-label-sm text-primary font-bold">{activeYear.year}</span>
                    </div>
                )}
            </div>
        </div>
    );

    // Metrics progress strip
    const metricsSection = (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <ProgressMetricCard
                label="Subjects with teachers"
                value={subjectsLoading ? '...' : `${subjects.filter(s => !s.warning).length}/${subjects.length}`}
                icon="badge"
                bgClass="bg-primary-container/10"
                textClass="text-primary"
            />
            <ProgressMetricCard
                label="Groups with students"
                value={groupsLoading ? '...' : `${groups.filter(g => !g.warning).length}/${groups.length}`}
                icon="groups"
                bgClass="bg-secondary-container/20"
                textClass="text-secondary"
            />
            <ProgressMetricCard
                label="Active Academic Years"
                value={yearsLoading ? '...' : (activeYear ? '1' : '0')}
                icon="event"
                bgClass="bg-tertiary-container/10"
                textClass="text-tertiary"
            />
        </section>
    );

    return (
        <>
            <Head title="Academic Management Hub" />

            <DashboardTemplate
                activeTab="Academic"
                title="Academic Management"
                viewLabel="Admin View"
                showBack={false}
                headerSection={headerSection}
                statsSection={metricsSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
                    {/* Academic Years Box */}
                    <div className="lg:col-span-4">
                        <AcademicYearsBox
                            years={years}
                            onAddYearClick={() => handleActionClick('New Academic Year')}
                            onItemClick={(year) => router.visit(`/admin/academic/years/${year.id}`)}
                        />
                    </div>

                    {/* Subjects Box */}
                    <div className="lg:col-span-4">
                        <SubjectsBox
                            subjects={subjects}
                            onAddSubjectClick={() => handleActionClick('New Subject')}
                            onViewAllSubjects={() => handleActionClick('View All Subjects')}
                            onItemClick={(sub) => router.visit(`/admin/academic/subjects/${sub.id}`)}
                        />
                    </div>

                    {/* Student Groups Box */}
                    <div className="lg:col-span-4">
                        <GroupsBox
                            groups={groups}
                            onAddGroupClick={() => handleActionClick('New Student Group')}
                            onViewAllGroups={() => handleActionClick('View All Student Groups')}
                            onItemClick={(group) => router.visit(`/admin/academic/groups/${group.id}`)}
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
