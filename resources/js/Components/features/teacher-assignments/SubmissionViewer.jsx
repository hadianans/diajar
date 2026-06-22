import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SubmissionViewer({ fileName, imageUrl }) {
    return (
        <section className="lg:col-span-7 flex flex-col gap-stack-md h-full">
            <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col h-[442px] lg:h-[calc(100vh-8rem)]">
                {/* Viewer Header */}
                <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Icon name="description" className="text-primary" />
                        <span className="text-label-md font-label-md truncate text-on-surface">{fileName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors active:scale-95">
                            <Icon name="zoom_in" className="text-on-surface-variant" />
                        </button>
                        <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors active:scale-95">
                            <Icon name="fullscreen" className="text-on-surface-variant" />
                        </button>
                    </div>
                </div>
                
                {/* Viewer Content */}
                <div className="flex-1 bg-surface-dim relative flex items-center justify-center p-stack-md overflow-hidden">
                    <div className="w-full h-full bg-white rounded shadow-lg max-w-2xl mx-auto overflow-auto flex flex-col items-center justify-start p-4">
                        <img 
                            src={imageUrl} 
                            alt="Document Preview" 
                            className="w-full h-auto object-contain"
                            draggable="false"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
