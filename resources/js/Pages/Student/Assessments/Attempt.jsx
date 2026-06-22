import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import AttemptHeader from '@/Components/features/student-assessments/AttemptHeader';
import QuestionCard from '@/Components/features/student-assessments/QuestionCard';
import QuestionNavigator from '@/Components/features/student-assessments/QuestionNavigator';

// Mock Data
const assessmentDetails = {
    title: 'Biology Midterm Quiz',
    totalQuestions: 10,
    timeLimitSeconds: 38 * 60 + 42, // 38:42
};

const mockQuestions = Array.from({ length: 10 }).map((_, idx) => ({
    id: idx + 1,
    text: idx === 2 
        ? "Which organelle is known as the 'powerhouse' of the cell?" 
        : `Sample question text for Question ${idx + 1}?`,
    options: [
        { text: idx === 2 ? "Nucleus" : "Option A" },
        { text: idx === 2 ? "Mitochondria" : "Option B" },
        { text: idx === 2 ? "Ribosomes" : "Option C" },
        { text: idx === 2 ? "Golgi Apparatus" : "Option D" }
    ]
}));

export default function Attempt({ assessmentId }) {
    const [currentIndex, setCurrentIndex] = useState(2); // Start at Question 3 (index 2)
    const [answersState, setAnswersState] = useState({
        0: 'answered',
        1: 'answered',
        4: 'flagged'
    });

    const currentQuestion = mockQuestions[currentIndex];
    const isMarkedForReview = answersState[currentIndex] === 'flagged';

    const handleToggleReview = () => {
        setAnswersState(prev => ({
            ...prev,
            [currentIndex]: prev[currentIndex] === 'flagged' ? null : 'flagged'
        }));
    };

    const handlePrevious = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentIndex < mockQuestions.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handleJump = (idx) => {
        setCurrentIndex(idx);
    };

    const handleSubmit = () => {
        const unansweredCount = mockQuestions.length - Object.values(answersState).filter(s => s === 'answered').length;
        if (confirm(`Are you sure you want to finish the attempt? You still have ${unansweredCount} unanswered questions.`)) {
            alert("Quiz submitted successfully. Redirecting to dashboard...");
            router.visit(route('student.assessments.index'));
        }
    };

    // Calculate progress based on answered questions
    const answeredCount = Object.values(answersState).filter(s => s === 'answered').length;
    const progressPercentage = (answeredCount / mockQuestions.length) * 100;

    return (
        <div className="bg-background min-h-screen flex flex-col font-body-md">
            <Head title={`${assessmentDetails.title} - Diajar LMS`} />

            <AttemptHeader 
                title={assessmentDetails.title}
                currentQuestion={currentIndex + 1}
                totalQuestions={assessmentDetails.totalQuestions}
                initialTimeSeconds={assessmentDetails.timeLimitSeconds}
            />

            <main className="flex-grow pt-28 pb-32 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto w-full">
                {/* Progress Bar (Subtle Growth Indicator) */}
                <div className="w-full bg-surface-container h-1.5 rounded-full mb-stack-lg overflow-hidden">
                    <div 
                        className="bg-secondary h-full transition-all duration-500 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                {/* Question Area */}
                <QuestionCard 
                    question={currentQuestion.text}
                    options={currentQuestion.options}
                    isMarkedForReview={isMarkedForReview}
                    onToggleReview={handleToggleReview}
                />

                {/* Question Navigation */}
                <QuestionNavigator 
                    totalQuestions={assessmentDetails.totalQuestions}
                    currentIndex={currentIndex}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onJump={handleJump}
                    answersState={answersState}
                />
            </main>

            {/* Submission Area (Persistent Footer) */}
            <footer className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant py-4 px-margin-mobile md:px-margin-desktop z-50 flex justify-center items-center">
                <button 
                    onClick={handleSubmit}
                    className="max-w-md w-full py-4 bg-on-surface text-white rounded-xl font-bold text-body-md hover:bg-primary transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-3"
                >
                    <Icon name="assignment_turned_in" />
                    Finish & Submit Attempt
                </button>
            </footer>
        </div>
    );
}
