import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ContinueLearningCard({
    subject = 'Biology',
    title = 'Photosynthesis Deep Dive',
    type = 'Video Lesson',
    progress = 65,
    onContinueClick
}) {
    return (
        <article className="bg-surface-container-highest rounded-[24px] p-6 shadow-sm border border-outline-variant relative overflow-hidden group hover:shadow-md transition-all duration-300">
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full mb-2 font-bold uppercase tracking-wider">
                            {subject}
                        </span>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                            {title}
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-1 font-medium">
                            <Icon name="play_circle" className="text-[18px] text-primary" />
                            <span>{type}</span>
                        </p>
                    </div>
                </div>

                <div className="mt-2">
                    <div className="flex justify-between items-end mb-2">
                        <span className="font-label-md text-label-md text-primary font-bold">
                            {progress}% Progress
                        </span>
                    </div>
                    <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <button
                    onClick={onContinueClick}
                    className="mt-4 w-full py-3 bg-primary text-on-primary font-label-md text-label-md rounded-xl active:scale-[0.98] transition-transform flex justify-center items-center gap-2 hover:bg-primary/90 shadow-sm"
                    type="button"
                >
                    <span>Continue</span>
                    <Icon name="arrow_forward" className="text-[20px]" />
                </button>
            </div>
        </article>
    );
}
