import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssignmentRubric from '@/Components/features/student-assignments/AssignmentRubric';
import TeacherFeedback from '@/Components/features/student-assignments/TeacherFeedback';
import SubmissionArea from '@/Components/features/student-assignments/SubmissionArea';

// Mock Data
const assignmentDetails = {
    id: 1,
    subject: 'Biology',
    status: 'In Progress',
    title: 'Genetics Lab Report',
    dueDate: 'Due Oct 27, 4:00 PM',
    description: 'Analyze the phenotypic ratios of fruit fly offspring from our recent Mendelian cross experiment. Your report should include a detailed methodology section, Chi-square analysis results, and a critical discussion of any observed anomalies. Ensure all tables are properly formatted and references follow APA 7th edition standards.',
    rubrics: [
        { title: 'Data Accuracy', description: 'Precision and verification of lab results', weight: 40 },
        { title: 'Analysis', description: 'Statistical depth and critical thinking', weight: 40 },
        { title: 'Formatting', description: 'Structure, citations, and clarity', weight: 20 }
    ],
    feedback: "Great work on the preliminary data analysis section! Remember to double-check the heterozygous ratios before final submission.",
    isFeedbackPending: true
};

export default function Show({ assignmentId = assignmentDetails.id }) {
    return (
        <DashboardTemplate 
            role="student"
            activeTab="tasks"
            title="Assignments"
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title="Assignment View | Diajar LMS" />

            <div className="px-margin-mobile mt-stack-md space-y-gutter max-w-2xl mx-auto pb-32">
                
                {/* Assignment Header */}
                <section className="space-y-stack-sm">
                    <div className="flex items-center gap-2">
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                            {assignmentDetails.subject}
                        </span>
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                            <Icon name="pending_actions" className="text-[14px]" />
                            {assignmentDetails.status}
                        </span>
                    </div>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                        {assignmentDetails.title}
                    </h2>
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                        <Icon name="event" className="text-[18px]" />
                        <span>{assignmentDetails.dueDate}</span>
                    </div>
                </section>

                {/* Assignment Details */}
                <section className="bg-white/80 backdrop-blur-[8px] border border-slate-200/80 rounded-xl p-5 space-y-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Task Description</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {assignmentDetails.description}
                    </p>
                </section>

                {/* Assessment Rubric */}
                <AssignmentRubric rubrics={assignmentDetails.rubrics} />

                {/* Grading & Feedback */}
                <TeacherFeedback 
                    feedback={assignmentDetails.feedback} 
                    isPending={assignmentDetails.isFeedbackPending} 
                />

                {/* Submission Section */}
                <SubmissionArea 
                    onUpload={() => console.log('Upload clicked')}
                    onAddUrl={() => console.log('Add URL clicked')}
                    onSubmit={() => alert('Assignment submitted!')}
                />

                {/* Reflection CTA */}
                <button className="w-full flex items-center justify-center gap-3 py-4 border border-outline-variant bg-surface-container-lowest rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95 mb-8">
                    <Icon name="psychology" />
                    Fill Reflection
                </button>
            </div>
        </DashboardTemplate>
    );
}
