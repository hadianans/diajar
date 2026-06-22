import React from 'react';
import { Head } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentReviewLayout({ 
    title, 
    onBack, 
    onPreviousStudent,
    onNextStudent,
    currentStudentIndex,
    totalStudents,
    studentAvatars = [],
    children 
}) {
    return (
        <div className="bg-background text-on-background min-h-screen pb-32">
            <Head title={title ? `${title} - Diajar` : 'Assessment Review'} />

            {/* Top AppBar */}
            <header className="bg-surface border-b border-outline-variant flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16 w-full z-50 sticky top-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center rounded-full active:bg-surface-container-high transition-colors text-primary"
                    >
                        <Icon name="arrow_back" />
                    </button>
                    <h1 className="font-headline-md text-headline-md text-primary">Teacher Hub</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors active:scale-95">
                        <Icon name="print" />
                    </button>
                    <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors active:scale-95">
                        <Icon name="more_vert" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
                {children}
            </main>

            {/* Bottom Navigation Shell */}
            <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest shadow-[0_-4px_12px_rgba(15,23,42,0.05)] flex justify-around items-center px-4 py-3 pb-safe border-t border-outline-variant md:px-margin-desktop">
                <div className="max-w-[1280px] w-full flex justify-between items-center">
                    <button 
                        onClick={onPreviousStudent}
                        disabled={currentStudentIndex <= 1}
                        className="flex items-center gap-3 px-6 py-2 rounded-full text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-all duration-200 disabled:opacity-50"
                    >
                        <Icon name="chevron_left" />
                        <span className="hidden md:inline font-label-md text-label-md">Previous Student</span>
                        <span className="md:hidden font-label-sm text-label-sm">Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {studentAvatars && studentAvatars.length > 0 && (
                            <div className="flex items-center -space-x-3">
                                {studentAvatars.map((src, idx) => (
                                    <img 
                                        key={idx}
                                        src={src} 
                                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" 
                                        alt="Student Avatar" 
                                    />
                                ))}
                            </div>
                        )}
                        <span className="text-label-sm font-label-sm text-outline hidden sm:inline">
                            {currentStudentIndex} / {totalStudents} Students
                        </span>
                    </div>

                    <button 
                        onClick={onNextStudent}
                        disabled={currentStudentIndex >= totalStudents}
                        className="flex items-center gap-3 px-6 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container active:scale-95 transition-all duration-200 disabled:opacity-50"
                    >
                        <span className="hidden md:inline font-label-md text-label-md">Next Student</span>
                        <span className="md:hidden font-label-sm text-label-sm">Next</span>
                        <Icon name="chevron_right" />
                    </button>
                </div>
            </nav>
        </div>
    );
}
