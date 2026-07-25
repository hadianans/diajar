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
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4 font-bold">
                Tindakan Pelajaran
            </h3>
            
            <div className="space-y-4">
                <button 
                    onClick={onMarkCompleted}
                    className={`w-full h-12 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-sm ${
                        isCompleted 
                            ? 'bg-surface-container-high text-primary border border-primary/30 font-bold' 
                            : 'bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20 active:scale-[0.98]'
                    }`}
                >
                    <Icon name={isCompleted ? "check_circle" : "task_alt"} />
                    {isCompleted ? 'Selesai' : 'Tandai Selesai'}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onPrevious}
                        disabled={!hasPrev}
                        className={`h-11 border rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all ${
                            hasPrev 
                                ? 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high active:scale-[0.98]' 
                                : 'bg-surface-container-lowest text-outline border-transparent opacity-40 cursor-not-allowed'
                        }`}
                    >
                        <Icon name="arrow_back" className="text-[18px]" />
                        <span>Sebelumnya</span>
                    </button>
                    <button 
                        onClick={onNext}
                        disabled={!hasNext}
                        className={`h-11 border rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all ${
                            hasNext 
                                ? 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high active:scale-[0.98]' 
                                : 'bg-surface-container-lowest text-outline border-transparent opacity-40 cursor-not-allowed'
                        }`}
                    >
                        <span>Selanjutnya</span>
                        <Icon name="arrow_forward" className="text-[18px]" />
                    </button>
                </div>
                
                <div className="pt-4 border-t border-outline-variant/30 space-y-2.5">
                    <button 
                        onClick={onAddStudyPlan}
                        className="w-full py-3 px-4 flex items-center justify-between text-on-surface-variant hover:bg-surface-container-low/70 rounded-xl transition-colors group border border-transparent hover:border-outline-variant/30"
                    >
                        <div className="flex items-center gap-3">
                            <Icon name={hasPlan ? "edit_calendar" : "calendar_add_on"} className={hasPlan ? "text-secondary" : "text-primary"} />
                            <span className="font-label-md text-label-md">{hasPlan ? 'Edit Rencana Belajar' : 'Tambah Rencana Belajar'}</span>
                        </div>
                        <Icon name="chevron_right" className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[18px]" />
                    </button>
                    
                    <button 
                        onClick={onWriteReflection}
                        className="w-full py-3 px-4 flex items-center justify-between text-on-surface-variant hover:bg-surface-container-low/70 rounded-xl transition-colors group border border-transparent hover:border-outline-variant/30"
                    >
                        <div className="flex items-center gap-3">
                            <Icon name="edit_note" className="text-tertiary" />
                            <span className="font-label-md text-label-md">Tulis Refleksi</span>
                        </div>
                        <Icon name="chevron_right" className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[18px]" />
                    </button>
                    
                    {hasQuiz && (
                        <button 
                            onClick={onTakeQuiz}
                            className="w-full py-3 px-4 flex items-center justify-between bg-secondary-container text-on-secondary-container rounded-xl transition-transform active:scale-[0.98] group mt-1"
                        >
                            <div className="flex items-center gap-3">
                                <Icon name="quiz" />
                                <span className="font-label-md text-label-md font-bold">Kerjakan Kuis Pelajaran</span>
                            </div>
                            <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform text-[18px]" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
