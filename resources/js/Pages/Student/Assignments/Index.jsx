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
        subject: item.classModel?.subject?.subject_name || item.classModel?.subject?.name || 'Subject',
        subjectIcon: 'book', // Default icon, could map based on subject name
        title: item.title,
        status: item.display_status === 'not_submitted' ? 'To-do' : (item.display_status === 'graded' ? 'Graded' : 'Submitted'),
        dueDate: item.due_date ? `Due ${new Date(item.due_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}` : 'No due date',
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
            <p className="font-body-md text-body-md text-on-surface-variant">Track and manage your tasks across all subjects.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            activeTab="tasks"
            title="Assignments"
            headerSection={headerSection}
            showBack={false}
        >
            <Head title="Assignments - Diajar LMS" />

            <div className="max-w-2xl mx-auto flex flex-col pb-12 mt-4">
                <AssignmentFilters onSearch={setSearchQuery} />
                
                <div className="flex flex-col gap-4 mt-6">
                    {loading ? (
                        <div className="text-center py-8 text-on-surface-variant">Loading assignments...</div>
                    ) : filteredAssignments.length > 0 ? (
                        filteredAssignments.map(assignment => (
                            <div key={assignment.id} onClick={() => router.visit(`/student/assignments/${assignment.id}`)} className="cursor-pointer">
                                <AssignmentCard 
                                    {...assignment} 
                                    onAddToList={() => console.log('Added to list', assignment.id)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">
                            No assignments found.
                        </div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
