import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';

// Feature Components
import ClassSidebar from '@/Components/features/teacher-classes/ClassSidebar';
import AttentionSummary from '@/Components/features/teacher-classes/AttentionSummary';
import StudentListFilter from '@/Components/features/teacher-classes/StudentListFilter';
import StudentListCard from '@/Components/features/teacher-classes/StudentListCard';

// Mock Data
const classDetails = {
    id: 1,
    title: 'Biology - Class 11A',
    year: 'AY 2023/2024',
    grade: 'Grade 11',
    studentsCount: 32,
    groupsCount: 4,
    attentionCount: 5
};

const students = [
    {
        id: 1,
        name: 'Alex Johnson',
        group: 'Group A',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjpP9dqbuOL5jGI8ujVK1i0ZnWvz8NUxe9O-zibW1hajSxj_vlPvZ2HWOizC3EDRohhyRYopoxrHVr0Fa1Hh7GrvleCANlhU-Eao53TFlOMWhWjfXmHak50jMhKVMGMa3I_MLp9h6fjK3H6rJWLKPHJ1J8Mjh0h2cQjVuWQYQbB7G2O6u4Gbx-PIZ3YUUBwCdqfIhrAXPjM5O_9EcVE6eYdzsnvzKdlCFh-ibuqSKzURpB4Vgh-F8Kf4i-6srTUle1DDcBN4LDtPQ',
        completion: 85,
        grade: 'A-',
        assmScore: 92,
        isUrgent: false,
        srlBadge: true
    },
    {
        id: 2,
        name: 'Maria Garcia',
        group: 'Group B',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWkCKGB6nKeGhCRg7V34OJIQxaF9QIMG5OMJ-qlOcOx9fcC_uHPRQYbyBISSBi11uA3hP3z5lg7S-KNcP9OBSa739Qz7wiu2E3sSR5jyOiyHQ3MGOg26-mZ9lK2wpPhxvpUtdLCP-Gw1FESnJC6THqs6xozBJxJ7TmxrwrFQ0Pi3o24niY7eg8N90D76h3aa771UA-Q_gM2SQ8aXBV0jk_oi7WZz2e0-idfBjn4Z4ypf8kR6NtORSH5jhj40Ka0NQTzOStLw9Ec2Q',
        completion: 40,
        grade: 'B',
        assmScore: 75,
        isUrgent: false,
        srlBadge: false
    },
    {
        id: 3,
        name: 'Liam Chen',
        group: 'Group A',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIT-d3DjI01J1GK6kaYYPlbcLeDEwmstL8d8OxnrIJLpoZ-xNtIGe5SJSopAYzKADDRUm6ediP_0eBnfWIGkU8FSIWRkpvpwib7d54tgaZ1CcMhBPombTB8d-AHiMyCJSv5iRiQog8B4PF6566SGMnlWbkvi4zU_ii-MTSyeRw2kZTqcjOlmGG5dv5yCjdyDG5L9r4TNr6g82AdoMutfeIU2UeFGyD0qsKCcnpKzRlmoJKliG65TNpWNPrW4dJEA8tIabiKo_UzSs',
        completion: 95,
        grade: 'A',
        assmScore: 98,
        isUrgent: false,
        srlBadge: true
    },
    {
        id: 4,
        name: 'Sarah Miller',
        group: 'Group C',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIN6QGWlc7g1iK5-DtHwqXFxYnqPXVK5miIuvXAXKnWCN2wvyAUcYoyXxtCVEsiEGp15gO4bDaTnNpaPmpQY8aykmBsARyihC1BPlBOSuphDlN1me4MIsoK28s4laIs_u4GczqdZ74Vd9ux1F2Dh04ZXM-e8Wv8KRs8H5sgWwnCHrYhD1Qt2-u0W56dqQp2Jf4LzYuoBp1KqguS_A0YiiHRPxsscyTaxeFlaHXIUUP_DgmEPhTZpL5wTXlDwOle1ywUHT6MSqfZ24',
        completion: 12,
        grade: 'Missing Subs',
        assmScore: 0,
        isUrgent: true,
        srlBadge: false
    },
    {
        id: 5,
        name: 'James Wilson',
        group: 'Group D',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMkaU_P70xL_9SFU_0ZCJ-QJM-D2j007O9ctgAnh8sAXPVXJ6tUjRoAA42TKLTU7ntjAhi-qdNhKfeF1Xm8-FecdlAfP2Ua92tq2H_XIle_Vvgk5Oj2or55_TM2ZDGLhtX7Qpt-KJOidIeSlyIwnvCqHXrcJ2pAFMGNuVJiDOay1x16s2ndauwHcJRSVvxRdxuJZ0OytfsvD7F6bP4C34UKxIBYUrpjGBmHsSmGX44Tdh7_1Vrz95HtmFk93b9vZyqSrwwKS7VEtY',
        completion: 78,
        grade: 'B+',
        assmScore: 80,
        isUrgent: false,
        srlBadge: true
    }
];

export default function Show({ classId }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headerSection = (
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
    );

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="classes"
            title="Class Detail"
            showBack={true}
            onBack={() => window.history.back()}
            headerSection={headerSection}
        >
            <Head title="Class Detail | Diajar LMS" />

            <div className="max-w-[1280px] mx-auto pb-12 w-full">
                <AttentionSummary count={classDetails.attentionCount} message="Low completion or missing tasks" />

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
                        <div className="text-center py-8 text-on-surface-variant">
                            No students found.
                        </div>
                    )}
                </section>
            </div>
        </DashboardTemplate>
    );
}
