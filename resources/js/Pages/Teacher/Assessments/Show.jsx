import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssessmentStatsBento from '@/Components/features/teacher-assessments/AssessmentStatsBento';
import HorizontalGradeChart from '@/Components/features/teacher-assessments/HorizontalGradeChart';
import HardestQuestionsList from '@/Components/features/teacher-assessments/HardestQuestionsList';
import StudentAttemptsTable from '@/Components/features/teacher-assessments/StudentAttemptsTable';

export default function Show({ assessmentId }) {
    
    const customTitleSection = (
        <div className="flex items-center gap-4">
            <button 
                onClick={() => router.visit(route('teacher.assessments.index'))}
                className="text-primary hover:bg-surface-container-highest transition-colors rounded-full p-2 active:scale-95"
            >
                <Icon name="arrow_back" />
            </button>
            <h1 className="font-headline-md text-headline-md text-primary">Assessment Detail</h1>
        </div>
    );

    const actions = (
        <button className="text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full p-2 active:scale-95">
            <Icon name="more_vert" />
        </button>
    );

    const chartData = [
        { label: '90-100 (A)', count: 4, countLabel: '4 students', colorClass: 'bg-secondary', percentage: 25 },
        { label: '80-89 (B)', count: 12, countLabel: '12 students', colorClass: 'bg-primary', percentage: 75 },
        { label: '70-79 (C)', count: 8, countLabel: '8 students', colorClass: 'bg-primary-fixed-dim', percentage: 50 },
        { label: '<70 (F)', count: 4, countLabel: '4 students', colorClass: 'bg-error', percentage: 25 },
    ];

    const hardestQuestions = [
        { id: 12, text: 'Explain the process of meiosis and its role in genetic variation...', difficulty: 'Hard', difficultyColorClass: 'text-error bg-error-container/20', avatarColorClass: 'bg-error-container text-on-error-container', correctPercentage: 42 },
        { id: 5, text: 'What are the three components of a DNA nucleotide?', difficulty: 'Medium', difficultyColorClass: 'text-tertiary bg-tertiary-fixed/20', avatarColorClass: 'bg-tertiary-fixed text-on-tertiary-fixed', correctPercentage: 55 },
        { id: 28, text: 'Calculate the probability of a recessive phenotype in a...', difficulty: 'Medium', difficultyColorClass: 'text-tertiary bg-tertiary-fixed/20', avatarColorClass: 'bg-tertiary-fixed text-on-tertiary-fixed', correctPercentage: 61 },
    ];

    const studentAttempts = [
        { studentId: 1, name: 'Alex Johnson', initials: 'AJ', status: 'Submitted', timeText: '38m', score: 92, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjSi4708V7IyLPvWfvjFJ4d2jtbcGjR7ovw6d5ItcNY2saP0w7qq6Ozc1WCV_xcts7zcox3B4lmACHeFSoBP67elKnec6KUuQIvPMARc05GOgSk1VREpjmayfY635Omz-x5lEFwywLvN1b0DxuQWUs_qGufSvRstO-Ijhd4stI0ydA56aOIWSvltyhB98YRTv7cZX0DwCVbUsCDcUd-rUmN1-lIN_cg3GpGkLeYnAKFJLg5TPSc-WKCU3oHPInvobi7G7RZ2ZBe08' },
        { studentId: 2, name: 'Maria Garcia', initials: 'MG', status: 'Submitted', timeText: '42m', score: 84, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9qQVNVjLOScMGHstN3UtxN0hJuM7OtLvIQBkgu2Hq0DzdYJm2iaCxJnnTNwQdyOyT_P1cNofdLdvdtUEPnQATis77KeuBo2fHs_iuJqthJyfxbGUkZqlbeGPzjfq5qXXHNR3nm1SjPtvY1YEH5ZiAUAQhakT0S8UrGnpIPUDXZyih5SPF-xM3idCwDKyUxSQNINhIb_4KF358YF32LeshkWTvZGKUoq2ZZ2ZGhL_V0r2pV143KTpv7ZsmUTNG0zqVsPXqwGg_ixI' },
        { studentId: 3, name: 'Samuel Kim', initials: 'SK', status: 'In Progress', timeText: '12m left', score: null, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh5triePwbQ4Z8yYfmzgvcqutrhP9LoJV4XCqYg0eAN6zEs7jUzdOf9_agykkumRcJsH4QVJhW8x_i42m7nuJEGvK4NGgctOZpkL82SyjWqDzGQtOenz6Dvcr96ciJpVRPxjXjtADUxIoCsqEaA9Hhej1tvCR0-xvRliNnnJ3TEOdcwjNwsy0dtDFM9Syl6XyZYDKq986eKgLmJDiHOsBa8xDACVeth_6t52JstdJLwEkYWyfAMm-RXscje86ZlTVUIuDx-AXMXRo' },
    ];

    return (
        <DashboardTemplate role="teacher" customTitle={customTitleSection} actions={actions}>
            <Head title={`Assessment ${assessmentId || 'Details'}`} />

            <div className="space-y-stack-lg max-w-7xl mx-auto pb-24 pt-4">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
                    <div>
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Biology Midterm Quiz</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">Chapter 3: Genetics</span>
                            <span className="text-on-surface-variant font-label-md text-label-md">• 45 min</span>
                            <span className="text-on-surface-variant font-label-md text-label-md">• 30 Questions</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => router.visit(route('teacher.assessments.edit', { assessmentId: assessmentId || 1 }))}
                        className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-md"
                    >
                        <Icon name="edit" filled />
                        Edit Assessment
                    </button>
                </section>

                <AssessmentStatsBento 
                    attemptsCompleted={28}
                    attemptsTotal={32}
                    avgScore={78}
                    avgChange={3}
                    high={96}
                    low={42}
                    passRate={85}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    <HorizontalGradeChart data={chartData} />
                    <HardestQuestionsList questions={hardestQuestions} />
                </div>

                <StudentAttemptsTable assessmentId={assessmentId || 1} attempts={studentAttempts} />

            </div>
        </DashboardTemplate>
    );
}
