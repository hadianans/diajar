import React, { useEffect, useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentHeroSummary({ 
    title, 
    studentName, 
    group, 
    submittedAt, 
    questionsCount, 
    correctCount, 
    incorrectCount, 
    timeSpent, 
    scorePercentage,
    passStatus,
    gradeLetter
}) {
    const [mounted, setMounted] = useState(false);
    
    // SVG Circle setup
    const radius = 40;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = mounted ? circumference - (scorePercentage / 100 * circumference) : circumference;

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start mb-stack-lg">
            {/* Left: Student Details */}
            <div className="lg:col-span-8 flex flex-col gap-stack-md">
                <div className="flex flex-col gap-stack-sm">
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Assessment Report</span>
                    <h2 className="font-headline-lg text-headline-lg text-on-background">{title}</h2>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                        <div className="flex items-center gap-2">
                            <Icon name="person" className="text-outline" />
                            <span className="font-body-md text-body-md">{studentName} ({group})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon name="calendar_today" className="text-outline" />
                            <span className="font-body-md text-body-md text-on-surface-variant">Submitted: {submittedAt}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mt-stack-md">
                    <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-1">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Questions</span>
                        <span className="text-headline-md font-headline-md">{questionsCount}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-1">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Correct</span>
                        <span className="text-headline-md font-headline-md text-secondary">{correctCount}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-1">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Incorrect</span>
                        <span className="text-headline-md font-headline-md text-error">{incorrectCount}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-1">
                        <span className="text-label-sm font-label-sm text-on-surface-variant">Time Spent</span>
                        <span className="text-headline-md font-headline-md">{timeSpent}</span>
                    </div>
                </div>
            </div>

            {/* Right: Score Ring */}
            <div className="lg:col-span-4 bg-white p-8 rounded-xl border border-outline-variant shadow-sm flex flex-col items-center justify-center relative">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle 
                            className="text-surface-container-high stroke-current" 
                            cx="50" cy="50" fill="transparent" r="40" strokeWidth="10"
                        ></circle>
                        <circle 
                            className="text-secondary stroke-current transition-all duration-[800ms] ease-in-out" 
                            cx="50" cy="50" fill="transparent" r="40" strokeLinecap="round" strokeWidth="10" 
                            style={{ 
                                strokeDasharray: circumference, 
                                strokeDashoffset: strokeDashoffset 
                            }}
                        ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-headline-lg font-headline-lg">{scorePercentage}%</span>
                        <span className="text-label-sm font-label-sm text-outline uppercase">{scorePercentage}/100</span>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-4 py-1 rounded-full font-label-md text-label-md ${passStatus === 'PASS' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                            {passStatus}
                        </span>
                        <span className="px-4 py-1 bg-surface-container-high text-on-surface rounded-full font-label-md text-label-md">
                            Grade: {gradeLetter}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
