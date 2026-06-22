import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssignmentBasicInfoForm() {
    return (
        <section className="space-y-stack-md">
            <div className="flex items-center gap-2 mb-2">
                <Icon name="description" className="text-primary text-[20px]" />
                <h2 className="font-headline-md text-headline-md text-on-surface">Assignment Details</h2>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-5">
                {/* Title Input */}
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Assignment Title *</label>
                    <input 
                        type="text" 
                        className="w-full h-12 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-body-md placeholder:text-outline" 
                        placeholder="e.g. Creative Writing: The Hero's Journey" 
                    />
                </div>
                
                {/* Description (Rich Text Simulation) */}
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Instructions</label>
                    <div className="min-h-[120px] border border-outline-variant rounded-2xl bg-surface-container-low p-4 focus-within:ring-2 focus-within:ring-primary transition-all">
                        <div className="flex gap-4 border-b border-outline-variant pb-2 mb-3">
                            <Icon name="format_bold" className="text-outline cursor-pointer hover:text-primary" />
                            <Icon name="format_italic" className="text-outline cursor-pointer hover:text-primary" />
                            <Icon name="format_list_bulleted" className="text-outline cursor-pointer hover:text-primary" />
                            <Icon name="link" className="text-outline cursor-pointer hover:text-primary" />
                        </div>
                        <div 
                            className="outline-none text-body-md text-on-surface min-h-[80px]" 
                            contentEditable="true" 
                            data-placeholder="Describe the assignment expectations..."
                        ></div>
                    </div>
                </div>

                {/* Chapter & Material Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Chapter</label>
                        <select className="w-full h-12 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-body-md appearance-none">
                            <option>Select Chapter</option>
                            <option>Chapter 1: Introduction</option>
                            <option>Chapter 2: Narrative Arc</option>
                        </select>
                        <Icon name="expand_more" className="absolute right-4 top-11 pointer-events-none text-outline" />
                    </div>
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Reference Material</label>
                        <select className="w-full h-12 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-body-md appearance-none">
                            <option>Optional Material</option>
                            <option>The Odyssey PDF</option>
                            <option>Archetypes Video</option>
                        </select>
                        <Icon name="expand_more" className="absolute right-4 top-11 pointer-events-none text-outline" />
                    </div>
                </div>

                {/* Max Grade */}
                <div className="space-y-2 w-full md:w-1/3">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Maximum Grade</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            className="w-full h-12 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-body-md" 
                            defaultValue="100" 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-label-sm">points</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
