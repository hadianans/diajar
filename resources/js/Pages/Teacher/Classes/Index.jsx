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

    const activeClasses = [];
    const archivedClasses = [];

    (classesData || []).forEach(c => {
        const baseClass = {
            id: c.id,
            subject: c.subject?.subject_name,
            subjectIcon: 'science',
            studentsCount: c.student_count || 0, // Fallback to total class students
            additionalStudents: Math.max(0, (c.student_count || 0) - 3)
        };

        if (!c.group_years || c.group_years.length === 0) {
            const classItem = {
                ...baseClass,
                title: 'Grup Belum Ditugaskan',
                grade: 'Belum Ditugaskan',
                year: `TA ${c.school_year?.name || 'Tidak Diketahui'}`,
                groupId: null,
            };
            if (c.is_active) activeClasses.push(classItem);
            else archivedClasses.push(classItem);
        } else {
            c.group_years.forEach(gy => {
                const classItem = {
                    ...baseClass,
                    title: gy.group?.name || 'Kohort Tidak Diketahui',
                    grade: gy.group?.name || 'Tidak Diketahui',
                    year: `TA ${gy.school_year?.name || c.school_year?.name || 'Tidak Diketahui'}`,
                    groupId: gy.id,
                    // If we had per-group student counts from API, we'd use it here.
                };
                if (c.is_active) activeClasses.push(classItem);
                else archivedClasses.push(classItem);
            });
        }
    });

    const headerSection = (
        <section className="space-y-1 mb-6 mt-4">
            <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Kelas</h1>
            <p className="text-body-md font-body-md text-on-surface-variant">Kelola grup pengajaran Anda</p>
        </section>
    );

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="classes"
            title="Kelas Saya"
            headerSection={headerSection}
        >
            <Head title="Kelas Guru | LMS Diajar" />

            <div className="w-full space-y-stack-lg pb-12">
                <ClassFilters onSearch={setSearchQuery} />

                {loading ? (
                    <div className="text-center p-8 text-on-surface-variant">Memuat kelas...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeClasses.length > 0 ? (
                                activeClasses.map(cls => (
                                    <ActiveClassCard
                                        key={`${cls.id}-${cls.groupId || 'unassigned'}`}
                                        id={cls.id}
                                        groupId={cls.groupId}
                                        subject={cls.subject}
                                        subjectIcon={cls.subjectIcon}
                                        title={cls.title}
                                        grade={cls.grade}
                                        studentsCount={cls.studentsCount}
                                        year={cls.year}
                                        additionalStudents={cls.additionalStudents}
                                    />
                                ))
                            ) : (
                                <div className="p-6 bg-surface-container rounded-xl text-center text-on-surface-variant text-sm">
                                    Tidak ada kelas aktif yang ditemukan.
                                </div>
                            )}
                        </div>

                        {archivedClasses.length > 0 && (
                            <section className="space-y-stack-sm pb-8 mt-8">
                                <h2 className="text-label-sm font-label-sm tracking-wider text-outline uppercase px-1">Kelas Diarsipkan</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {archivedClasses.map((cls) => (
                                        <ArchivedClassCard
                                            key={`${cls.id}-${cls.groupId || 'unassigned'}`}
                                            id={cls.id}
                                            groupId={cls.groupId}
                                            subject={cls.subject}
                                            title={cls.title}
                                            year={cls.year}
                                            studentsCount={cls.studentsCount}
                                        />
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
