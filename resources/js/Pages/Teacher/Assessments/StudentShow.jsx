import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AssessmentReviewLayout from '@/Components/shared/layout/AssessmentReviewLayout';
import AssessmentHeroSummary from '@/Components/features/teacher-assessments/AssessmentHeroSummary';
import AnswerReviewCard from '@/Components/features/teacher-assessments/AnswerReviewCard';

export default function StudentShow({ assessmentId, studentId }) {
    const [currentStudentIndex, setCurrentStudentIndex] = useState(14);
    
    const handleBack = () => {
        router.visit(route('teacher.assessments.show', { assessmentId: assessmentId || 1 }));
    };

    const studentAvatars = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBXadAsgb4pNmoC570BxBsjMqHQ6uOnyIy5jO161ZAV1TsemzaKYb802hnX_FvfZYEBPK0lBMVcdrDfnaRCEovIMHIjH7vsBMJLL_fmvRVVjj2dyY34VBA_oOYthgsHqg6mAzQAG4qZHh5aIPrSst6lUZ0QYBEJU4fYM451EVvt2Ji48wFKiDk1fUrk0SLaStYTu0MGPyFGBf8FuT3inhJU8I-J3Du9yh5OB048yj5mlaXv9K61JMb2jaZECCLWu9i9oSwoNnnDaUw',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAXt2-qUtnuyopdziJNkWiRRdKm2aGtpRV9QgJFSHAvaKL23XeWwJ3OZSNwAMTyGr8A66SU3BaXmYahlu8k8qzTkaOnflhVTU5_pMi4b_2PBDTlsPb7o0EZbYGMSMYUMp1BpM3ub3iBpMzh8jF9BpBQXAO4WtRbuAxiUobghENEq6i6bu9JKnZ2FD7TznACyKkBKfyjbLuI8AEdugTrT5WUMEeAVgnHZoqchYIbHDSYj-jvSxZrErK_fesMPnz3jCLOntA0uhCZn1c'
    ];

    return (
        <AssessmentReviewLayout 
            title="Assessment Review"
            onBack={handleBack}
            currentStudentIndex={currentStudentIndex}
            totalStudents={28}
            studentAvatars={studentAvatars}
            onPreviousStudent={() => setCurrentStudentIndex(Math.max(1, currentStudentIndex - 1))}
            onNextStudent={() => setCurrentStudentIndex(Math.min(28, currentStudentIndex + 1))}
        >
            <AssessmentHeroSummary 
                title="Biology Midterm Quiz"
                studentName="Alex Johnson"
                group="Group A"
                submittedAt="Oct 25, 10:30 AM"
                questionsCount={30}
                correctCount={24}
                incorrectCount={6}
                timeSpent="42m 15s"
                scorePercentage={80}
                passStatus="PASS"
                gradeLetter="B"
            />

            {/* Filters */}
            <div className="flex items-center gap-2 mb-stack-md overflow-x-auto pb-2 no-scrollbar">
                <button className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md whitespace-nowrap">All (30)</button>
                <button className="px-6 py-2 rounded-full hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md whitespace-nowrap transition-colors border border-outline-variant">Correct (24)</button>
                <button className="px-6 py-2 rounded-full hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md whitespace-nowrap transition-colors border border-outline-variant">Incorrect (6)</button>
            </div>

            {/* Question List */}
            <div className="flex flex-col gap-stack-md">
                <AnswerReviewCard 
                    questionNumber={1}
                    difficulty="Medium"
                    isCorrect={true}
                    questionText="What is the primary function of mitochondria?"
                    studentAnswer="Energy production (ATP)"
                    explanation="Mitochondria are known as the powerhouse of the cell, converting oxygen and nutrients into ATP."
                />

                <AnswerReviewCard 
                    questionNumber={2}
                    difficulty="Hard"
                    isCorrect={false}
                    questionText="Identify the stage of mitosis where chromosomes align at the cell equator."
                    studentAnswer="Prophase"
                    correctAnswer="Metaphase"
                    explanation="During metaphase, spindle fibers align the chromosomes along the middle of the cell nucleus."
                />

                {/* Insight Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="bg-primary text-on-primary p-6 rounded-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="font-headline-md text-headline-md mb-2">Teacher's Insight</h4>
                            <p className="text-label-md font-label-md opacity-90 leading-relaxed mb-4">
                                Alex shows strong proficiency in basic cell structures but struggles with specific mitotic phases. Consider assigning the "Cell Division" refresher module.
                            </p>
                            <button className="bg-white text-primary px-4 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform">
                                Assign Refresher
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-surface-container-high p-6 rounded-xl flex items-center justify-between">
                        <div className="max-w-[60%]">
                            <h4 className="font-headline-md text-headline-md mb-1">Class Average</h4>
                            <p className="text-label-sm font-label-sm text-on-surface-variant">
                                Alex is performing 12% above the average of Group A students in this quiz.
                            </p>
                        </div>
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <span className="text-headline-md font-headline-md text-primary">68%</span>
                        </div>
                    </div>
                </div>
            </div>

        </AssessmentReviewLayout>
    );
}
