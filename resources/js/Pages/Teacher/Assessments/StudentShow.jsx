import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AssessmentReviewLayout from '@/Components/shared/layout/AssessmentReviewLayout';
import AssessmentHeroSummary from '@/Components/features/teacher-assessments/AssessmentHeroSummary';
import AnswerReviewCard from '@/Components/features/teacher-assessments/AnswerReviewCard';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function StudentShow({ assessmentId, studentId }) {
    const { data, loading } = useApiGet(`/assessments/${assessmentId}/attempts/${studentId}`);
    const [filter, setFilter] = useState('all'); // all, correct, incorrect

    const handleBack = () => {
        router.visit(route('teacher.assessments.show', { assessmentId: assessmentId || 1 }));
    };

    const handlePreviousStudent = () => {
        if (data?.prev_student_id) {
            router.visit(route('teacher.assessments.students.show', { assessmentId: assessmentId, studentId: data.prev_student_id }));
        }
    };

    const handleNextStudent = () => {
        if (data?.next_student_id) {
            router.visit(route('teacher.assessments.students.show', { assessmentId: assessmentId, studentId: data.next_student_id }));
        }
    };

    if (loading) {
        return (
            <AssessmentReviewLayout 
                title="Memuat Tinjauan..."
                onBack={handleBack}
                currentStudentIndex={1}
                totalStudents={1}
                studentAvatars={[]}
            >
                <div className="text-center py-12 text-on-surface-variant">Memuat upaya siswa...</div>
            </AssessmentReviewLayout>
        );
    }

    if (!data || !data.attempt) {
        return (
            <AssessmentReviewLayout 
                title="Tidak Ditemukan"
                onBack={handleBack}
                currentStudentIndex={1}
                totalStudents={1}
                studentAvatars={[]}
            >
                <div className="text-center py-12 text-on-surface-variant">Upaya siswa tidak ditemukan.</div>
            </AssessmentReviewLayout>
        );
    }

    const { attempt, answers, correct_count, incorrect_count, total_score, time_spent } = data;
    const studentName = attempt.student?.full_name || attempt.student?.username || 'Siswa Tidak Diketahui';

    const formatTimeSpent = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}d`;
    };

    const displayAnswers = answers.filter(a => {
        if (filter === 'correct') return a.is_correct === 1;
        if (filter === 'incorrect') return a.is_correct === 0;
        return true;
    });

    const studentAvatars = attempt.student?.picture ? [attempt.student.picture] : [];
    // We don't have exactly "current index out of total" from API natively, so we just pass simple mock values for those pagination dots
    const currentIndex = data.prev_student_id ? 2 : 1; 
    const totalCount = (data.prev_student_id ? 1 : 0) + 1 + (data.next_student_id ? 1 : 0);

    return (
        <AssessmentReviewLayout 
            title={`Tinjauan: ${studentName}`}
            onBack={handleBack}
            currentStudentIndex={currentIndex}
            totalStudents={totalCount}
            studentAvatars={studentAvatars}
            onPreviousStudent={handlePreviousStudent}
            onNextStudent={handleNextStudent}
        >
            <AssessmentHeroSummary 
                title={`Upaya Penilaian`} // We don't fetch assessment details in this payload, rely on context
                studentName={studentName}
                group="Kelas"
                submittedAt={attempt.completed_at ? moment(attempt.completed_at).format('MMM D, hh:mm A') : 'Sedang Berjalan'}
                questionsCount={answers.length}
                correctCount={correct_count}
                incorrectCount={incorrect_count}
                timeSpent={time_spent ? formatTimeSpent(time_spent) : '-'}
                scorePercentage={attempt.grade || 0}
                passStatus={attempt.status === 'graded' ? "GRADED" : (attempt.status === 'submitted' ? "SUBMITTED" : attempt.status.toUpperCase())}
                gradeLetter={null}
            />

            {/* Filters */}
            <div className="flex items-center gap-2 mb-stack-md overflow-x-auto pb-2 no-scrollbar">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors border ${filter === 'all' ? 'bg-primary-container text-on-primary-container border-transparent' : 'hover:bg-surface-container-high text-on-surface-variant border-outline-variant'}`}
                >
                    Semua ({answers.length})
                </button>
                <button 
                    onClick={() => setFilter('correct')}
                    className={`px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors border ${filter === 'correct' ? 'bg-primary-container text-on-primary-container border-transparent' : 'hover:bg-surface-container-high text-on-surface-variant border-outline-variant'}`}
                >
                    Benar ({correct_count})
                </button>
                <button 
                    onClick={() => setFilter('incorrect')}
                    className={`px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors border ${filter === 'incorrect' ? 'bg-primary-container text-on-primary-container border-transparent' : 'hover:bg-surface-container-high text-on-surface-variant border-outline-variant'}`}
                >
                    Salah ({incorrect_count})
                </button>
            </div>

            {/* Question List */}
            <div className="flex flex-col gap-stack-md">
                {displayAnswers.map((ans, idx) => {
                    const q = ans.class_question;
                    const correctOpt = q?.options?.find(o => o.is_correct);
                    
                    return (
                        <AnswerReviewCard 
                            key={ans.id}
                            questionNumber={idx + 1}
                            difficulty={`Level ${parseInt(q?.levels || 0) + 1}`}
                            isCorrect={Boolean(ans.is_correct)}
                            questionText={q?.question || 'Soal Tidak Diketahui'}
                            studentAnswer={ans.selected_option?.option || 'Tidak ada jawaban'}
                            correctAnswer={!ans.is_correct && correctOpt ? correctOpt.option : undefined}
                            explanation={q?.explanation}
                        />
                    );
                })}

                {/* Insight Panel (Mocked for now since not supported by backend) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-4">
                    <div className="bg-primary text-on-primary p-6 rounded-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="font-headline-md text-headline-md mb-2">Wawasan Guru</h4>
                            <p className="text-label-md font-label-md opacity-90 leading-relaxed mb-4">
                                {studentName} menunjukkan kemahiran yang kuat secara umum tetapi melewatkan beberapa soal. Meninjau jawaban yang salah disarankan.
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-surface-container-high p-6 rounded-xl flex items-center justify-between">
                        <div className="max-w-[60%]">
                            <h4 className="font-headline-md text-headline-md mb-1">Nilai</h4>
                            <p className="text-label-sm font-label-sm text-on-surface-variant">
                                Nilai akhir yang tercatat untuk upaya ini.
                            </p>
                        </div>
                        <div className="w-24 h-24 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-inner text-center">
                            <span className="text-headline-md font-headline-md text-primary">{attempt.grade || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

        </AssessmentReviewLayout>
    );
}
