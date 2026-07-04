import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ClassesBentoGrid from '@/Components/features/classes/ClassesBentoGrid';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';

export default function Index() {
    const { data: classesData, loading } = useApiGet('/classes');

    const handleClassClick = (cls) => {
        router.visit(`/admin/classes/${cls.id}`);
    };

    const classes = useMemo(() => {
        if (!classesData) return [];
        return classesData.map(c => {
            const subjectName = c.subject?.name || c.subject?.subject_name || 'Unknown Subject';
            const teacherName = c.teacher?.full_name || 'Unassigned';
            const groupName = c.group_years && c.group_years.length > 0 
                ? c.group_years.map(gy => gy.group?.name ? gy.group.name : 'Unknown').join(', ') 
                : 'Unknown Group';
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const yearName = c.group_years?.[0]?.school_year?.name || c.school_year?.name || 'Unknown Year';
            const schedule = (c.day_schedule !== null && c.day_schedule !== undefined) ? `${days[c.day_schedule]} • ${c.time_schedule}` : 'Not set';

            return {
                id: c.id,
                year: yearName,
                subject: subjectName,
                teacher: teacherName,
                group: groupName,
                schedule: schedule,
                studentsCount: c.student_count || 0,
                isComplete: c.is_complete
            };
        });
    }, [classesData]);

    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Subject Classes Title & CTA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                        Subject Classes
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        {loading ? 'Loading...' : `${classes.length} total classes registered`}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Registry - Subject Classes" />

            <DashboardTemplate
                activeTab="Classes"
                title="Subject Classes"
                viewLabel="Admin View"
                showBack={false}
                headerSection={headerSection}
            >
                {loading ? (
                    <div className="w-full flex justify-center py-12 text-on-surface-variant">Loading classes...</div>
                ) : (
                    <>
                        <ClassesBentoGrid
                            initialClasses={classes}
                            onClassClick={handleClassClick}
                        />
                    </>
                )}
            </DashboardTemplate>
        </>
    );
}
