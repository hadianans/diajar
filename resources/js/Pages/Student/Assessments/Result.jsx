import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';

export default function Result({ attemptId }) {
    const [loading, setLoading] = useState(true);
    const [resultData, setResultData] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await api.get(`/attempts/${attemptId}/result`);
                if (res && res.attempt) {
                    setResultData(res);
                }
            } catch (error) {
                console.error('Error fetching result:', error);
            } finally {
                setLoading(false);
            }
        };

        if (attemptId) {
            fetchResult();
        }
    }, [attemptId]);

    if (loading) {
        return (
            <DashboardTemplate activeTab="tasks" title="Loading..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Loading results...</div>
            </DashboardTemplate>
        );
    }

    if (!resultData) {
        return (
            <DashboardTemplate activeTab="tasks" title="Not Found" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Result not found.</div>
            </DashboardTemplate>
        );
    }

    const { attempt, answers } = resultData;
    const isGraded = attempt.status === 'graded' || attempt.status === 'submitted'; // Auto-graded usually means submitted == graded if it's multiple choice
    const grade = attempt.grade || 0;

    return (
        <DashboardTemplate 
            activeTab="tasks"
            title="Assessment Result"
            showBack={true}
            onBack={() => window.location.href = '/student/assessments'}
        >
            <Head title="Assessment Result - Diajar LMS" />

            <div className="max-w-3xl mx-auto py-8 space-y-6">
                <div className="bg-surface-container rounded-2xl p-8 text-center space-y-4">
                    <Icon name="emoji_events" className="text-6xl text-primary" />
                    <h2 className="text-headline-md text-on-surface">Assessment Completed</h2>
                    <p className="text-body-md text-on-surface-variant">
                        You have successfully submitted your assessment.
                    </p>
                    
                    {isGraded && (
                        <div className="mt-6 inline-block bg-surface-container-lowest px-8 py-4 rounded-xl shadow-sm border border-outline-variant/30">
                            <span className="block text-label-md text-outline-variant uppercase mb-1">Your Score</span>
                            <span className="text-display-sm text-primary font-bold">{grade}</span>
                        </div>
                    )}
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-title-lg text-on-surface mb-6">Review Answers</h3>
                    
                    <div className="space-y-6">
                        {answers?.map((answer, index) => (
                            <div key={answer.id} className="border-b border-outline-variant/30 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-label-md text-on-surface-variant">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="font-body-md text-on-surface" dangerouslySetInnerHTML={{ __html: answer.classQuestion?.question }} />
                                        
                                        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                                            <span className="text-label-sm text-outline-variant uppercase block mb-2">Your Answer</span>
                                            {answer.selectedOption ? (
                                                <div className="flex items-center gap-2">
                                                    <Icon 
                                                        name={answer.is_correct ? "check_circle" : "cancel"} 
                                                        className={answer.is_correct ? "text-primary" : "text-error"} 
                                                    />
                                                    <span className="text-body-md" dangerouslySetInnerHTML={{ __html: answer.selectedOption.option }} />
                                                </div>
                                            ) : (
                                                <span className="text-body-md text-outline italic">No answer provided</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <Link 
                        href="/student/assessments"
                        className="bg-primary text-on-primary px-8 py-3 rounded-xl font-label-md shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
                    >
                        Back to Assessments
                    </Link>
                </div>
            </div>
        </DashboardTemplate>
    );
}
