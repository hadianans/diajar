import React from 'react';
import { Head, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import QuestionPreviewCard from '@/Components/features/teacher-questions/QuestionPreviewCard';
import QuestionMetadataPanel from '@/Components/features/teacher-questions/QuestionMetadataPanel';

export default function Show({ questionId }) {
    const handleBack = () => {
        router.visit(route('teacher.assessments.questions.index'));
    };

    const handleEdit = () => {
        router.visit(route('teacher.assessments.questions.edit', { questionId: questionId || 1 }));
    };

    const options = [
        { text: 'Protein synthesis', isCorrect: false },
        { text: 'Energy production (ATP)', isCorrect: true },
        { text: 'Waste removal', isCorrect: false },
        { text: 'Genetic storage', isCorrect: false },
    ];

    return (
        <div className="bg-background text-on-background min-h-screen pb-24">
            <Head title={`Question Detail ${questionId || ''}`} />

            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
                <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleBack}
                            className="active:scale-95 duration-150 ease-in-out hover:bg-surface-container-low p-2 rounded-full"
                        >
                            <Icon name="arrow_back" className="text-primary" />
                        </button>
                        <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Question Detail</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleEdit}
                            className="active:scale-95 duration-150 ease-in-out hover:bg-surface-container-low p-2 rounded-full"
                        >
                            <Icon name="edit" className="text-primary" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 px-margin-mobile max-w-2xl mx-auto space-y-stack-lg">
                
                {/* Question Header Section */}
                <section className="flex flex-wrap gap-2 pt-4">
                    <span className="inline-flex items-center px-3 py-1 bg-surface-container text-primary font-label-md text-label-md rounded-full border border-primary/10">
                        Level 1: Understand
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-surface-container-high text-on-surface-variant font-label-md text-label-md rounded-full">
                        5 pts
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-md text-label-md rounded-full">
                        Biology
                    </span>
                </section>

                <QuestionPreviewCard 
                    questionText="What is the primary function of mitochondria?"
                    options={options}
                />

                <QuestionMetadataPanel 
                    explanation="Mitochondria are known as the powerhouse of the cell, converting oxygen and nutrients into adenosine triphosphate (ATP), which serves as the main energy currency for cellular functions."
                    tags={['CellBiology', 'Organelles', 'Mitochondria']}
                    usageCount={3}
                />

                {/* Decorative Illustration */}
                <div className="relative h-48 w-full rounded-xl overflow-hidden mt-stack-lg border border-outline-variant/30 group">
                    <img 
                        className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                        alt="Mitochondria cell organelle" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAys9Q3-b7hFufqYfchektPOs-su7QnFQH7ITsdGmE7Nq9RxifN_fi5rmcCEf40h6IwB2rEgCx4II1u7E4gryrSiuvej6O6hJaLtLM7wrRt5x9WKN1b2zhJe5DfhFI86nl2a5PCXFIiPlJ5btB1g_wFPfA2Gg97gQbD2EaZLQXUsw36SBxLc07OChyKrCSWxYYZaw3yqhD2ho_h6ghLT_w_QUGiRbpm3lFqpaGHCVronWQiGGEutWKMPxSpre8G84ID-cB189LOrrg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                </div>

            </main>
        </div>
    );
}
