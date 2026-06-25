import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ClassSummaryCard from '@/Components/features/classes/ClassSummaryCard';
import LinkedCohortCard from '@/Components/features/classes/LinkedCohortCard';
import StudentsAccessCard from '@/Components/features/classes/StudentsAccessCard';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Show({ classId }) {
    const { data: cls, loading } = useApiGet(`/classes/${classId}`);

    const handleBack = () => {
        router.visit('/admin/classes');
    };

    const handleActionClick = (actionName) => {
        alert(`Initiated action: ${actionName} flow...`);
    };

    const handleDeleteClass = async () => {
        if (confirm('DANGER: This action cannot be undone. All class data, logs, and configurations for this class will be permanently deleted. Are you absolutely sure?')) {
            try {
                await api.delete(`/classes/${classId}`);
                alert('Class deleted successfully.');
                router.visit('/admin/classes');
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete class.');
            }
        }
    };

    const handleEditSchedule = async () => {
        const day = prompt('Enter day of week (0=Sun, 1=Mon, ..., 6=Sat):', cls?.day_schedule || 1);
        if (day === null) return;
        const time = prompt('Enter time schedule (HH:MM) 24h format:', cls?.time_schedule ? cls.time_schedule.substring(0, 5) : '09:00');
        if (time === null) return;
        
        try {
            await api.patch(`/classes/${classId}/schedule`, {
                day_schedule: parseInt(day),
                time_schedule: time
            });
            alert('Schedule updated successfully! Please reload the page.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update schedule.');
        }
    };

    const students = useMemo(() => {
        if (!cls?.group_year?.student_groups) return [];
        return cls.group_year.student_groups.map(sg => {
            const st = sg.student;
            return {
                id: st.id,
                name: st.full_name,
                avatarUrl: st.picture || null,
                initials: st.full_name ? st.full_name.substring(0, 2).toUpperCase() : 'NA'
            };
        });
    }, [cls]);

    if (loading) {
        return (
            <DashboardTemplate activeTab="Classes" title="Loading..." viewLabel="Admin View" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-on-surface-variant">Loading class details...</div>
            </DashboardTemplate>
        );
    }

    if (!cls) {
        return (
            <DashboardTemplate activeTab="Classes" title="Not Found" viewLabel="Admin View" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-error">Class not found.</div>
            </DashboardTemplate>
        );
    }

    const subjectName = cls.subject?.name || cls.subject?.subject_name || 'Unknown Subject';
    const teacherName = cls.teacher?.full_name || 'Unassigned';
    const groupName = cls.group_year?.group?.name ? `${cls.group_year.group.name} - ${cls.group_year.grade || ''}` : 'Unknown Group';
    const yearName = cls.group_year?.school_year?.name || 'Unknown Year';
    const scheduleStr = cls.day_schedule !== null && cls.time_schedule ? `${days[cls.day_schedule]} • ${cls.time_schedule.substring(0, 5)}` : 'Not set';
    const isComplete = cls.group_years_id && cls.day_schedule !== null && cls.time_schedule;
    const title = `${subjectName} — ${groupName}`;

    // Hero title info card
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero details */}
            <div className="flex flex-col gap-2">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-extrabold tracking-tight">
                    {title}
                </h2>
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-bold">
                        {yearName} Academic Year
                    </span>
                    {isComplete ? (
                        <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md flex items-center gap-1 font-bold">
                            <Icon name="check_circle" className="text-[16px] fill-icon" style={{ fontVariationSettings: "'FILL' 1" }} />
                            Fully Configured
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-1 font-bold">
                            <Icon name="error" className="text-[16px] fill-icon" style={{ fontVariationSettings: "'FILL' 1" }} />
                            Incomplete Setup
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`Class Configuration - ${title}`} />

            <DashboardTemplate
                activeTab="Classes"
                title="Class Configuration"
                viewLabel="Admin View"
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Left Column: Summary and Group Card */}
                    <div className="md:col-span-7 flex flex-col gap-gutter">
                        <ClassSummaryCard
                            subject={subjectName}
                            teacher={teacherName}
                            schedule={scheduleStr}
                            academicYear={yearName}
                            onEditScheduleClick={handleEditSchedule}
                        />

                        <LinkedCohortCard
                            cohortName={groupName}
                            activeStudentsCount={students.length}
                            onChangeGroupClick={() => handleActionClick('Change Student Group')}
                            onCohortClick={() => handleActionClick('View Student Group Details')}
                        />
                    </div>

                    {/* Right Column: Students Preview Box */}
                    <div className="md:col-span-5">
                        <StudentsAccessCard
                            students={students}
                            onViewAllClick={() => handleActionClick('View All Access Students')}
                            onStudentClick={(s) => handleActionClick(`View Student Profile details for ${s.name}`)}
                        />
                    </div>
                </div>

                {/* Destructive zone */}
                <footer className="mt-stack-lg pt-stack-lg border-t border-outline-variant flex justify-center w-full">
                    <button
                        onClick={handleDeleteClass}
                        className="px-8 py-3 rounded-xl border border-error text-error font-headline-md text-headline-md hover:bg-error-container/10 transition-all active:scale-95 flex items-center gap-2 font-bold"
                        type="button"
                    >
                        <Icon name="delete_forever" className="text-[22px]" />
                        <span>Delete Class</span>
                    </button>
                </footer>
            </DashboardTemplate>
        </>
    );
}
