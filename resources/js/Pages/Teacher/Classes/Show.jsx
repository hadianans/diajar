import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import useApiGet from '@/hooks/useApiGet';

// Feature Components
import ClassSidebar from '@/Components/features/teacher-classes/ClassSidebar';
import AttentionSummary from '@/Components/features/teacher-classes/AttentionSummary';
import StudentListFilter from '@/Components/features/teacher-classes/StudentListFilter';
import StudentListCard from '@/Components/features/teacher-classes/StudentListCard';

export default function Show({ classId }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: classData, loading } = useApiGet(`/classes/${classId}`);

    const classDetails = classData ? {
        id: classData.id,
        title: `${classData.subject?.subject_name} - ${classData.groupYear?.group?.name}`,
        year: `AY ${classData.groupYear?.schoolYear?.name}`,
        grade: classData.groupYear?.group?.name,
        studentsCount: classData.students?.length || 0,
        groupsCount: 1, // Mock or derived
        attentionCount: (classData.students || []).filter(s => s.is_urgent).length
    } : null;

    const students = (classData?.students || []).map(s => ({
        id: s.id,
        name: s.full_name || s.username,
        group: classData.groupYear?.group?.name,
        avatar: s.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.full_name || s.username)}&background=random`,
        completion: s.material_completion || 0,
        grade: s.assignment_avg > 0 ? `${Math.round(s.assignment_avg)}%` : 'No grade',
        assmScore: Math.round(s.assessment_avg || 0),
        isUrgent: s.is_urgent,
        srlBadge: false // Can be hooked up to plans later
    }));

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headerSection = classDetails ? (
        <section className="mb-stack-lg mt-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{classDetails.title}</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">{classDetails.year} • {classDetails.grade}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-label-md text-label-md text-white bg-primary-container px-3 py-1 rounded-full">{classDetails.studentsCount} Students</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">{classDetails.groupsCount} Groups</span>
                </div>
            </div>
        </section>
    ) : null;

    if (loading) {
        return (
            <DashboardTemplate role="teacher" activeTab="classes" title="Loading..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12 text-on-surface-variant">Loading class details...</div>
            </DashboardTemplate>
        );
    }

    if (!classData) {
        return (
            <DashboardTemplate role="teacher" activeTab="classes" title="Class Not Found" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12 text-on-surface-variant">Class not found.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="classes"
            title="Class Detail"
            showBack={true}
            onBack={() => window.location.href = '/teacher/classes'}
            headerSection={headerSection}
        >
            <Head title="Class Detail | Diajar LMS" />

            <div className="max-w-[1280px] mx-auto pb-12 w-full">
                {classDetails.attentionCount > 0 && (
                    <AttentionSummary count={classDetails.attentionCount} message="Low completion or missing tasks" />
                )}

                <StudentListFilter onSearch={setSearchQuery} />

                <section className="space-y-stack-sm pb-10 mt-4">
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
                        <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">
                            No students found.
                        </div>
                    )}
                </section>
            </div>
        </DashboardTemplate>
    );
}
