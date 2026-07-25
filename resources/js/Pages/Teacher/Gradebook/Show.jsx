import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import GradebookOverview from '@/Components/features/teacher-gradebook/GradebookOverview';
import GradebookTable from '@/Components/features/teacher-gradebook/GradebookTable';
import useApiGet from '@/hooks/useApiGet';

export default function Show({ classId }) {
    const [sort, setSort] = useState('name');
    const [filter, setFilter] = useState('all');

    const { data, loading } = useApiGet(`/gradebook/${classId}?sort=${sort}&column_filter=${filter}`);

    const handleBack = () => {
        router.visit(route('teacher.classes.show', { id: classId || 1 }));
    };

    if (loading) {
        return (
            <div className="bg-[#FAFAFA] text-on-surface min-h-screen pb-24 pt-20 flex justify-center">
                <div className="text-on-surface-variant">Memuat buku nilai...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-[#FAFAFA] text-on-surface min-h-screen pb-24 pt-20 flex justify-center">
                <div className="text-on-surface-variant">Buku nilai tidak ditemukan.</div>
            </div>
        );
    }

    // Adapt backend data to frontend components
    const mappedStudents = data.students.map(s => {
        const studentObj = {
            name: s.name,
            avatar: null,
            final: s.final_grade
        };
        // Flatten grades into student object based on column keys
        if (s.grades) {
            Object.keys(s.grades).forEach(k => {
                studentObj[k] = s.grades[k] !== null ? s.grades[k] : 'Hilang';
            });
        }
        return studentObj;
    });

    const mappedColumns = data.columns.map(c => ({
        key: c.key,
        label: c.label
    }));

    return (
        <div className="bg-[#FAFAFA] text-on-surface min-h-screen pb-24">
            <Head title="Buku Nilai Kelas | LMS Diajar" />

            {/* Top App Bar */}
            <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile h-16 bg-surface shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="hover:bg-surface-container-low transition-colors active:scale-95 duration-100 p-2 rounded-full"
                    >
                        <Icon name="arrow_back" className="text-primary" />
                    </button>
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Buku Nilai Kelas</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="hover:bg-surface-container-low transition-colors active:scale-95 duration-100 p-2 rounded-full">
                        <Icon name="more_vert" className="text-primary" />
                    </button>
                </div>
            </header>

            <main className="mt-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-stack-lg">
                    <h2 className="font-headline-lg text-headline-lg text-on-background">Nilai Kelas</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Bobot: Tugas ({data.grading_scheme?.assignment_weight || 0}%), Penilaian ({data.grading_scheme?.assessment_weight || 0}%)</p>
                </div>

                <GradebookOverview 
                    assignmentWeight={data.grading_scheme?.assignment_weight || 40}
                    assessmentWeight={data.grading_scheme?.assessment_weight || 60}
                />

                {/* Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-gutter mb-stack-md">
                    <div className="flex gap-stack-sm">
                        <button 
                            onClick={() => setFilter(filter === 'all' ? 'assignments' : (filter === 'assignments' ? 'assessments' : 'all'))}
                            className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors"
                        >
                            <Icon name="filter_list" />
                            <span className="capitalize">Filter: {filter === 'all' ? 'Semua' : (filter === 'assignments' ? 'Tugas' : 'Penilaian')} Kolom</span>
                        </button>
                        <button 
                            onClick={() => setSort(sort === 'name' ? 'grade_desc' : (sort === 'grade_desc' ? 'grade_asc' : 'name'))}
                            className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors"
                        >
                            <Icon name="sort_by_alpha" />
                            <span>Urutkan: {sort === 'name' ? 'Nama A-Z' : (sort === 'grade_desc' ? 'Nilai Tertinggi' : 'Nilai Terendah')}</span>
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                            <Icon name="download" />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                            <Icon name="print" />
                        </button>
                    </div>
                </div>

                <GradebookTable students={mappedStudents} columns={mappedColumns} averages={{}} />
            </main>
        </div>
    );
}
