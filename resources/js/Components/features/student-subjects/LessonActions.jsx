import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonActions({ 
    onMarkCompleted, 
    onPrevious, 
    onNext, 
    onAddStudyPlan, 
    onWriteReflection, 
    onTakeQuiz 
}) {
    return (
        <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm">
            <h3 className="font-label-md text-label-md text-outline uppercase tracking-wider mb-4">Lesson Actions</h3>
            
            <div className="space-y-4">
                <button 
                    onClick={onMarkCompleted}
                    className="w-full h-12 bg-primary text-on-primary rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-tint active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                    <Icon name="task_alt" />
                    Mark as Completed
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onPrevious}
                        className="h-12 bg-surface-container-low text-on-surface-variant border border-outline-variant/30 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-95 transition-all"
                    >
                        <Icon name="arrow_back" className="text-[20px]" />
                        Previous
                    </button>
                    <button 
                        onClick={onNext}
                        className="h-12 bg-surface-container-low text-on-surface-variant border border-outline-variant/30 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-95 transition-all"
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
                            <Icon name="calendar_add_on" className="text-primary" />
                            <span className="font-label-md text-label-md">Add to Study Plan</span>
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
                </div>
            </div>
        </div>
    );
}
