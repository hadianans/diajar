import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonActions({ 
    isCompleted,
    onMarkCompleted, 
    onPrevious, 
    onNext, 
    hasNext,
    hasPrev,
    onAddStudyPlan, 
    onWriteReflection, 
    onTakeQuiz,
    hasQuiz,
    hasPlan 
}) {
    return (
        <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm">
            <h3 className="font-label-md text-label-md text-outline uppercase tracking-wider mb-4">Lesson Actions</h3>
            
            <div className="space-y-4">
                <button 
                    onClick={onMarkCompleted}
                    className={`w-full h-12 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-sm ${isCompleted ? 'bg-surface-container-high text-primary border border-primary' : 'bg-primary text-on-primary hover:bg-surface-tint shadow-primary/20 active:scale-95'}`}
                >
                    <Icon name={isCompleted ? "check_circle" : "task_alt"} />
                    {isCompleted ? 'Completed' : 'Mark as Completed'}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onPrevious}
                        disabled={!hasPrev}
                        className={`h-12 border rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 transition-all ${hasPrev ? 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high active:scale-95' : 'bg-surface-container-lowest text-outline border-transparent opacity-50 cursor-not-allowed'}`}
                    >
                        <Icon name="arrow_back" className="text-[20px]" />
                        Previous
                    </button>
                    <button 
                        onClick={onNext}
                        disabled={!hasNext}
                        className={`h-12 border rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 transition-all ${hasNext ? 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high active:scale-95' : 'bg-surface-container-lowest text-outline border-transparent opacity-50 cursor-not-allowed'}`}
                    >
                        Next
                        <Icon name="arrow_forward" className="text-[20px]" />
                    </button>
                </div>
                
                <div className="pt-4 border-t border-outline-variant/30 space-y-3">
                    <button 
                        onClick={onAddStudyPlan}
                        className="w-full py-3 px-4 flex items-center justify-between text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <Icon name={hasPlan ? "edit_calendar" : "calendar_add_on"} className={hasPlan ? "text-secondary" : "text-primary"} />
                            <span className="font-label-md text-label-md">{hasPlan ? 'Edit Study Plan' : 'Add to Study Plan'}</span>
                        </div>
                        <Icon name="chevron_right" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    
                    <button 
                        onClick={onWriteReflection}
                        className="w-full py-3 px-4 flex items-center justify-between text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <Icon name="edit_note" className="text-tertiary" />
                            <span className="font-label-md text-label-md">Write Reflection</span>
                        </div>
                        <Icon name="chevron_right" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    
                    {hasQuiz && (
                        <button 
                            onClick={onTakeQuiz}
                            className="w-full py-3 px-4 flex items-center justify-between bg-secondary-container text-on-secondary-container rounded-xl transition-transform active:scale-95 group"
                        >
                            <div className="flex items-center gap-3">
                                <Icon name="quiz" />
                                <span className="font-label-md text-label-md">Take Lesson Quiz</span>
                            </div>
                            <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
