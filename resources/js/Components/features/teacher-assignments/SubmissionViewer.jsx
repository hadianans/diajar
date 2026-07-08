import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SubmissionViewer({ fileName, pathUrl }) {
    const isImage = pathUrl && pathUrl.match(/\.(jpeg|jpg|gif|png)$/i);
    const isPdf = pathUrl && pathUrl.endsWith('.pdf');
    const isExternalLink = pathUrl && pathUrl.startsWith('http') && !pathUrl.includes('/storage/');

    return (
        <section className="lg:col-span-7 flex flex-col gap-stack-md h-full">
            <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col h-[442px] lg:h-[calc(100vh-8rem)]">
                {/* Viewer Header */}
                <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Icon name={isExternalLink ? "link" : "description"} className="text-primary" />
                        <span className="text-label-md font-label-md truncate text-on-surface">{fileName || "Submission"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {pathUrl && !isExternalLink && (
                            <a href={pathUrl} download className="p-2 hover:bg-surface-container-highest rounded-full transition-colors active:scale-95 text-on-surface-variant flex items-center gap-1 font-label-sm">
                                <Icon name="download" className="text-[18px]" />
                                Download
                            </a>
                        )}
                        <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors active:scale-95 hidden sm:flex">
                            <Icon name="zoom_in" className="text-on-surface-variant" />
                        </button>
                        <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors active:scale-95 hidden sm:flex">
                            <Icon name="fullscreen" className="text-on-surface-variant" />
                        </button>
                    </div>
                </div>
                
                {/* Viewer Content */}
                <div className="flex-1 bg-surface-dim relative flex items-center justify-center p-stack-md overflow-hidden">
                    {!pathUrl ? (
                        <div className="flex flex-col items-center justify-center text-outline opacity-50 space-y-4">
                            <Icon name="hide_source" className="text-4xl" />
                            <p>No file or link submitted.</p>
                        </div>
                    ) : isExternalLink ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Icon name="link" className="text-3xl" />
                            </div>
                            <p className="text-on-surface-variant">The student submitted an external link.</p>
                            <a href={pathUrl} target="_blank" rel="noreferrer" className="px-6 py-2 bg-primary text-on-primary rounded-full font-label-md hover:bg-primary/90 transition-colors">
                                Open Link
                            </a>
                        </div>
                    ) : isImage ? (
                        <div className="w-full h-full bg-white rounded shadow-lg max-w-2xl mx-auto overflow-auto flex flex-col items-center justify-start p-4">
                            <img 
                                src={pathUrl} 
                                alt="Document Preview" 
                                className="w-full h-auto object-contain"
                                draggable="false"
                            />
                        </div>
                    ) : isPdf ? (
                        <iframe src={pathUrl} className="w-full h-full bg-white rounded shadow-lg border-none" title="Submission Preview" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Icon name="description" className="text-3xl" />
                            </div>
                            <p className="text-on-surface-variant max-w-sm">Preview is not available for this file type. Please download to view.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
