import React from 'react';
import Icon from '@/Components/shared/ui/Icon';
import { router } from '@inertiajs/react';

export default function FloatingActionBar({ onAddSubchapter, onAddMaterial, onAddTask }) {
    
    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-max px-4">
            <div className="bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-6 backdrop-blur-md bg-opacity-95">
                <button 
                    onClick={onAddSubchapter}
                    className="flex items-center gap-2 hover:text-secondary-fixed transition-colors"
                >
                    <Icon name="create_new_folder" className="text-[20px]" />
                    <span className="text-label-sm font-label-sm">Subchapter</span>
                </button>
                
                <div className="w-px h-4 bg-outline-variant opacity-30"></div>
                
                <button 
                    onClick={onAddMaterial}
                    className="flex items-center gap-2 hover:text-secondary-fixed transition-colors"
                >
                    <Icon name="note_add" className="text-[20px]" />
                    <span className="text-label-sm font-label-sm">Material</span>
                </button>
                
                <div className="w-px h-4 bg-outline-variant opacity-30"></div>
                
                <button 
                    onClick={onAddTask}
                    className="flex items-center gap-2 hover:text-secondary-fixed transition-colors"
                >
                    <Icon name="add_task" className="text-[20px]" />
                    <span className="text-label-sm font-label-sm">Task</span>
                </button>
            </div>
        </div>
    );
}
