import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import QuestionFilters from '@/Components/features/teacher-questions/QuestionFilters';
import QuestionCard from '@/Components/features/teacher-questions/QuestionCard';

export default function Index() {
    const handleCreate = () => {
        router.visit(route('teacher.assessments.questions.create'));
    };

    const customTitleSection = (
        <div>
            <h2 className="font-headline-md text-headline-md font-bold text-primary">Question Bank</h2>
            <span className="text-xs text-on-surface-variant hidden md:block mt-1">48 questions available</span>
        </div>
    );

    const actions = (
        <button 
            onClick={handleCreate}
            className="bg-primary-container text-on-primary-container hover:bg-primary transition-colors px-6 py-2 rounded-full font-label-md text-label-md shadow-sm active:scale-95 flex items-center gap-2"
        >
            <Icon name="add" className="text-sm" />
            Create Question
        </button>
    );

    const questions = [
        {
            id: 1,
            level: 'Level 1: Understand',
            levelClass: 'bg-green-100 text-green-700',
            levelColorClass: 'bg-green-500',
            points: 5,
            title: 'What is the primary function of mitochondria?',
            tags: ['Cell Biology']
        },
        {
            id: 2,
            level: 'Level 3: Analyze',
            levelClass: 'bg-orange-100 text-orange-700',
            levelColorClass: 'bg-orange-500',
            points: 15,
            title: 'Explain the process of DNA replication in prokaryotic cells.',
            tags: ['Genetics', 'DNA']
        },
        {
            id: 3,
            level: 'Level 2: Apply',
            levelClass: 'bg-yellow-100 text-yellow-700',
            levelColorClass: 'bg-yellow-500',
            points: 10,
            title: 'Identify the stage of mitosis where chromosomes align at the cell equator.',
            tags: ['Mitosis', 'Cell Biology']
        },
        {
            id: 4,
            level: 'Level 4: Evaluate',
            levelClass: 'bg-purple-100 text-purple-700',
            levelColorClass: 'bg-purple-500',
            points: 20,
            title: 'Compare and contrast eukaryotic and prokaryotic cells.',
            tags: ['Cell Biology']
        }
    ];

    return (
        <DashboardTemplate role="teacher" customTitle={customTitleSection} actions={actions}>
            <Head title="Question Bank" />
            
            <div className="max-w-6xl mx-auto w-full pb-20 md:pb-0">
                <QuestionFilters />

                {/* List Metadata & Sorting */}
                <div className="flex items-center justify-between mb-stack-md">
                    <p className="text-body-md text-on-surface-variant">Showing <span className="font-bold text-on-surface">48</span> of 48 questions</p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-outline">Sort by:</span>
                        <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-outline-variant hover:bg-surface transition-colors font-label-md text-label-md">
                            Newest First
                            <Icon name="expand_more" className="text-sm" />
                        </button>
                    </div>
                </div>

                {/* Question Cards Container */}
                <div className="grid grid-cols-1 gap-4">
                    {questions.map((q) => (
                        <QuestionCard key={q.id} {...q} />
                    ))}
                </div>
            </div>
        </DashboardTemplate>
    );
}
