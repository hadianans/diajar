import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function WizardStepBasicInfo({ onNext }) {
    return (
        <section className="space-y-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Step 1: Basic Information</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">Establish the core framework of your assessment.</p>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm space-y-stack-md">
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface">Assessment Title</label>
                    <input 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary" 
                        placeholder="e.g. Biology Midterm" 
                        type="text" 
                        defaultValue="Biology Midterm" 
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface">Description (Optional)</label>
                    <textarea 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md h-24 resize-none focus:ring-2 focus:ring-primary" 
                        placeholder="Outline the learning objectives..."
                        defaultValue="Comprehensive evaluation of Unit 1: Foundations of Life, focusing on eukaryotic and prokaryotic cell structures."
                    ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface">Duration (Minutes)</label>
                        <div className="relative">
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary" 
                                type="number" 
                                defaultValue="45" 
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-outline">mins</span>
                        </div>
                    </div>
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface">Chapter Selector</label>
                        <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md appearance-none focus:ring-2 focus:ring-primary">
                            <option>Cell Structure</option>
                            <option>Photosynthesis</option>
                            <option>Genetic Engineering</option>
                        </select>
                        <Icon name="expand_more" className="absolute right-4 top-11 pointer-events-none text-outline" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface">Material Selector</label>
                    <div className="flex flex-wrap gap-2">
                        <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-sm flex items-center gap-1 active:scale-95 transition-transform">
                            <Icon name="article" className="text-[18px]" /> Textbook Ch. 4
                        </button>
                        <button className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-full font-label-sm flex items-center gap-1 hover:bg-surface-container-high active:scale-95 transition-all">
                            <Icon name="link" className="text-[18px]" /> Reference Lab PDF
                        </button>
                        <button className="border border-dashed border-outline-variant px-4 py-2 rounded-full font-label-sm text-primary flex items-center gap-1 hover:bg-primary/5 active:scale-95 transition-all">
                            <Icon name="add" className="text-[18px]" /> Add Material
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end">
                <button 
                    onClick={onNext}
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md shadow-md hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
                >
                    Continue to Questions <Icon name="arrow_forward" />
                </button>
            </div>
        </section>
    );
}
