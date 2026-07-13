import React, { useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ProgressMetricCard from '@/Components/features/academic/ProgressMetricCard';
import AcademicYearsBox from '@/Components/features/academic/AcademicYearsBox';
import SubjectsBox from '@/Components/features/academic/SubjectsBox';
import GroupsBox from '@/Components/features/academic/GroupsBox';
import EcosystemBanner from '@/Components/features/academic/EcosystemBanner';
import AcademicYearModal from '@/Components/features/academic/modals/AcademicYearModal';
import SubjectModal from '@/Components/features/academic/modals/SubjectModal';
import GroupModal from '@/Components/features/academic/modals/GroupModal';
import useApiGet from '@/hooks/useApiGet';

const bannerImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAugxZOwpAEuPgRLfjnGSAvR4IKQLMzp3eBMEm4HH4hq979R4Kh8MtPYPwxVlg0HR2J_WJlO8bAEjnHg3HO-xefEH69SQj2YB3W4HTkjBsbxZoySpXJzJTeavwhX6WVxRHm-k_RzcyiHZjhVwI6G46BWZIOd6z2oMtLfthV8WJYEW0kECUGZ3amsK2NFipU3IJlnWnLfWICI4nSXn44z40pddEmNxP-xWPBaMxhQHi1KumvRzE7lO94u4dH2rGGum4bQ1f8ylS-6fE';

export default function Index() {
    const { data: yearsData, loading: yearsLoading, refetch: refetchYears } = useApiGet('/school-years');
    const { data: subjectsData, loading: subjectsLoading, refetch: refetchSubjects } = useApiGet('/subjects');
    const { data: groupsData, loading: groupsLoading, refetch: refetchGroups } = useApiGet('/groups');

    const { url } = usePage();

    // Initialize tab from URL
    const initialTab = useMemo(() => {
        try {
            const search = url.split('?')[1];
            if (search) {
                const params = new URLSearchParams(search);
                return params.get('tab') || 'years';
            }
        } catch (e) { }
        return 'years';
    }, [url]);

    const [activeTab, setActiveTab] = useState(initialTab);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('tab', tab);
        window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    };
    const [showYearModal, setShowYearModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Format data for the UI components
    const years = useMemo(() => {
        if (!yearsData) return [];
        return yearsData
            .filter(y => y.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(y => ({
                id: y.id,
                year: y.name,
                range: `${new Date(y.date_start).toLocaleDateString()} - ${new Date(y.date_end).toLocaleDateString()}`,
                status: y.status === 'active' ? 'Active' : 'Archived'
            }));
    }, [yearsData, searchQuery]);

    const activeYear = yearsData ? yearsData.find(y => y.status === 'active') : null;

    const subjects = useMemo(() => {
        if (!subjectsData) return [];
        return subjectsData
            .filter(s => s.subject_name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(s => ({
                id: s.id,
                name: s.subject_name,
                teachersCount: s.teacher_count || 0,
                icon: 'menu_book', // Mock icon or can be mapped dynamically
                warning: s.has_no_teacher
            }));
    }, [subjectsData, searchQuery]);

    const groups = useMemo(() => {
        if (!groupsData) return [];
        return groupsData
            .filter(gy => gy.group.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(gy => ({
                id: gy.group_id,
                groupYearId: gy.id,
                groupName: gy.group.name,
                grade: gy.grade,
                studentsCount: gy.student_count || 0,
                warning: gy.has_no_students
            }));
    }, [groupsData, searchQuery]);

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
                <div className="w-full flex flex-col">
                    {/* Tabs Navigation and Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-stack-md">
                        <div className="flex space-x-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 overflow-x-auto shrink-0 w-full sm:w-auto">
                            <button
                                onClick={() => handleTabChange('years')}
                                className={`flex-1 min-w-fit px-6 py-2.5 rounded-lg font-label-md text-label-md transition-all ${activeTab === 'years' ? 'bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/20' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                            >
                                Academic Years
                            </button>
                            <button
                                onClick={() => handleTabChange('subjects')}
                                className={`flex-1 min-w-fit px-6 py-2.5 rounded-lg font-label-md text-label-md transition-all ${activeTab === 'subjects' ? 'bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/20' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                            >
                                Subjects
                            </button>
                            <button
                                onClick={() => handleTabChange('groups')}
                                className={`flex-1 min-w-fit px-6 py-2.5 rounded-lg font-label-md text-label-md transition-all ${activeTab === 'groups' ? 'bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/20' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                            >
                                Student Groups
                            </button>
                        </div>

                        <div className="relative w-full sm:w-64 shrink-0">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-2.5 px-4 text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === 'years' && (
                            <AcademicYearsBox
                                years={years}
                                onAddYearClick={() => setShowYearModal(true)}
                                onItemClick={(year) => router.visit(`/admin/academic/years/${year.id}`)}
                            />
                        )}
                        {activeTab === 'subjects' && (
                            <SubjectsBox
                                subjects={subjects}
                                onAddSubjectClick={() => setShowSubjectModal(true)}
                                onItemClick={(sub) => router.visit(`/admin/academic/subjects/${sub.id}`)}
                            />
                        )}
                        {activeTab === 'groups' && (
                            <GroupsBox
                                groups={groups}
                                onAddGroupClick={() => setShowGroupModal(true)}
                                onItemClick={(group) => router.visit(`/admin/academic/groups/${group.id}`)}
                            />
                        )}
                    </div>

                    {/* Ecosystem Premium Banner */}
                    {/* <div className="mt-stack-lg hidden lg:block">
                        <EcosystemBanner
                            imageUrl={bannerImageUrl}
                            title="Streamline your academic ecosystem"
                            subtitle="Unified management for years, subjects, and student cohorts designed for administrative clarity."
                        />
                    </div> */}
                </div>
            </DashboardTemplate>

            <AcademicYearModal
                show={showYearModal}
                onClose={() => setShowYearModal(false)}
                onSuccess={() => {
                    setShowYearModal(false);
                    refetchYears();
                }}
            />
            <SubjectModal
                show={showSubjectModal}
                onClose={() => setShowSubjectModal(false)}
                onSuccess={() => {
                    setShowSubjectModal(false);
                    refetchSubjects();
                }}
            />
            <GroupModal
                show={showGroupModal}
                onClose={() => setShowGroupModal(false)}
                onSuccess={() => {
                    setShowGroupModal(false);
                    refetchGroups();
                }}
                activeYearId={activeYear?.id}
            />
        </>
    );
}
