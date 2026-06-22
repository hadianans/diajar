import React, { useEffect, useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AttemptHeader({ title, currentQuestion, totalQuestions, initialTimeSeconds }) {
    const [time, setTime] = useState(initialTimeSeconds);

    useEffect(() => {
        if (time <= 0) return;
        const timerId = setInterval(() => setTime(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [time]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-surface h-20 px-margin-mobile md:px-margin-desktop flex items-center justify-between border-b border-outline-variant shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col">
                <h1 className="text-headline-md-mobile md:text-headline-md font-headline-md text-primary">{title}</h1>
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                    Question {currentQuestion} of {totalQuestions}
                </span>
            </div>
            
            <div className="flex items-center gap-stack-md bg-error-container text-on-error-container px-4 py-2 rounded-lg">
                <Icon name="timer" className="text-[20px]" />
                <span className="font-mono font-bold text-body-md" id="countdown">{formattedTime}</span>
            </div>
        </header>
    );
}
