import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function RubricGradingPanel({ criteria, feedback, onLevelSelect, onFeedbackChange, grade, maxGrade }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="lg:col-span-5 flex flex-col gap-stack-md h-full pb-32">
            {/* Live Grade Sticky Container */}
            <div className="bg-primary-container text-on-primary-container p-4 rounded-xl flex items-center justify-between border border-primary/20 shadow-md">
                <div className="flex flex-col">
                    <span className="text-label-sm font-label-sm opacity-80">Current Grade</span>
                    <span className="text-headline-md font-headline-md">{grade}/{maxGrade} ({maxGrade ? Math.round((grade/maxGrade)*100) : 0}%)</span>
                </div>
                <div className="bg-on-primary-container/20 px-3 py-1 rounded-full border border-on-primary-container/10">
                    <span className="text-label-sm font-label-sm">Live Sync</span>
                </div>
            </div>

            {/* Rubric Panel */}
            <div className="flex flex-col gap-stack-sm">
                <h2 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider px-2">Rubric Evaluation</h2>
                
                {criteria.map((criterion, idx) => (
                    <div 
                        key={idx} 
                        className={`group bg-surface border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${openIndex === idx ? 'border-primary shadow-[0_4px_12px_rgba(0,74,198,0.08)]' : 'border-outline-variant'}`}
                    >
                        <button 
                            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                            className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-low transition-colors list-none text-left"
                        >
                            <div className="flex flex-col">
                                <span className="text-body-md font-bold text-on-surface">{criterion.title} ({criterion.weight}%)</span>
                                <span className={`text-label-sm font-label-sm ${criterion.selected ? 'text-primary' : 'text-on-surface-variant'}`}>
                                    {criterion.selected ? `${criterion.selected} (+${criterion.selectedPts} pts)` : 'Select a level...'}
                                </span>
                            </div>
                            <Icon name="expand_more" className={`text-outline transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div 
                            className={`transition-all duration-300 overflow-hidden ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-4 pt-0 flex flex-col gap-3">
                                <div className="grid grid-cols-1 gap-2">
                                    {criterion.levels.map((lvl, lidx) => {
                                        const isSelected = criterion.selected === lvl.title;
                                        return (
                                            <button 
                                                key={lidx}
                                                onClick={() => onLevelSelect(criterion.id, lvl.id)}
                                                className={`flex flex-col items-start p-3 rounded-lg text-left transition-all active:scale-[0.98] ${
                                                    isSelected 
                                                    ? 'border-2 border-primary bg-primary-container/10' 
                                                    : 'border border-outline-variant hover:bg-surface-container-low'
                                                }`}
                                            >
                                                <div className="flex justify-between w-full">
                                                    <span className={`text-label-md font-label-md ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                                                        {lvl.title} ({lvl.pts} pts)
                                                    </span>
                                                    {isSelected && <Icon name="check_circle" className="text-primary" filled />}
                                                </div>
                                                {lvl.description && (
                                                    <span className="text-label-sm font-body-md text-on-surface-variant mt-1">
                                                        {lvl.description}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Feedback Section */}
            <div className="bg-surface p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-3">
                <label className="text-label-md font-label-md text-on-surface-variant" htmlFor="feedback">Feedback for Student</label>
                <textarea 
                    id="feedback"
                    className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md font-body-md placeholder:text-outline" 
                    placeholder="Type qualitative feedback here..." 
                    rows="4"
                    value={feedback || ''}
                    onChange={(e) => onFeedbackChange(e.target.value)}
                ></textarea>
            </div>
        </section>
    );
}
