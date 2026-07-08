import React, { useState, useEffect } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import RichTextEditor from '@/Components/shared/editor/RichTextEditor';
import api from '@/utils/api';

export default function AssignmentBasicInfoForm({ formData, onChange, errors = {}, classes = [], chapters = [] }) {
    const handleChange = (field, value) => {
        onChange?.({ ...formData, [field]: value });
    };

    const fieldClass = (field) =>
        `w-full h-12 px-4 bg-surface-container-low border ${errors[field] ? 'border-error' : 'border-transparent'} focus:ring-2 focus:ring-primary rounded-xl text-body-md`;

    return (
        <section className="space-y-stack-md">
            <div className="flex items-center gap-2 mb-2">
                <Icon name="description" className="text-primary text-[20px]" />
                <h2 className="font-headline-md text-headline-md text-on-surface">Assignment Details</h2>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-5">
                {/* Title Input */}
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Assignment Title *</label>
                    <input
                        type="text"
                        className={fieldClass('title')}
                        placeholder="e.g. Creative Writing: The Hero's Journey"
                        value={formData?.title || ''}
                        onChange={e => handleChange('title', e.target.value)}
                    />
                    {errors.title && <p className="text-error text-label-sm">{errors.title}</p>}
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Instructions</label>
                    <RichTextEditor
                        content={formData?.description || ''}
                        onChange={html => handleChange('description', html)}
                        placeholder="Describe the assignment expectations..."
                        error={errors.description}
                        disableMedia={true}
                    />
                    {errors.description && <p className="text-error text-label-sm">{errors.description}</p>}
                </div>

                {/* Class & Chapter Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Class *</label>
                        <select
                            className={fieldClass('class_id') + ' appearance-none'}
                            value={formData?.class_id || ''}
                            onChange={e => handleChange('class_id', e.target.value ? parseInt(e.target.value) : '')}
                        >
                            <option value="">Select Class</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.subject?.subject_name || cls.name || `Class #${cls.id}`}
                                </option>
                            ))}
                        </select>
                        {/* <Icon name="expand_more" className="absolute right-4 top-11 pointer-events-none text-outline" /> */}
                        {errors.class_id && <p className="text-error text-label-sm">{errors.class_id}</p>}
                    </div>
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Chapter *</label>
                        <select
                            className={fieldClass('chapter_id') + ' appearance-none'}
                            value={formData?.chapter_id || ''}
                            onChange={e => handleChange('chapter_id', e.target.value ? parseInt(e.target.value) : '')}
                        >
                            <option value="">Select Chapter</option>
                            {chapters.map(ch => (
                                <option key={ch.id} value={ch.id}>{ch.name}</option>
                            ))}
                        </select>
                        {/* <Icon name="expand_more" className="absolute right-4 top-11 pointer-events-none text-outline" /> */}
                        {errors.chapter_id && <p className="text-error text-label-sm">{errors.chapter_id}</p>}
                    </div>
                </div>

                {/* Due Date & Max Grade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Due Date</label>
                        <input
                            type="datetime-local"
                            className={fieldClass('due_date')}
                            value={formData?.due_date || ''}
                            onChange={e => handleChange('due_date', e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Maximum Grade</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                className={fieldClass('grade')}
                                value={formData?.grade ?? 100}
                                onChange={e => {
                                    let val = parseInt(e.target.value);
                                    if (isNaN(val)) val = '';
                                    else if (val < 1) val = 1;
                                    handleChange('grade', val);
                                }}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-label-sm">points</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
