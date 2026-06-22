import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function RubricBuilder() {
    const [expandedCriterion, setExpandedCriterion] = useState(0);

    return (
        <section className="space-y-stack-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="grading" className="text-primary text-[20px]" />
                    <h2 className="font-headline-md text-headline-md text-on-surface">Grading Rubric</h2>
                </div>
                {/* Weight Tracker */}
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full animate-[pulse_3s_ease-in-out_infinite]">
                    <Icon name="check_circle" className="text-[16px]" filled />
                    <span className="font-label-sm text-label-sm">Total Weight: 100%</span>
                </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Rubric Title</label>
                        <input 
                            type="text" 
                            className="w-full h-12 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-body-md" 
                            placeholder="Standard Composition Rubric" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Rubric Description</label>
                        <input 
                            type="text" 
                            className="w-full h-12 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-body-md" 
                            placeholder="General criteria for grading essays" 
                        />
                    </div>
                </div>

                {/* Criterion Cards List */}
                <div className="space-y-4">
                    
                    {/* Criterion 1 */}
                    <div className={`group border rounded-2xl overflow-hidden transition-all hover:shadow-md ${expandedCriterion === 0 ? 'border-primary shadow-[0_4px_12px_rgba(0,74,198,0.08)]' : 'border-outline-variant'}`}>
                        <div 
                            className="p-4 bg-surface-container-low flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedCriterion(expandedCriterion === 0 ? -1 : 0)}
                        >
                            <div className="flex items-center gap-3">
                                <Icon name="drag_indicator" className="text-outline" />
                                <div>
                                    <h3 className="font-label-md text-label-md text-on-surface">Clarity of Argument</h3>
                                    <p className="text-label-sm text-outline">40% Weight • 3 Levels</p>
                                </div>
                            </div>
                            <Icon name="expand_more" className={`text-outline transition-transform ${expandedCriterion === 0 ? 'rotate-180' : ''}`} />
                        </div>
                        
                        <div className={`p-5 space-y-6 bg-white border-t border-outline-variant ${expandedCriterion === 0 ? 'block' : 'hidden'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-3 space-y-2">
                                    <label className="font-label-sm text-label-sm text-outline">Criterion Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full h-10 px-3 bg-surface-container border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary" 
                                        defaultValue="Clarity of Argument" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-sm text-label-sm text-outline">Weight %</label>
                                    <input 
                                        type="number" 
                                        className="w-full h-10 px-3 bg-surface-container border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary" 
                                        defaultValue="40" 
                                    />
                                </div>
                            </div>
                            
                            {/* Performance Levels */}
                            <div className="space-y-4">
                                <label className="font-label-md text-label-md text-on-surface">Performance Levels</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="p-3 rounded-xl bg-surface-container-high border border-outline-variant space-y-2 focus-within:border-primary">
                                        <div className="flex justify-between items-center">
                                            <input type="text" className="bg-transparent border-none p-0 font-label-md text-primary w-24 focus:ring-0" defaultValue="Excellent" />
                                            <input type="number" className="bg-white rounded px-1 w-10 text-center text-label-sm font-bold border-none" defaultValue="10" />
                                        </div>
                                        <textarea className="w-full text-label-sm bg-transparent border-none resize-none p-0 h-16 focus:ring-0 text-on-surface-variant" defaultValue="Exceptional clarity and depth of insight."></textarea>
                                    </div>
                                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant space-y-2 focus-within:border-primary">
                                        <div className="flex justify-between items-center">
                                            <input type="text" className="bg-transparent border-none p-0 font-label-md text-on-surface w-24 focus:ring-0" defaultValue="Good" />
                                            <input type="number" className="bg-white rounded px-1 w-10 text-center text-label-sm border-none" defaultValue="8" />
                                        </div>
                                        <textarea className="w-full text-label-sm bg-transparent border-none resize-none p-0 h-16 focus:ring-0 text-on-surface-variant" defaultValue="Argument is clear and mostly supported."></textarea>
                                    </div>
                                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant space-y-2 opacity-80 focus-within:border-primary">
                                        <div className="flex justify-between items-center">
                                            <input type="text" className="bg-transparent border-none p-0 font-label-md text-on-surface w-24 focus:ring-0" defaultValue="Fair" />
                                            <input type="number" className="bg-white rounded px-1 w-10 text-center text-label-sm border-none" defaultValue="5" />
                                        </div>
                                        <textarea className="w-full text-label-sm bg-transparent border-none resize-none p-0 h-16 focus:ring-0 text-on-surface-variant" defaultValue="Argument is evident but lacks evidence."></textarea>
                                    </div>
                                    
                                    <button type="button" className="h-full min-h-[120px] border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center text-outline hover:text-primary hover:border-primary transition-colors py-4 group">
                                        <Icon name="add" className="group-hover:scale-110 transition-transform" />
                                        <span className="text-label-sm mt-1">Add Level</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Criterion 2 (Collapsed) */}
                    <div className={`group border rounded-2xl overflow-hidden transition-all hover:shadow-md ${expandedCriterion === 1 ? 'border-primary shadow-[0_4px_12px_rgba(0,74,198,0.08)]' : 'border-outline-variant'}`}>
                        <div 
                            className="p-4 bg-surface-container-low flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedCriterion(expandedCriterion === 1 ? -1 : 1)}
                        >
                            <div className="flex items-center gap-3">
                                <Icon name="drag_indicator" className="text-outline" />
                                <div>
                                    <h3 className="font-label-md text-label-md text-on-surface">Grammar & Style</h3>
                                    <p className="text-label-sm text-outline">60% Weight • 0 Levels</p>
                                </div>
                            </div>
                            <Icon name="expand_more" className={`text-outline transition-transform ${expandedCriterion === 1 ? 'rotate-180' : ''}`} />
                        </div>
                        
                        <div className={`p-5 space-y-6 bg-white border-t border-outline-variant ${expandedCriterion === 1 ? 'block' : 'hidden'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-3 space-y-2">
                                    <label className="font-label-sm text-label-sm text-outline">Criterion Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full h-10 px-3 bg-surface-container border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary" 
                                        defaultValue="Grammar & Style" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-sm text-label-sm text-outline">Weight %</label>
                                    <input 
                                        type="number" 
                                        className="w-full h-10 px-3 bg-surface-container border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary" 
                                        defaultValue="60" 
                                    />
                                </div>
                            </div>
                            <button type="button" className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                                <Icon name="add_circle" className="text-[18px]" /> Add Performance Levels
                            </button>
                        </div>
                    </div>

                </div>

                <button type="button" className="w-full py-4 border-2 border-dashed border-primary/30 rounded-xl flex items-center justify-center gap-2 text-primary font-label-md hover:bg-primary-container/10 transition-colors">
                    <Icon name="playlist_add" /> Add Criterion
                </button>
            </div>
            
            {/* Preview Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" className="flex-1 h-14 rounded-2xl border border-primary text-primary font-label-md flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors active:scale-95">
                    <Icon name="visibility" /> Preview Rubric
                </button>
                <button type="button" className="flex-1 h-14 rounded-2xl bg-surface-container-high text-on-surface font-label-md flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors active:scale-95">
                    <Icon name="content_paste" /> Copy from Template
                </button>
            </div>

        </section>
    );
}
