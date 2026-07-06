import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';

export default function AssessmentWizardLayout({
    title,
    currentStep = 1,
    onStepChange,
    onBack,
    onPreview,
    children,
    selectedQuestionsCount = 0,
    totalPoints = 0,
    selectedQuestions = []
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const headerSection = (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
                >
                    <Icon name="arrow_back" className="text-primary" />
                </button>
                <h1 className="font-headline-md text-headline-md font-bold text-primary">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3">
                    {[1, 2, 3].map((step, idx) => (
                        <React.Fragment key={step}>
                            <button
                                onClick={() => onStepChange && onStepChange(step)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md transition-colors ${currentStep >= step
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-container-highest text-on-surface-variant'
                                    }`}
                            >
                                {step}
                            </button>
                            {idx < 2 && <span className={`w-8 h-px ${currentStep > step ? 'bg-primary' : 'bg-outline-variant'}`}></span>}
                        </React.Fragment>
                    ))}
                </div>
                <button
                    onClick={onPreview}
                    className="font-label-md text-label-md text-primary hover:bg-surface-container-high px-4 py-2 rounded-lg transition-colors"
                >
                    Preview
                </button>
            </div>
        </div>
    );

    return (
        <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection} title="Assessments" viewLabel="Teacher View">
            <Head title={title} />

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto w-full">
                {children}
            </div>

            {/* Persistent Bottom Panel (Mobile Focused) */}
            <div className={`fixed bottom-0 left-0 md:left-72 inset-x-0 bg-white/80 backdrop-blur-md border-t border-outline-variant p-4 z-40 transition-transform duration-500 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] ${currentStep === 1 ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex flex-col cursor-pointer select-none" onClick={() => setDrawerOpen(!drawerOpen)}>
                        <div className="flex items-center gap-2">
                            <span className="font-label-md text-on-surface">{selectedQuestionsCount} Questions Selected</span>
                            <Icon
                                name="keyboard_arrow_up"
                                className={`text-outline transition-transform duration-300 ${drawerOpen ? 'rotate-180' : ''}`}
                            />
                        </div>
                        <p className="font-label-sm text-primary font-bold">{totalPoints} Pts Total</p>
                    </div>

                    {currentStep === 2 && (
                        <button
                            onClick={() => onStepChange && onStepChange(3)}
                            className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md shadow-sm active:scale-95 transition-transform"
                        >
                            Review <span className="hidden md:inline">Selection</span>
                        </button>
                    )}
                </div>

                {/* Expandable Drawer Content */}
                <div className={`overflow-hidden transition-all duration-300 ${drawerOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
                    <div className="py-4 space-y-3 mt-4 custom-scrollbar max-h-60 overflow-y-auto">
                        {selectedQuestions.map((q, idx) => {
                            const plainText = (q.question || q.text || '').replace(/<[^>]+>/g, '');
                            return (
                                <div key={idx} className="flex items-center justify-between p-2 bg-surface-container rounded-lg">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Icon name="drag_indicator" className="text-outline text-[20px] shrink-0" />
                                        <span className="font-label-sm text-on-surface-variant truncate">{plainText}</span>
                                    </div>
                                    <button className="text-error shrink-0 p-1 hover:bg-error-container rounded-full transition-colors">
                                        <Icon name="delete" />
                                    </button>
                                </div>
                            );
                        })}
                        {selectedQuestions.length === 0 && (
                            <div className="text-center py-4 text-on-surface-variant font-label-sm">No questions selected yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    );
}
