import React from 'react';
import { Head, router } from '@inertiajs/react';
import GradingWorkspaceLayout from '@/Components/shared/layout/GradingWorkspaceLayout';
import SubmissionViewer from '@/Components/features/teacher-assignments/SubmissionViewer';
import RubricGradingPanel from '@/Components/features/teacher-assignments/RubricGradingPanel';
import Icon from '@/Components/shared/ui/Icon';

export default function StudentShow({ assignmentId, studentId }) {
    
    const handleBack = () => {
        router.visit(route('teacher.assignments.show', { assignmentId: assignmentId || 1 }));
    };

    const headerCenter = (
        <div className="flex flex-col">
            <h1 className="text-headline-md font-headline-md font-bold text-primary">Alex Johnson</h1>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="text-label-sm font-label-sm text-on-surface-variant">Ungraded</span>
            </div>
        </div>
    );

    const headerRight = (
        <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-opacity-90 scale-95 active:bg-surface-container-high transition-all">
            Next
        </button>
    );

    const footerLeft = (
        <button className="flex flex-col items-center justify-center text-outline px-6 py-2 hover:opacity-90 scale-98 active:brightness-95 transition-all w-full md:w-auto">
            <Icon name="save" />
            <span className="text-label-md font-label-md">Save Draft</span>
        </button>
    );

    const footerRight = (
        <button className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-xl px-6 py-2 hover:opacity-90 scale-98 active:brightness-95 transition-all w-full md:w-auto">
            <Icon name="check_circle" filled />
            <span className="text-label-md font-label-md">Submit Grade</span>
        </button>
    );

    const rubricCriteria = [
        { 
            title: 'Scientific Accuracy', 
            weight: 40,
            selected: 'Proficient',
            selectedPts: 30,
            levels: [
                { title: 'Developing', pts: 10, description: 'Shows major conceptual misunderstandings or factual errors.' },
                { title: 'Proficient', pts: 30, description: 'Accurate scientific reasoning with minor inconsistencies.' },
                { title: 'Exemplary', pts: 40, description: 'Demonstrates deep mastery and precise scientific terminology.' },
            ]
        },
        { 
            title: 'Data Presentation', 
            weight: 30,
            selected: null,
            levels: [
                { title: 'Developing', pts: 5 },
                { title: 'Proficient', pts: 20 },
                { title: 'Exemplary', pts: 30 },
            ]
        },
        { 
            title: 'Critical Analysis', 
            weight: 30,
            selected: null,
            levels: [
                { title: 'Developing', pts: 5 },
                { title: 'Proficient', pts: 20 },
                { title: 'Exemplary', pts: 30 },
            ]
        }
    ];

    return (
        <GradingWorkspaceLayout 
            title="Grading: Alex Johnson"
            onBack={handleBack}
            headerCenter={headerCenter}
            headerRight={headerRight}
            footerLeft={footerLeft}
            footerRight={footerRight}
        >
            <SubmissionViewer 
                fileName="Genetics_Lab_Report_Alex_J.pdf" 
                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBhnbh7N6XTIFwGGSMe08ZZ0oecWuGVKDFjHTiRCWeduIxW2c3WQc3sI_rJp8snjlZ5GyhiwBVp8n-Xz7_XkSEXNYQy8Q0pn2UWd_C6MFNEWMupVZ9dMg0SrSqeqIb16y67Uk2wmYKXijXz_GTlucxjhW5Csp3I5C5vxbg-U6HMAupoFnkweG8KD_XV-lUMoHSxgbJEHyjPzdYOyNnNFlKIpKrQy-gDRtVX0Z9gf5NxrrMA4owi_C3zwzJWjTbm0t-_6iKx_HZGrqs"
            />
            
            <RubricGradingPanel criteria={rubricCriteria} />
            
        </GradingWorkspaceLayout>
    );
}
