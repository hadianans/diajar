import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SubmissionArea({ onUpload, onAddUrl, onSubmit }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section 
            className={`bg-white border-2 border-dashed ${isHovered ? 'border-primary' : 'border-primary-fixed'} rounded-2xl p-6 text-center space-y-4 transition-colors`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="mx-auto w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center">
                <Icon name="upload_file" className="text-primary text-3xl" />
            </div>
            
            <div className="space-y-1">
                <h4 className="font-headline-md text-headline-md text-on-surface">Submit Your Work</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant">PDF, DOCX or ZIP allowed (Max 50MB)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={onUpload}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
                >
                    <Icon name="attach_file" className="text-[20px]" />
                    Upload
                </button>
                <button 
                    onClick={onAddUrl}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
                >
                    <Icon name="link" className="text-[20px]" />
                    Add URL
                </button>
            </div>
            
            <button 
                onClick={onSubmit}
                className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-200"
            >
                Submit Assignment
            </button>
        </section>
    );
}
