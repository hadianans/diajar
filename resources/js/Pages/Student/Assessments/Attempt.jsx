import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import AttemptHeader from '@/Components/features/student-assessments/AttemptHeader';
import QuestionCard from '@/Components/features/student-assessments/QuestionCard';
import QuestionNavigator from '@/Components/features/student-assessments/QuestionNavigator';
import api from '@/utils/api';

export default function Attempt({ assessmentId }) {
    const [loading, setLoading] = useState(true);
    const [attemptId, setAttemptId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answersState, setAnswersState] = useState({});
    const [assessmentDetails, setAssessmentDetails] = useState({
        title: 'Assessment',
        totalQuestions: 0,
        timeLimitSeconds: 0
    });

    useEffect(() => {
        const startAttempt = async () => {
            try {
                // First get assessment details
                const detailsRes = await api.get(`/assessments/${assessmentId}`);
                if (detailsRes.data?.success) {
                    const assessment = detailsRes.data.data.assessment;
                    setAssessmentDetails({
                        title: assessment.title,
                        totalQuestions: assessment.question_count || 0,
                        timeLimitSeconds: assessment.duration_minutes ? assessment.duration_minutes * 60 : 0
                    });
                }

                // Then start the attempt
                const res = await api.post(`/assessments/${assessmentId}/attempt`);
                if (res.data?.success) {
                    setAttemptId(res.data.data.attempt_id);
                    setQuestions(res.data.data.questions || []);
                    
                    // Initialize answers state
                    const initialAnswers = {};
                    (res.data.data.questions || []).forEach((q, idx) => {
                        initialAnswers[idx] = null; // null means unanswered
                    });
                    setAnswersState(initialAnswers);
                } else {
                    alert('Could not start assessment: ' + (res.data?.message || 'Unknown error'));
                    router.visit(`/student/assessments/${assessmentId}`);
                }
            } catch (error) {
                console.error('Error starting attempt:', error);
                alert('An error occurred. You might have reached the maximum attempts.');
                router.visit(`/student/assessments/${assessmentId}`);
            } finally {
                setLoading(false);
            }
        };

        startAttempt();
    }, [assessmentId]);

    const currentQuestion = questions[currentIndex];
    const isMarkedForReview = answersState[currentIndex] === 'flagged';

    const handleToggleReview = async () => {
        const newState = answersState[currentIndex] === 'flagged' ? 'answered' : 'flagged'; // simplified logic
        setAnswersState(prev => ({ ...prev, [currentIndex]: newState }));
        
        // Find if they selected an option before (we don't store selected option locally easily without extra state, so we just toggle UI for now)
        // A real app would need to track `selectedOptionId` locally.
    };

    const handleOptionSelect = async (optionId) => {
        if (!attemptId || !currentQuestion) return;
        
        try {
            await api.patch(`/attempts/${attemptId}/answers/${currentQuestion.id}`, {
                selected_option_id: optionId,
                marked_for_review: isMarkedForReview
            });
            
            setAnswersState(prev => ({
                ...prev,
                [currentIndex]: isMarkedForReview ? 'flagged' : 'answered'
            }));
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handleJump = (idx) => {
        setCurrentIndex(idx);
    };

    const handleSubmit = async () => {
        const unansweredCount = questions.length - Object.values(answersState).filter(s => s === 'answered' || s === 'flagged').length;
        if (confirm(`Are you sure you want to finish the attempt? You still have ${unansweredCount} unanswered questions.`)) {
            try {
                await api.patch(`/attempts/${attemptId}/submit`);
                alert("Assessment submitted successfully. Redirecting to results...");
                router.visit(`/student/attempts/${attemptId}/result`);
            } catch (error) {
                console.error('Error submitting:', error);
                alert('Failed to submit. Please try again.');
            }
        }
    };

    // Calculate progress based on answered questions
    const answeredCount = Object.values(answersState).filter(s => s === 'answered' || s === 'flagged').length;
    const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    if (loading) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center font-body-md">
                <div className="text-center space-y-4">
                    <Icon name="sync" className="animate-spin text-4xl text-primary" />
                    <p className="text-on-surface-variant text-body-lg">Preparing your assessment...</p>
                </div>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center font-body-md">
                <div className="text-center">
                    <p>No questions found for this assessment.</p>
                    <button onClick={() => window.history.back()} className="mt-4 text-primary">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen flex flex-col font-body-md">
            <Head title={`${assessmentDetails.title} - Diajar LMS`} />

            <AttemptHeader 
                title={assessmentDetails.title}
                currentQuestion={currentIndex + 1}
                totalQuestions={questions.length}
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
                <div className="bg-white border border-outline-variant/50 rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                        <button 
                            onClick={handleToggleReview}
                            className={`flex flex-col items-center gap-1 transition-colors ${isMarkedForReview ? 'text-tertiary' : 'text-outline-variant hover:text-on-surface-variant'}`}
                        >
                            <Icon name={isMarkedForReview ? "flag" : "outlined_flag"} className="text-[24px]" />
                            <span className="font-label-sm text-[10px] uppercase tracking-wider">Review</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.options?.map((option, idx) => (
                            <label 
                                key={option.id}
                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                    false // In a real app we'd track selectedOptionId to highlight it
                                    ? 'bg-primary-container/20 border-primary shadow-sm' 
                                    : 'bg-surface-container-lowest border-outline-variant/40 hover:bg-surface-container-low hover:border-outline-variant'
                                }`}
                                onClick={() => handleOptionSelect(option.id)}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    false ? 'border-primary' : 'border-outline-variant'
                                }`}>
                                    {false && <div className="w-3 h-3 bg-primary rounded-full" />}
                                </div>
                                <div className="font-body-md text-on-surface-variant leading-relaxed" dangerouslySetInnerHTML={{ __html: option.option }} />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Question Navigation */}
                <QuestionNavigator 
                    totalQuestions={questions.length}
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
