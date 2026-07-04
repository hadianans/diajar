import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function CurriculumAccordion({ title, materialsCount, children, defaultOpen = true, onEdit, onDelete, onMoveUp, onMoveDown }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
            <div className="w-full flex items-center justify-between p-4 hover:bg-surface-container transition-colors">
                <button 
                    className="flex flex-1 items-center gap-3 text-left" 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Icon 
                        name="keyboard_arrow_down" 
                        className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`} 
                    />
                    <span className="font-label-md text-label-md text-on-surface">{title}</span>
                </button>
                <div className="flex items-center gap-2 pl-4">
                    <span className="text-label-sm font-label-sm text-outline-variant mr-2">{materialsCount} Materials</span>
                    
                    <div className="flex items-center border border-outline-variant/30 rounded-lg mr-2 overflow-hidden">
                        <button onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }} disabled={!onMoveUp} className="p-1 hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:hover:bg-transparent">
                            <Icon name="keyboard_arrow_up" className="text-[18px]" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }} disabled={!onMoveDown} className="p-1 hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 disabled:hover:bg-transparent">
                            <Icon name="keyboard_arrow_down" className="text-[18px]" />
                        </button>
                    </div>

                    {onEdit && (
                        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1 hover:bg-surface-container-high rounded-full text-on-surface-variant">
                            <Icon name="edit" className="text-[18px]" />
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 hover:bg-error-container/20 rounded-full text-error">
                            <Icon name="delete" className="text-[18px]" />
                        </button>
                    )}
                </div>
            </div>
            
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
