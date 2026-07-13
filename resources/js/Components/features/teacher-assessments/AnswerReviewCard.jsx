import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AnswerReviewCard({ 
    questionNumber, 
    difficulty, 
    isCorrect, 
    questionText, 
    studentAnswer, 
    correctAnswer, 
    explanation 
}) {
    return (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="font-headline-md text-headline-md text-outline">Q{questionNumber}</span>
                        <span className={`px-3 py-1 rounded-lg font-label-sm text-label-sm ${
                            difficulty === 'Hard' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 
                            'bg-surface-container-high text-on-surface-variant'
                        }`}>
                            {difficulty}
                        </span>
                    </div>
                    <div className={`flex items-center gap-2 font-label-md text-label-md ${isCorrect ? 'text-secondary' : 'text-error'}`}>
                        <Icon name={isCorrect ? "check_circle" : "cancel"} filled />
                        {isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                </div>
                
                <div className="font-body-lg text-body-lg text-on-background mb-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: questionText }} />
                
                {isCorrect ? (
                    <div className="p-4 bg-secondary-fixed/10 rounded-lg border-l-4 border-secondary mb-4">
                        <span className="block text-label-sm font-label-sm text-on-secondary-fixed-variant mb-1">Student's Answer</span>
                        <p className="font-body-md text-body-md text-on-background">{studentAnswer}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="p-4 bg-error-container/30 rounded-lg border-l-4 border-error">
                            <span className="block text-label-sm font-label-sm text-on-error-container mb-1">Student's Answer</span>
                            <p className="font-body-md text-body-md text-on-background">{studentAnswer}</p>
                        </div>
                        <div className="p-4 bg-secondary-fixed/10 rounded-lg border-l-4 border-secondary">
                            <span className="block text-label-sm font-label-sm text-on-secondary-fixed-variant mb-1">Correct Answer</span>
                            <p className="font-body-md text-body-md text-on-background">{correctAnswer}</p>
                        </div>
                    </div>
                )}
                
                {explanation && (
                    <div className="flex items-start gap-3 mt-4 text-on-surface-variant">
                        <Icon name="info" className="text-outline shrink-0" />
                        <div className="font-label-sm text-label-sm leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: explanation }} />
                    </div>
                )}
            </div>
        </div>
    );
}
