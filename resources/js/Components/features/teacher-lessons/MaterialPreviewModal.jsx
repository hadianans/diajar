import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
};

export default function MaterialPreviewModal({ show, onClose, formData }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
                    <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Material Preview</h2>
                        <p className="text-label-sm text-on-surface-variant font-label-sm">This is how students will view this material</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" className="text-[24px]" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">{formData.title || 'Untitled Material'}</h1>
                    
                    {formData.description && (
                        <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
                            {formData.description}
                        </p>
                    )}

                    <div className="mt-8">
                        {formData.file_type === 'video' ? (
                            formData.file_url && getYoutubeEmbedUrl(formData.file_url) ? (
                                <div className="relative overflow-hidden rounded-2xl aspect-video bg-black shadow-lg">
                                    <iframe 
                                        className="absolute inset-0 w-full h-full"
                                        src={getYoutubeEmbedUrl(formData.file_url)} 
                                        title="YouTube video player" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="w-full aspect-video bg-surface-container-high rounded-2xl flex flex-col items-center justify-center text-on-surface-variant border border-outline-variant/50">
                                    <Icon name="videocam_off" className="text-4xl mb-2 opacity-50" />
                                    <p className="font-label-md">No valid video URL provided.</p>
                                </div>
                            )
                        ) : (
                            <div className="prose prose-slate max-w-none text-on-surface">
                                {formData.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                                ) : (
                                    <p className="text-on-surface-variant italic">No text content provided yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-on-primary font-label-md rounded-full hover:bg-primary/90 transition-colors active:scale-95 shadow-sm"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
