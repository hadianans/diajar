import React, { useRef } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import { showWarning } from '@/utils/swal';

export default function AssignmentAttachmentForm({ attachments = [], onChange, onRemoveExisting }) {
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        
        const currentCount = attachments.length;
        if (currentCount + files.length > 5) {
            showWarning('Limit Reached', "Maximum 5 attachments allowed.");
            return;
        }
        
        const validFiles = files.filter(f => f.size <= 8 * 1024 * 1024).map(f => ({ file: f, title: '', isNew: true }));
        if (validFiles.length < files.length) {
            showWarning('File Too Large', "Some files exceed the 8 MB size limit and were not added.");
        }
        
        onChange([...attachments, ...validFiles]);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachment = (index) => {
        const attachment = attachments[index];
        if (!attachment.isNew && onRemoveExisting) {
            onRemoveExisting(attachment.id);
        }
        const newAttachments = attachments.filter((_, i) => i !== index);
        onChange(newAttachments);
    };

    const handleTitleChange = (index, newTitle) => {
        const newAttachments = [...attachments];
        newAttachments[index].title = newTitle;
        onChange(newAttachments);
    };

    return (
        <section className="space-y-stack-md mt-6">
            <div className="flex items-center gap-2">
                <Icon name="attachment" className="text-primary text-[20px]" />
                <h2 className="font-headline-md text-headline-md text-on-surface">Supporting Files</h2>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
                {attachments.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary shrink-0">
                            <Icon name="description" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                            {item.isNew ? (
                                <input
                                    type="text"
                                    placeholder="Enter a friendly title for this file..."
                                    value={item.title}
                                    onChange={(e) => handleTitleChange(idx, e.target.value)}
                                    className="bg-transparent border-b border-outline-variant/50 focus:border-primary focus:ring-0 px-0 py-1 font-label-md text-label-md text-on-surface w-full"
                                />
                            ) : (
                                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="font-label-md text-label-md text-on-surface truncate hover:text-primary hover:underline transition-colors block">
                                    {item.title || 'Untitled Attachment'}
                                </a>
                            )}
                            <p className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-2">
                                <span className="truncate max-w-[150px] md:max-w-xs">{item.isNew ? item.file.name : item.file_url.split('/').pop()}</span>
                                {item.isNew && item.file.size && (
                                    <>
                                        <span>&bull;</span>
                                        <span>{(item.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    </>
                                )}
                            </p>
                        </div>
                        <button type="button" onClick={() => removeAttachment(idx)} className="p-2 text-error hover:bg-error-container/20 rounded-full transition-colors shrink-0">
                            <Icon name="delete" />
                        </button>
                    </div>
                ))}

                {/* Add Attachment Trigger */}
                {attachments.length < 5 && (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-low transition-all cursor-pointer group"
                    >
                        <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                            <Icon name="upload_file" className="text-primary text-3xl" />
                        </div>
                        <div className="text-center">
                            <p className="font-label-md text-label-md text-on-surface">Click to upload attachments</p>
                            <p className="text-label-sm font-label-sm text-on-surface-variant">Max 8 MB per file, up to 5 files</p>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            multiple 
                            onChange={handleFileUpload} 
                            accept=".pdf,.pptx,.docx,.jpg,.jpeg,.png,.zip"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
