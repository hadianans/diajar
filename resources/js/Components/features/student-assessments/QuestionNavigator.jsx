import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionNavigator({
    totalQuestions,
    currentIndex,
    onPrevious,
    onNext,
    onJump,
    answersState, // Object mapping index to status ('answered', 'flagged', null)
}) {
    return (
        <div className="mt-stack-lg flex flex-col gap-stack-lg">
            <div className="flex items-center justify-between">
                <button
                    onClick={onPrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 text-label-md font-label-md text-primary bg-surface border border-primary rounded-lg hover:bg-surface-container-low active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
                >
                    <Icon name="arrow_back" />
                    Previous
                </button>
                <button
                    onClick={onNext}
                    disabled={currentIndex === totalQuestions - 1}
                    className="flex items-center gap-2 px-8 py-3 text-label-md font-label-md text-white bg-primary-container rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
                >
                    Next
                    <Icon name="arrow_forward" />
                </button>
            </div>

            <div className="border-t border-outline-variant pt-stack-lg">
                <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-4 tracking-widest">Question Navigation</h3>
                <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar p-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {Array.from({ length: totalQuestions }).map((_, idx) => {
                        const isCurrent = currentIndex === idx;
                        const stateObj = answersState[idx];
                        const status = stateObj?.status;
                        const isFlagged = status === 'flagged';
                        const isAnswered = status === 'answered';

                        let baseClasses = "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg text-label-md font-bold transition-all";
                        let stateClasses = "";

                        if (isCurrent) {
                            stateClasses = "ring-2 ring-primary ring-offset-2 bg-surface text-primary";
                        } else if (isFlagged) {
                            stateClasses = "border-2 border-tertiary bg-tertiary-fixed text-on-tertiary-fixed";
                        } else if (isAnswered) {
                            stateClasses = "bg-secondary text-white shadow-sm";
                        } else {
                            stateClasses = "border border-outline-variant bg-surface text-on-surface-variant font-normal hover:bg-surface-container-low";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => onJump(idx)}
                                className={`relative ${baseClasses} ${stateClasses}`}
                            >
                                {idx + 1}
                                {isFlagged && !isCurrent && (
                                    <Icon
                                        name="flag"
                                        className="absolute -top-1 -right-1 text-[14px] text-tertiary"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
