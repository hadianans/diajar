import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentFilters from '@/Components/features/student-assignments/AssignmentFilters';
import AssignmentCard from '@/Components/features/student-assignments/AssignmentCard';
import useApiGet from '@/hooks/useApiGet';

export default function Index() {
    const { data: assignmentsData, loading } = useApiGet('/assignments');
    const [searchQuery, setSearchQuery] = useState('');

    const mappedAssignments = (assignmentsData || []).map(item => ({
        id: item.id,
        subject: item.classModel?.subject?.subject_name || item.classModel?.subject?.name || 'Mata Pelajaran',
        subjectIcon: 'book', // Default icon, could map based on subject name
        title: item.title,
        status: item.display_status === 'not_submitted' ? 'Akan Dikerjakan' : (item.display_status === 'graded' ? 'Dinilai' : 'Dikumpulkan'),
        dueDate: item.due_date ? `Tenggat: ${new Date(item.due_date).toLocaleString('id-ID', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}` : 'Tidak ada tenggat waktu',
        progress: item.display_status === 'graded' ? 100 : (item.display_status === 'submitted' ? 100 : 0),
        typeTags: item.tags?.map(t => ({ label: t.name, type: 'primary' })) || [],
        originalId: item.id
    }));

    const filteredAssignments = mappedAssignments.filter(assignment => 
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headerSection = (
        <section className="mt-2 mb-6">
            <p className="font-body-md text-body-md text-on-surface-variant">Lacak dan kelola tugas Anda di semua mata pelajaran.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            activeTab="tasks"
            title="Tugas"
            headerSection={headerSection}
            showBack={false}
        >
            <Head title="Tugas - LMS Diajar" />

            <div className="max-w-2xl mx-auto flex flex-col pb-12 mt-4">
                <AssignmentFilters onSearch={setSearchQuery} />
                
                <div className="flex flex-col gap-4 mt-6">
                    {loading ? (
                        <div className="text-center py-8 text-on-surface-variant">Memuat tugas...</div>
                    ) : filteredAssignments.length > 0 ? (
                        filteredAssignments.map(assignment => (
                            <div key={assignment.id}>
                                <AssignmentCard 
                                    {...assignment} 
                                    onAddToList={() => console.log('Added to list', assignment.id)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">
                            Tidak ada tugas yang ditemukan.
                        </div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
