import React from 'react';
import { Head, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import QuestionPreviewCard from '@/Components/features/teacher-questions/QuestionPreviewCard';
import QuestionMetadataPanel from '@/Components/features/teacher-questions/QuestionMetadataPanel';
import useApiGet from '@/hooks/useApiGet';

export default function Show({ questionId }) {
    const { data: question, loading } = useApiGet(`/questions/${questionId}`);

    const handleBack = () => {
        router.visit(route('teacher.assessments.questions.index'));
    };

    const handleEdit = () => {
        router.visit(route('teacher.assessments.questions.edit', { questionId: questionId || 1 }));
    };

    if (loading) {
        return (
            <div className="bg-background text-on-background min-h-screen pb-24 pt-20 flex justify-center items-center">
                <div className="text-on-surface-variant">Memuat soal...</div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="bg-background text-on-background min-h-screen pb-24 pt-20 flex justify-center items-center flex-col gap-4">
                <div className="text-on-surface-variant">Soal tidak ditemukan.</div>
                <button onClick={handleBack} className="text-primary hover:underline">Kembali</button>
            </div>
        );
    }

    const options = (question.options || []).map(opt => ({
        text: opt.option,
        isCorrect: Boolean(opt.is_correct)
    }));

    return (
        <div className="bg-background text-on-background min-h-screen pb-24">
            <Head title={`Detail Soal ${questionId || ''}`} />

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
                        <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Detail Soal</h1>
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
                        Level {question.levels}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-surface-container-high text-on-surface-variant font-label-md text-label-md rounded-full">
                        {question.score} poin
                    </span>
                    {question.subject?.subject_name && (
                        <span className="inline-flex items-center px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-md text-label-md rounded-full">
                            {question.subject.subject_name}
                        </span>
                    )}
                </section>

                <QuestionPreviewCard 
                    questionText={question.question}
                    options={options}
                />

                <QuestionMetadataPanel 
                    explanation={question.explanation || 'Tidak ada penjelasan yang diberikan.'}
                    tags={(question.tags || []).map(t => t.name)}
                    usageCount={question.usage_count || 0}
                />



            </main>
        </div>
    );
}
