import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function CurriculumAccordion({ title, materialsCount, children, defaultOpen = true }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
            <button 
                className="w-full flex items-center justify-between p-4 hover:bg-surface-container transition-colors" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <Icon 
                        name="keyboard_arrow_down" 
                        className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`} 
                    />
                    <span className="font-label-md text-label-md text-on-surface">{title}</span>
                </div>
                <span className="text-label-sm font-label-sm text-outline-variant">{materialsCount} Materials</span>
            </button>
            
            <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-4 pb-4 space-y-2">
                    {children}
                    
                    <button className="w-full mt-2 py-2 flex items-center justify-center gap-2 border-2 border-dashed border-outline-variant rounded-lg text-label-md font-label-md text-outline hover:border-primary hover:text-primary transition-colors active:scale-[0.99]">
                        <Icon name="add" />
                        Add material
                    </button>
                </div>
            </div>
        </div>
    );
}
