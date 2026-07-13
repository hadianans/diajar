import React, { useRef } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import RichTextEditor from '@/Components/shared/editor/RichTextEditor';
import { getFileDetails } from '@/utils/getFileDetails';
import { showWarning } from '@/utils/swal';

const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
};

export default function LessonForm({ formData, onChange, errors = {}, chapters = [], subchapters = [] }) {
    const fileInputRef = useRef(null);
    const coreFileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        
        const currentCount = (formData.attachments?.length || 0) + (formData.existing_attachments?.length || 0);
        if (currentCount + files.length > 3) {
            showWarning('Limit Reached', "Maximum 3 attachments allowed.");
            return;
        }
        
        const validFiles = files.filter(f => f.size <= 8 * 1024 * 1024).map(f => ({ file: f, title: '' }));
        if (validFiles.length < files.length) {
            showWarning('File Too Large', "Some files exceed the 8 MB size limit and were not added.");
        }
        
        onChange({
            ...formData,
            attachments: [...(formData.attachments || []), ...validFiles]
        });
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCoreFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 25 * 1024 * 1024) {
            showWarning('File Too Large', "Maximum file size is 25 MB.");
            return;
        }

        onChange({
            ...formData,
            core_file: file,
            file_url: '', // Clear fallback URL if file is uploaded
            content: '',  // Clear fallback content if file is uploaded
        });

        if (coreFileInputRef.current) {
            coreFileInputRef.current.value = '';
        }
    };

    const removeAttachment = (index) => {
        const newAttachments = (formData.attachments || []).filter((_, i) => i !== index);
        onChange({ ...formData, attachments: newAttachments });
    };

    const handleAttachmentTitleChange = (index, newTitle) => {
        const newAttachments = [...(formData.attachments || [])];
        newAttachments[index].title = newTitle;
        onChange({ ...formData, attachments: newAttachments });
    };

    const handleTypeChange = (type) => {
        onChange({ ...formData, file_type: type });
    };

    return (
        <div className="space-y-stack-lg mb-stack-lg">
            {/* Section 1: Metadata */}
            <section className="space-y-stack-lg">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md">
                    <div className="md:col-span-8">
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Material Title *</label>
                        <input
                            className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-lg font-body-lg focus:ring-2 focus:ring-primary shadow-sm ${errors.title ? 'ring-2 ring-error' : ''}`}
                            placeholder="e.g. Introduction to Cellular Respiration"
                            type="text"
                            value={formData.title}
                            onChange={(e) => onChange({ ...formData, title: e.target.value })}
                        />
                        {errors.title && <p className="text-error text-xs mt-1">{errors.title[0]}</p>}
                    </div>

                    <div className="md:col-span-4">
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Order Position</label>
                        <input
                            className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md focus:ring-2 focus:ring-primary shadow-sm ${errors.order ? 'ring-2 ring-error' : ''}`}
                            type="number"
                            value={formData.order}
                            onChange={(e) => onChange({ ...formData, order: e.target.value })}
                        />
                        {errors.order && <p className="text-error text-xs mt-1">{errors.order[0]}</p>}
                    </div>

                    <div className="md:col-span-12">
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Description (Optional)</label>
                        <textarea
                            className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md focus:ring-2 focus:ring-primary shadow-sm resize-none ${errors.description ? 'ring-2 ring-error' : ''}`}
                            placeholder="Brief overview of the material content..."
                            rows="2"
                            value={formData.description}
                            onChange={(e) => onChange({ ...formData, description: e.target.value })}
                        ></textarea>
                        {errors.description && <p className="text-error text-xs mt-1">{errors.description[0]}</p>}
                    </div>

                    <div className="md:col-span-4">
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Chapter *</label>
                        <div className="relative">
                            <select
                                className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md appearance-none focus:ring-2 focus:ring-primary shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${errors.chapter_id ? 'ring-2 ring-error' : ''}`}
                                value={formData.chapter_id}
                                onChange={(e) => onChange({ ...formData, chapter_id: e.target.value, subchapter_id: '' })}
                                disabled
                            >
                                <option value="" disabled>Select a Chapter</option>
                                {chapters.map(ch => (
                                    <option key={ch.id} value={ch.id}>{ch.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors.chapter_id && <p className="text-error text-xs mt-1">{errors.chapter_id[0]}</p>}
                    </div>

                    <div className="md:col-span-4">
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Subchapter (Optional)</label>
                        <div className="relative">
                            <select
                                className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md appearance-none focus:ring-2 focus:ring-primary shadow-sm ${errors.subchapter_id ? 'ring-2 ring-error' : ''}`}
                                value={formData.subchapter_id || ''}
                                onChange={(e) => onChange({ ...formData, subchapter_id: e.target.value })}
                                disabled={!formData.chapter_id}
                            >
                                <option value="">None (General Material)</option>
                                {subchapters.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors.subchapter_id && <p className="text-error text-xs mt-1">{errors.subchapter_id[0]}</p>}
                    </div>

                    <div className="md:col-span-4">
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Estimated Minutes</label>
                        <input
                            className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md focus:ring-2 focus:ring-primary shadow-sm ${errors.duration_minutes ? 'ring-2 ring-error' : ''}`}
                            type="number"
                            value={formData.duration_minutes}
                            onChange={(e) => onChange({ ...formData, duration_minutes: e.target.value })}
                        />
                        {errors.duration_minutes && <p className="text-error text-xs mt-1">{errors.duration_minutes[0]}</p>}
                    </div>
                </div>
            </section>

            {/* Section 2: Content Toggle (Segmented Control) */}
            <section className="mb-stack-lg">
                <div className="text-center mb-3">
                    <p className="text-label-md font-label-md text-on-surface-variant">
                        Select the primary material type. You can only provide one type of content per material (Video OR Text).
                    </p>
                </div>
                <div className="bg-surface-container-high p-1.5 rounded-full flex items-center max-w-sm mx-auto shadow-inner">
                    <button
                        type="button"
                        onClick={() => handleTypeChange('video')}
                        className={`flex-1 py-2.5 rounded-full font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-2 ${formData.file_type === 'video' ? 'bg-surface-container-lowest text-primary shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)]' : 'text-on-surface-variant'}`}
                    >
                        <Icon name="videocam" className="text-[20px]" />
                        Video
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeChange('text')}
                        className={`flex-1 py-2.5 rounded-full font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-2 ${formData.file_type === 'text' ? 'bg-surface-container-lowest text-primary shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)]' : 'text-on-surface-variant'}`}
                    >
                        <Icon name="article" className="text-[20px]" />
                        Text Content
                    </button>
                </div>
            </section>

            {/* Section 3: Video Input */}
            {formData.file_type === 'video' && (
                <section className="space-y-stack-md animate-in fade-in duration-300">
                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                        <h3 className="font-label-lg mb-4 text-on-surface">Video Source</h3>
                        
                        {/* Primary: File Upload */}
                        <div className="mb-6">
                            <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Upload Video File</label>
                            {formData.core_file ? (
                                <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-xl bg-surface-container-low">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <Icon name="movie" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-md truncate">{formData.core_file.name}</p>
                                        <p className="text-label-sm text-on-surface-variant">{(formData.core_file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <button type="button" onClick={() => onChange({ ...formData, core_file: null })} className="p-2 text-error hover:bg-error-container/50 rounded-full transition-colors">
                                        <Icon name="delete" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => coreFileInputRef.current?.click()}
                                    className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low cursor-pointer transition-all group"
                                >
                                    <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                                        <Icon name="cloud_upload" className="text-primary text-3xl" />
                                    </div>
                                    <p className="font-label-md text-on-surface mt-2">Click to upload video file</p>
                                    <p className="text-label-sm text-on-surface-variant">Max 25 MB (.mp4, .webm)</p>
                                </div>
                            )}
                            {errors.core_file && <p className="text-error text-xs mt-1">{errors.core_file[0]}</p>}
                        </div>

                        {!formData.core_file && (
                            <>
                                <div className="relative flex items-center justify-center my-6">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
                                    <span className="relative bg-surface-container-lowest px-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">OR USE A LINK</span>
                                </div>

                                {/* Fallback: URL */}
                                <div>
                                    <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Use YouTube URL</label>
                                    <div className="relative w-full">
                                        <Icon name="link" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                                        <input
                                            className={`w-full bg-surface-container-low border-none rounded-xl py-3 pl-12 pr-5 text-body-md font-body-md focus:ring-2 focus:ring-primary ${errors.file_url ? 'ring-2 ring-error' : ''}`}
                                            placeholder="https://youtube.com/..."
                                            type="text"
                                            value={formData.file_url || ''}
                                            onChange={(e) => onChange({ ...formData, file_url: e.target.value })}
                                        />
                                    </div>
                                    {errors.file_url && <p className="text-error text-xs mt-1">{errors.file_url[0]}</p>}
                                </div>
                            </>
                        )}

                        {/* Video Preview */}
                        {formData.file_url && getYoutubeEmbedUrl(formData.file_url) && (
                            <div className="mt-stack-lg relative overflow-hidden rounded-2xl aspect-video bg-surface-container shadow-lg">
                                <iframe 
                                    className="absolute inset-0 w-full h-full"
                                    src={getYoutubeEmbedUrl(formData.file_url)} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        {/* Native Video Preview if direct file is uploaded or linked */}
                        {((formData.file_url && !getYoutubeEmbedUrl(formData.file_url) && formData.file_url.endsWith('.mp4')) || formData.core_file) && (
                            <div className="mt-stack-lg relative overflow-hidden rounded-2xl aspect-video bg-surface-container shadow-lg">
                                <video 
                                    controls 
                                    className="absolute inset-0 w-full h-full"
                                    src={formData.core_file ? URL.createObjectURL(formData.core_file) : formData.file_url}
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Section 4: Rich Text Editor / Document Upload */}
            {formData.file_type === 'text' && (
                <section className="space-y-stack-md animate-in fade-in duration-300">
                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm mb-4">
                        <h3 className="font-label-lg mb-4 text-on-surface">Document Source</h3>
                        
                        {/* Primary: File Upload */}
                        <div className="mb-2">
                            <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Upload Document</label>
                            {formData.core_file ? (
                                <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-xl bg-surface-container-low">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <Icon name="description" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-md truncate">{formData.core_file.name}</p>
                                        <p className="text-label-sm text-on-surface-variant">{(formData.core_file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <button type="button" onClick={() => onChange({ ...formData, core_file: null })} className="p-2 text-error hover:bg-error-container/50 rounded-full transition-colors">
                                        <Icon name="delete" />
                                    </button>
                                </div>
                            ) : formData.file_url && !formData.core_file ? (
                                <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-xl bg-surface-container-low">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <Icon name="description" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-md truncate">Existing Document (Uploaded)</p>
                                        <a href={formData.file_url} target="_blank" rel="noreferrer" className="text-primary text-label-sm hover:underline">View Document</a>
                                    </div>
                                    <button type="button" onClick={() => onChange({ ...formData, file_url: '' })} className="p-2 text-error hover:bg-error-container/50 rounded-full transition-colors">
                                        <Icon name="delete" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => coreFileInputRef.current?.click()}
                                    className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low cursor-pointer transition-all group"
                                >
                                    <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                                        <Icon name="cloud_upload" className="text-primary text-3xl" />
                                    </div>
                                    <p className="font-label-md text-on-surface mt-2">Click to upload document</p>
                                    <p className="text-label-sm text-on-surface-variant">Max 25 MB (.pdf, .docx, .pptx)</p>
                                </div>
                            )}
                            {errors.core_file && <p className="text-error text-xs mt-1">{errors.core_file[0]}</p>}
                        </div>

                        {!formData.core_file && !formData.file_url && (
                            <>
                                <div className="relative flex items-center justify-center my-6">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
                                    <span className="relative bg-surface-container-lowest px-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">OR WRITE DIRECTLY</span>
                                </div>

                                <RichTextEditor
                                    content={formData.content || ''}
                                    onChange={(html) => onChange({ ...formData, content: html })}
                                    error={errors.content}
                                    placeholder="Start writing your lesson content here..."
                                />
                                {errors.content && <p className="text-error text-xs mt-1">{errors.content[0]}</p>}
                            </>
                        )}
                    </div>
                </section>
            )}

            {/* Section 5: Attachments */}
            <section className="mt-stack-lg space-y-stack-md">
                <h3 className="font-headline-md text-headline-md text-on-surface">Supporting Materials</h3>
                <div className="space-y-stack-sm">
                    {/* Existing Attachments */}
                    {formData.existing_attachments && formData.existing_attachments.map((item) => {
                        const details = getFileDetails(item.file_url);
                        return (
                            <div key={`existing-${item.id}`} className="flex items-center gap-4 p-4 bg-surface border border-outline-variant rounded-2xl shadow-sm">
                                <div className={`w-12 h-12 ${details.bgClass} rounded-xl flex items-center justify-center ${details.textClass} shrink-0`}>
                                    <Icon name={details.icon} />
                                </div>
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                <p className="font-label-md text-label-md text-on-surface truncate" title={item.title || 'Attachment'}>{item.title || 'Attachment'}</p>
                                <a href={item.file_url} target="_blank" rel="noreferrer" className="text-label-sm font-label-sm text-primary hover:underline flex items-center gap-1 w-max">
                                    <Icon name="open_in_new" className="text-[12px]" />
                                    View File
                                </a>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => {
                                    const newExisting = formData.existing_attachments.filter(a => a.id !== item.id);
                                    const newDeleted = [...(formData.deleted_attachments || []), item.id];
                                    onChange({ ...formData, existing_attachments: newExisting, deleted_attachments: newDeleted });
                                }} 
                                className="p-2 text-error hover:bg-error-container/20 rounded-full transition-colors shrink-0"
                                title="Delete existing attachment"
                            >
                                <Icon name="delete" />
                            </button>
                        </div>
                        );
                    })}

                    {/* New Attachments */}
                    {formData.attachments && formData.attachments.map((item, idx) => {
                        const details = getFileDetails(item.file.name);
                        return (
                            <div key={`new-${idx}`} className="flex items-center gap-4 p-4 bg-surface border border-outline-variant rounded-2xl shadow-sm">
                                <div className={`w-12 h-12 ${details.bgClass} rounded-xl flex items-center justify-center ${details.textClass} shrink-0`}>
                                    <Icon name={details.icon} />
                                </div>
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                    <input
                                        type="text"
                                        placeholder="Enter a friendly title for this file..."
                                        value={item.title}
                                        onChange={(e) => handleAttachmentTitleChange(idx, e.target.value)}
                                        className="bg-transparent border-b border-outline-variant/50 focus:border-primary focus:ring-0 px-0 py-1 font-label-md text-label-md text-on-surface w-full"
                                    />
                                    <p className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-2">
                                        <span className="truncate max-w-[150px] md:max-w-xs">{item.file.name}</span>
                                        <span>&bull;</span>
                                        <span>{item.file.size ? (item.file.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}</span>
                                    </p>
                                </div>
                                <button type="button" onClick={() => removeAttachment(idx)} className="p-2 text-error hover:bg-error-container/20 rounded-full transition-colors shrink-0">
                                    <Icon name="delete" />
                                </button>
                            </div>
                        );
                    })}

                    {/* Add Attachment Trigger */}
                    {((formData.attachments?.length || 0) + (formData.existing_attachments?.length || 0) < 3) && (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-low transition-all cursor-pointer group"
                        >
                            <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                                <Icon name="upload_file" className="text-primary text-3xl" />
                            </div>
                            <div className="text-center">
                                <p className="font-label-md text-label-md text-on-surface">Click to upload attachments</p>
                                <p className="text-label-sm font-label-sm text-on-surface-variant">Max 8 MB per file, up to 3 files</p>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                multiple 
                                onChange={handleFileUpload} 
                                accept=".pdf,.pptx,.docx,.jpg,.jpeg,.png"
                            />
                        </div>
                    )}
                </div>
            </section>
            
            {/* Hidden Input for Core File */}
            <input 
                type="file" 
                ref={coreFileInputRef} 
                className="hidden" 
                onChange={handleCoreFileUpload} 
                accept={formData.file_type === 'video' ? 'video/mp4,video/webm' : '.pdf,.doc,.docx,.ppt,.pptx'}
            />
        </div>
    );
}
