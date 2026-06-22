import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';

// Feature Components
import ClassFilters from '@/Components/features/teacher-classes/ClassFilters';
import ActiveClassCard from '@/Components/features/teacher-classes/ActiveClassCard';
import ArchivedClassCard from '@/Components/features/teacher-classes/ArchivedClassCard';

// Mock Data
const activeClass = {
    id: 1,
    subject: 'Biology',
    subjectIcon: 'science',
    title: 'Biology - Class 11A',
    grade: 'Grade 11',
    studentsCount: 32,
    year: 'AY 2023/2024',
    additionalStudents: 29
};

const archivedClasses = [
    { id: 2, title: 'Biology - Class 10C', year: '2022/2023', studentsCount: 28 },
    { id: 3, title: 'Biology - Class 10B', year: '2021/2022', studentsCount: 30 }
];

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');

    const headerSection = (
        <section className="space-y-1 mb-6 mt-4">
            <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Classes</h1>
            <p className="text-body-md font-body-md text-on-surface-variant">Academic Year 2023/2024</p>
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

                <ActiveClassCard {...activeClass} />

                <section className="space-y-stack-sm pb-8">
                    <h2 className="text-label-sm font-label-sm tracking-wider text-outline uppercase px-1">Archived Classes</h2>
                    <div className="space-y-stack-md">
                        {archivedClasses.map((ac) => (
                            <ArchivedClassCard key={ac.id} {...ac} />
                        ))}
                    </div>
                </section>
            </div>
        </DashboardTemplate>
    );
}
