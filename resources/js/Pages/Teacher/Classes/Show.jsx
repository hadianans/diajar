import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import useApiGet from '@/hooks/useApiGet';

// Feature Components
import ClassSidebar from '@/Components/features/teacher-classes/ClassSidebar';
import AttentionSummary from '@/Components/features/teacher-classes/AttentionSummary';
import StudentListFilter from '@/Components/features/teacher-classes/StudentListFilter';
import StudentListCard from '@/Components/features/teacher-classes/StudentListCard';
import ClassHealthMetrics from '@/Components/features/teacher-dashboard/ClassHealthMetrics';

export default function Show({ classId }) {
    const [searchQuery, setSearchQuery] = useState('');

    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const filterGroupId = params?.get('group_id');

    const { data: classData, loading } = useApiGet(
        `/classes/${classId}${filterGroupId ? `?group_id=${filterGroupId}` : ''}`
    );

    const classDetails = classData ? {
        id: classData.id,
        title: `${classData.subject?.subject_name} - ${(classData.group_years || []).map(gy => gy.group?.name).join(', ') || 'Grup Belum Ditugaskan'}`,
        year: `TA ${(classData.group_years || [])[0]?.school_year?.name || classData.school_year?.name || 'Tidak Diketahui'}`,
        grade: (classData.group_years || []).map(gy => gy.group?.name).join(', ') || 'Belum Ditugaskan',
        studentsCount: classData.students?.length || 0,
        groupsCount: Math.max(1, (classData.group_years || []).length),
        attentionCount: (classData.students || []).filter(s => s.is_urgent).length
    } : null;

    const students = (classData?.students || []).map(s => ({
        id: s.id,
        name: s.full_name || s.username,
        group: s.group_name || 'Tidak Diketahui',
        avatar: s.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.full_name || s.username)}&background=random`,
        completion: s.material_completion || 0,
        grade: s.assignment_avg > 0 ? `${Math.round(s.assignment_avg)}%` : 'Belum dinilai',
        assmScore: Math.round(s.assessment_avg || 0),
        isUrgent: s.is_urgent,
        srlBadge: false // Can be hooked up to plans later
    }));

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalStudents = students.length;
    const avgCompletion = totalStudents ? Math.round(students.reduce((acc, s) => acc + s.completion, 0) / totalStudents) : 0;
    const avgGrade = totalStudents ? Math.round(students.reduce((acc, s) => acc + (parseInt(s.grade) || 0), 0) / totalStudents) : 0;
    const avgScore = totalStudents ? Math.round(students.reduce((acc, s) => acc + s.assmScore, 0) / totalStudents) : 0;

    const headerSection = classDetails ? (
        <section className="mb-stack-md mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-2">
                <div className="flex-grow">
                    <h1 className="font-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight break-words">{classDetails.title}</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">{classDetails.year} • {classDetails.grade}</p>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 flex-shrink-0">
                    <span className="font-label-md text-label-md text-white bg-primary-container px-3 py-1 rounded-full">{classDetails.studentsCount} Siswa</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">{classDetails.groupsCount} Grup</span>
                </div>
            </div>
        </section>
    ) : null;

    if (loading) {
        return (
            <DashboardTemplate role="teacher" activeTab="classes" title="Memuat..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12 text-on-surface-variant">Memuat detail kelas...</div>
            </DashboardTemplate>
        );
    }

    if (!classData) {
        return (
            <DashboardTemplate role="teacher" activeTab="classes" title="Kelas Tidak Ditemukan" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12 text-on-surface-variant">Kelas tidak ditemukan.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="classes"
            title="Detail Kelas"
            showBack={true}
            onBack={() => window.location.href = '/teacher/classes'}
            headerSection={headerSection}
        >
            <Head title="Detail Kelas | LMS Diajar" />

            <div className="max-w-[1280px] mx-auto pb-12 w-full px-4 lg:px-8 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Sidebar (Analytics & Attention) - Sticky on Desktop */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                        {classDetails.attentionCount > 0 && (
                            <AttentionSummary count={classDetails.attentionCount} message="Penyelesaian rendah atau tugas hilang" />
                        )}
                        <ClassHealthMetrics
                            completion={avgCompletion}
                            avgGrade={avgGrade}
                            avgScore={avgScore}
                            layout="vertical"
                        />
                    </div>

                    {/* Right Main Content (Student List) */}
                    <div className="lg:col-span-8 space-y-6">
                        <StudentListFilter onSearch={setSearchQuery} />

                        <section className="space-y-4">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <StudentListCard
                                        key={student.id}
                                        classId={classDetails.id}
                                        studentId={student.id}
                                        {...student}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm">
                                    <span className="material-symbols-rounded text-4xl mb-3 block opacity-50">search_off</span>
                                    Tidak ada siswa yang cocok dengan pencarian Anda.
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    );
}
