import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssessmentFilters from '@/Components/features/student-assessments/AssessmentFilters';
import AssessmentCard from '@/Components/features/student-assessments/AssessmentCard';

// Mock Data
const assessmentsData = [
    {
        id: 1,
        subject: 'Biology',
        title: 'Biology Midterm Quiz',
        date: 'Oct 28, 10:00 AM',
        duration: '45 mins',
        questionsCount: 30,
        status: 'Upcoming',
        type: 'Exam',
        priority: 'High Priority'
    },
    {
        id: 2,
        subject: 'Mathematics',
        title: 'Calculus Unit 1 Test',
        date: 'Oct 30, 2:00 PM',
        duration: '60 mins',
        questionsCount: 20,
        status: 'In Progress',
        type: 'Quiz',
        progress: 45,
        progressText: '45% Completed • 9 questions left'
    },
    {
        id: 3,
        subject: 'History',
        title: 'History: Renaissance Quiz',
        date: 'Nov 5, 11:59 PM',
        duration: '30 mins',
        questionsCount: 15,
        status: 'Not Started',
        type: 'Practice'
    }
];

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAssessments = assessmentsData.filter(assessment => 
        assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        assessment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headerSection = (
        <section>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Assessments</h1>
            <p className="text-on-surface-variant text-body-md mt-1">Track and manage your quizzes and exams across all subjects.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            role="student"
            activeTab="tasks" // Assuming assessments fall under tasks
            title="Assessments"
            headerSection={headerSection}
        >
            <Head title="Assessments" />

            <div className="max-w-3xl mx-auto space-y-stack-lg">
                <AssessmentFilters onSearch={setSearchQuery} />
                
                <div className="space-y-gutter">
                    {filteredAssessments.length > 0 ? (
                        filteredAssessments.map(assessment => (
                            <AssessmentCard 
                                key={assessment.id} 
                                {...assessment} 
                                onAction={() => console.log('Bookmarked', assessment.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-on-surface-variant">
                            No assessments found.
                        </div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
