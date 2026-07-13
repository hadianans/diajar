import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AttachmentList({ attachments = [] }) {
    if (!attachments || attachments.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-outline">Attachments</h3>
                <span className="text-label-sm text-primary font-label-md">{attachments.length} {attachments.length === 1 ? 'File' : 'Files'}</span>
            </div>
            
            <div className="grid gap-3">
                {attachments.map((attachment, idx) => {
                    const isPdf = attachment.type === 'pdf';
                    const iconName = isPdf ? 'picture_as_pdf' : 'image';
                    const iconColorClass = isPdf ? 'text-error' : 'text-secondary';
                    const iconBgClass = isPdf ? 'bg-error-container/20' : 'bg-secondary-container/20';

                    return (
                        <a 
                            key={idx} 
                            href={attachment.url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:border-primary transition-all cursor-pointer group shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 ${iconBgClass} ${iconColorClass} rounded-xl flex items-center justify-center`}>
                                    <Icon name={iconName} />
                                </div>
                                <div>
                                    <div className="font-label-md text-label-md text-on-surface">{attachment.name}</div>
                                    <div className="text-label-sm text-on-surface-variant">{attachment.size} • Added {attachment.date}</div>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary-container/10 transition-all">
                                <Icon name="download" />
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
