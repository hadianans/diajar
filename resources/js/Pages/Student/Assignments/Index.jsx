import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentFilters from '@/Components/features/student-assignments/AssignmentFilters';
import AssignmentCard from '@/Components/features/student-assignments/AssignmentCard';

// Mock Data
const assignments = [
    {
        id: 1,
        subject: 'Biology',
        subjectIcon: 'biotech',
        title: 'Genetics Lab Report',
        status: 'Urgent',
        dueDate: 'Due Oct 27, 4:00 PM',
        typeTags: [
            { label: 'Lab', type: 'primary' },
            { label: 'To-do', type: 'default' }
        ]
    },
    {
        id: 2,
        subject: 'Mathematics',
        subjectIcon: 'calculate',
        title: 'Calculus Problem Set',
        status: 'In Progress',
        dueDate: 'Due Oct 30, 11:59 PM',
        progress: 33, // 1/3 completed
        typeTags: [
            { label: 'Homework', type: 'primary' },
            { label: 'Practice', type: 'default' }
        ]
    },
    {
        id: 3,
        subject: 'History',
        subjectIcon: 'history_edu',
        title: 'Renaissance Essay',
        status: 'To-do',
        dueDate: 'Due Nov 5, 2:00 PM',
        typeTags: [
            { label: 'Essay', type: 'primary' }
        ]
    }
];

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAssignments = assignments.filter(assignment => 
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
            role="student"
            activeTab="tasks"
            title="Assignments"
            headerSection={headerSection}
            showBack={false}
        >
            <Head title="Assignments - Diajar LMS" />

            <div className="max-w-2xl mx-auto flex flex-col pb-12">
                <AssignmentFilters onSearch={setSearchQuery} />
                
                <div className="flex flex-col gap-4">
                    {filteredAssignments.length > 0 ? (
                        filteredAssignments.map(assignment => (
                            <AssignmentCard 
                                key={assignment.id} 
                                {...assignment} 
                                onAddToList={() => console.log('Added to list', assignment.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-on-surface-variant">
                            No assignments found.
                        </div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
