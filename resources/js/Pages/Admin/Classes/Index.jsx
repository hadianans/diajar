import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ClassesBentoGrid from '@/Components/features/classes/ClassesBentoGrid';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';

export default function Index() {
    const { data: classesData, loading } = useApiGet('/classes');

    const handleActionClick = (actionName) => {
        if (actionName === 'Generate New Class') {
            router.visit('/admin/classes/create');
        } else {
            alert(`Initiated action: ${actionName} flow...`);
        }
    };

    const handleClassClick = (cls) => {
        router.visit(`/admin/classes/${cls.id}`);
    };

    const classes = useMemo(() => {
        if (!classesData) return [];
        return classesData.map(c => {
            const subjectName = c.subject?.name || c.subject?.subject_name || 'Unknown Subject';
            const teacherName = c.teacher?.full_name || 'Unassigned';
            const groupName = c.group_year?.group?.name ? `${c.group_year.group.name} - ${c.group_year.grade || ''}` : 'Unknown Group';
            const yearName = c.group_year?.school_year?.name || 'Unknown Year';
            const schedule = c.day_schedule ? `${c.day_schedule} • ${c.time_schedule}` : 'Not set';

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

                        {/* Mobile-only Floating Action Button (FAB) */}
                        <button
                            onClick={() => handleActionClick('Generate New Class')}
                            className="md:hidden fixed right-6 bottom-20 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl z-40 active:scale-90 transition-transform"
                            type="button"
                            title="Generate New Class"
                        >
                            <Icon name="add" className="text-2xl" />
                        </button>
                    </>
                )}
            </DashboardTemplate>
        </>
    );
}
