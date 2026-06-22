import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function TargetItem({ text, isCompleted = false, onToggle }) {
    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                if (onToggle) onToggle();
            }}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer border select-none ${
                isCompleted
                    ? 'bg-surface-container-low border-transparent'
                    : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low'
            }`}
        >
            {isCompleted ? (
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center bg-primary-container flex-shrink-0 animate-scale-up">
                    <Icon name="check" className="text-[14px] text-white" />
                </div>
            ) : (
                <div className="w-6 h-6 rounded-full border-2 border-outline-variant flex-shrink-0 hover:border-primary transition-colors" />
            )}
            
            <span className={`font-body-md text-body-md text-on-surface truncate ${
                isCompleted ? 'line-through decoration-on-surface-variant opacity-70' : ''
            }`}>
                {text}
            </span>
        </div>
    );
}
