import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import useApiGet from '@/hooks/useApiGet';

// Feature Components
import ClassFilters from '@/Components/features/teacher-classes/ClassFilters';
import ActiveClassCard from '@/Components/features/teacher-classes/ActiveClassCard';
import ArchivedClassCard from '@/Components/features/teacher-classes/ArchivedClassCard';

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');
    
    // We can pass searchQuery to the API to filter on the backend
    const { data: classesData, loading } = useApiGet(
        `/classes${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`
    );

    const activeClasses = (classesData || []).filter(c => c.is_active).map(c => ({
        id: c.id,
        subject: c.subject?.subject_name,
        subjectIcon: 'science', // Fallback or dynamic based on subject
        title: `${c.subject?.subject_name} - ${c.group_year?.group?.name}`,
        grade: c.group_year?.group?.name,
        studentsCount: c.student_count || 0,
        year: `AY ${c.group_year?.school_year?.name}`,
        additionalStudents: Math.max(0, (c.student_count || 0) - 3)
    }));

    const archivedClasses = (classesData || []).filter(c => !c.is_active).map(c => ({
        id: c.id,
        title: `${c.subject?.subject_name} - ${c.group_year?.group?.name}`,
        year: c.group_year?.school_year?.name,
        studentsCount: c.student_count || 0
    }));

    const headerSection = (
        <section className="space-y-1 mb-6 mt-4">
            <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Classes</h1>
            <p className="text-body-md font-body-md text-on-surface-variant">Manage your teaching groups</p>
        </section>
    );

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="classes"
            title="My Classes"
            headerSection={headerSection}
        >
            <Head title="Teacher Classes | Diajar LMS" />

            <div className="max-w-2xl mx-auto space-y-stack-lg pb-12">
                <ClassFilters onSearch={setSearchQuery} />

                {loading ? (
                    <div className="text-center p-8 text-on-surface-variant">Loading classes...</div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {activeClasses.length > 0 ? (
                                activeClasses.map(ac => (
                                    <ActiveClassCard key={ac.id} {...ac} />
                                ))
                            ) : (
                                <div className="p-6 bg-surface-container rounded-xl text-center text-on-surface-variant text-sm">
                                    No active classes found.
                                </div>
                            )}
                        </div>

                        {archivedClasses.length > 0 && (
                            <section className="space-y-stack-sm pb-8 mt-8">
                                <h2 className="text-label-sm font-label-sm tracking-wider text-outline uppercase px-1">Archived Classes</h2>
                                <div className="space-y-stack-md">
                                    {archivedClasses.map((ac) => (
                                        <ArchivedClassCard key={ac.id} {...ac} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </DashboardTemplate>
    );
}
