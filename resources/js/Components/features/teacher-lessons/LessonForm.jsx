import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonForm({ formData, onChange, errors = {}, chapters = [], subchapters = [] }) {
    const handleTypeChange = (type) => {
        onChange({ ...formData, type });
    };

    return (
        <div className="space-y-stack-lg mb-stack-lg">
            {/* Section 1: Metadata */}
            <section className="space-y-stack-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <div className="md:col-span-2">
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
                    
                    <div className="md:col-span-2">
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Description (Optional)</label>
                        <textarea 
                            className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md focus:ring-2 focus:ring-primary shadow-sm resize-none ${errors.description ? 'ring-2 ring-error' : ''}`}
                            placeholder="Brief overview of the material content..." 
                            rows="3"
                            value={formData.description}
                            onChange={(e) => onChange({ ...formData, description: e.target.value })}
                        ></textarea>
                        {errors.description && <p className="text-error text-xs mt-1">{errors.description[0]}</p>}
                    </div>
                    
                    <div>
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Chapter *</label>
                        <div className="relative">
                            <select 
                                className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md appearance-none focus:ring-2 focus:ring-primary shadow-sm ${errors.chapter_id ? 'ring-2 ring-error' : ''}`}
                                value={formData.chapter_id}
                                onChange={(e) => onChange({ ...formData, chapter_id: e.target.value, subchapter_id: '' })}
                            >
                                <option value="" disabled>Select a Chapter</option>
                                {chapters.map(ch => (
                                    <option key={ch.id} value={ch.id}>{ch.name}</option>
                                ))}
                            </select>
                            <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                        </div>
                        {errors.chapter_id && <p className="text-error text-xs mt-1">{errors.chapter_id[0]}</p>}
                    </div>

                    <div>
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
                            <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
                        </div>
                        {errors.subchapter_id && <p className="text-error text-xs mt-1">{errors.subchapter_id[0]}</p>}
                    </div>
                    
                    <div>
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Order Position</label>
                        <input 
                            className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md focus:ring-2 focus:ring-primary shadow-sm ${errors.order ? 'ring-2 ring-error' : ''}`}
                            type="number" 
                            value={formData.order}
                            onChange={(e) => onChange({ ...formData, order: e.target.value })}
                        />
                        {errors.order && <p className="text-error text-xs mt-1">{errors.order[0]}</p>}
                    </div>

                    <div>
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Estimated Minutes</label>
                        <input 
                            className={`w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-body-md font-body-md focus:ring-2 focus:ring-primary shadow-sm ${errors.estimated_minutes ? 'ring-2 ring-error' : ''}`}
                            type="number" 
                            value={formData.estimated_minutes}
                            onChange={(e) => onChange({ ...formData, estimated_minutes: e.target.value })}
                        />
                        {errors.estimated_minutes && <p className="text-error text-xs mt-1">{errors.estimated_minutes[0]}</p>}
                    </div>
                </div>
            </section>

            {/* Section 2: Content Toggle (Segmented Control) */}
            <section className="mb-stack-lg">
                <div className="bg-surface-container-high p-1.5 rounded-full flex items-center max-w-sm mx-auto shadow-inner">
                    <button 
                        type="button"
                        onClick={() => handleTypeChange('video')}
                        className={`flex-1 py-2.5 rounded-full font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-2 ${formData.type === 'video' ? 'bg-white text-primary shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)]' : 'text-on-surface-variant'}`}
                    >
                        <Icon name="videocam" className="text-[20px]" />
                        Video
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleTypeChange('text')}
                        className={`flex-1 py-2.5 rounded-full font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-2 ${formData.type === 'text' ? 'bg-white text-primary shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)]' : 'text-on-surface-variant'}`}
                    >
                        <Icon name="article" className="text-[20px]" />
                        Text Content
                    </button>
                </div>
            </section>

            {/* Section 3: Video Input */}
            {formData.type === 'video' && (
                <section className="space-y-stack-md animate-in fade-in duration-300">
                    <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
                        <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">Video URL Source</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Icon name="link" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                                <input 
                                    className={`w-full bg-surface-container-low border-none rounded-xl py-3 pl-12 pr-5 text-body-md font-body-md focus:ring-2 focus:ring-primary ${errors.video_url ? 'ring-2 ring-error' : ''}`}
                                    placeholder="https://youtube.com/..." 
                                    type="text" 
                                    value={formData.video_url || ''}
                                    onChange={(e) => onChange({ ...formData, video_url: e.target.value })}
                                />
                            </div>
                            <button type="button" className="bg-surface-container-highest px-4 py-3 rounded-xl hover:bg-surface-variant transition-colors">
                                <Icon name="sync" className="text-primary" />
                            </button>
                        </div>
                        {errors.video_url && <p className="text-error text-xs mt-1">{errors.video_url[0]}</p>}
                        <p className="mt-2 text-label-sm font-label-sm text-on-surface-variant">Supported: YouTube, Vimeo, Loom, or direct .mp4 links.</p>
                        
                        {/* Thumbnail Preview */}
                        {formData.video_url && (
                        <div className="mt-stack-lg group relative overflow-hidden rounded-2xl aspect-video bg-surface-container shadow-lg">
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <div 
                                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZpUhVq2rqVa5N9EzDYR8-gpyPYG28wC98D6v_LiqgO1yYtgh21dI-N9X5owOzCjM2enMORECdB4fr-uc20ZwHs9ln4e6cGBGn7F-1wIXetLJm0BRS_MMwI9C74Hx106LAEssGyqMsjg4gVYnq-NDJCuCu_x1s4ko4aVek9KPTM8hJIW8cL7hW6lwltbPqO90RU3Djkm9Fg1_T8D_9BQcYuFRXX_k0GfVtTKRysw31JF9UYwD0CZLtdB687TyxEXGKfHoeoNCTF3o')` }}
                                ></div>
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl active:scale-95 transition-transform cursor-pointer">
                                    <Icon name="play_arrow" className="text-primary text-[40px]" filled={true} />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                <span className="bg-black/60 text-white px-3 py-1 rounded-md text-label-sm font-label-sm backdrop-blur-sm">Preview</span>
                                <button type="button" className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors">
                                    <Icon name="photo_camera" />
                                </button>
                            </div>
                        </div>
                        )}
                    </div>
                </section>
            )}

            {/* Section 4: Text Input */}
            {formData.type === 'text' && (
                <section className="space-y-stack-md animate-in fade-in duration-300">
                    <div className={`bg-white rounded-2xl border ${errors.content ? 'border-error' : 'border-outline-variant'} shadow-sm overflow-hidden flex flex-col min-h-[400px]`}>
                        {/* Toolbar */}
                        <div className="bg-surface-container-low p-2 border-b border-outline-variant flex flex-wrap gap-1">
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"><Icon name="format_bold" /></button>
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"><Icon name="format_italic" /></button>
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"><Icon name="format_list_bulleted" /></button>
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"><Icon name="format_list_numbered" /></button>
                            <div className="w-px h-8 bg-outline-variant mx-1"></div>
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"><Icon name="link" /></button>
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"><Icon name="image" /></button>
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"><Icon name="code" /></button>
                            <div className="w-px h-8 bg-outline-variant mx-1"></div>
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant ml-auto"><Icon name="undo" /></button>
                            <button type="button" className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"><Icon name="redo" /></button>
                        </div>
                        {/* Editor Area */}
                        <textarea 
                            className="flex-1 w-full border-none p-6 font-body-md text-body-md focus:ring-0 resize-none min-h-[300px]" 
                            placeholder="Start typing your educational content here... Use the toolbar for formatting."
                            value={formData.content || ''}
                            onChange={(e) => onChange({ ...formData, content: e.target.value })}
                        ></textarea>
                    </div>
                    {errors.content && <p className="text-error text-xs mt-1">{errors.content[0]}</p>}
                </section>
            )}

            {/* Section 5: Attachments */}
            <section className="mt-stack-lg space-y-stack-md">
                <h3 className="font-headline-md text-headline-md text-on-surface">Supporting Materials</h3>
                <div className="space-y-stack-sm">
                    {/* Attachment Example */}
                    {initialData.attachments && initialData.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-outline-variant rounded-2xl shadow-sm">
                            <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary">
                                <Icon name="description" />
                            </div>
                            <div className="flex-1">
                                <p className="font-label-md text-label-md text-on-surface">{file.name}</p>
                                <p className="text-label-sm font-label-sm text-on-surface-variant">{file.type} • {file.size}</p>
                            </div>
                            <button type="button" className="p-2 text-error hover:bg-error-container/20 rounded-full transition-colors">
                                <Icon name="delete" />
                            </button>
                        </div>
                    ))}
                    
                    {/* Add Attachment Trigger */}
                    <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-low transition-all cursor-pointer group">
                        <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                            <Icon name="upload_file" className="text-primary text-3xl" />
                        </div>
                        <div className="text-center">
                            <p className="font-label-md text-label-md text-on-surface">Click to upload or drag and drop</p>
                            <p className="text-label-sm font-label-sm text-on-surface-variant">PDF, PPTX, DOCX, or JPG (max 25MB each)</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
