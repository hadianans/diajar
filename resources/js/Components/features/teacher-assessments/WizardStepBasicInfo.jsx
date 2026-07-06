import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function WizardStepBasicInfo({ onNext, formData, onChange, errors = {}, classes = [], chapters = [] }) {
    const handleChange = (field, value) => {
        onChange?.({ ...formData, [field]: value });
    };

    return (
        <section className="space-y-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Step 1: Basic Information</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">Establish the core framework of your assessment.</p>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm space-y-stack-md">
                {/* Title */}
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface">Assessment Title <span className="text-error">*</span></label>
                    <input
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary"
                        placeholder="e.g. Biology Midterm"
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                    {errors.title && <p className="text-error text-label-sm">{errors.title[0]}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface">Description (Optional)</label>
                    <textarea
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md h-24 resize-none focus:ring-2 focus:ring-primary"
                        placeholder="Outline the learning objectives..."
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                    ></textarea>
                </div>

                {/* Class & Chapter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface">Class <span className="text-error">*</span></label>
                        <select
                            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md appearance-none focus:ring-2 focus:ring-primary"
                            value={formData.class_id || ''}
                            onChange={(e) => handleChange('class_id', e.target.value)}
                        >
                            <option value="">Select a class...</option>
                            {(classes || []).map(c => (
                                <option key={c.id} value={c.id}>{c.subject?.subject_name || `Class ${c.id}`} — {c.group_year?.student_group?.name || ''}</option>
                            ))}
                        </select>
                        {/* <Icon name="expand_more" className="absolute right-4 top-11 pointer-events-none text-outline" /> */}
                        {errors.class_id && <p className="text-error text-label-sm">{errors.class_id[0]}</p>}
                    </div>
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface">Chapter <span className="text-error">*</span></label>
                        <select
                            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md appearance-none focus:ring-2 focus:ring-primary"
                            value={formData.chapter_id || ''}
                            onChange={(e) => handleChange('chapter_id', e.target.value)}
                        >
                            <option value="">Select a chapter...</option>
                            {(chapters || []).map(ch => (
                                <option key={ch.id} value={ch.id}>{ch.name}</option>
                            ))}
                        </select>
                        {/* <Icon name="expand_more" className="absolute right-4 top-11 pointer-events-none text-outline" /> */}
                        {errors.chapter_id && <p className="text-error text-label-sm">{errors.chapter_id[0]}</p>}
                    </div>
                </div>

                {/* Duration & Max Attempts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <div className="space-y-2 relative">
                        <label className="font-label-md text-label-md text-on-surface">Duration <span className="text-error">*</span></label>
                        <div className="relative">
                            <input
                                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary"
                                type="number"
                                min="1"
                                value={formData.duration || ''}
                                onChange={(e) => handleChange('duration', e.target.value)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-outline">mins</span>
                        </div>
                        {errors.duration && <p className="text-error text-label-sm">{errors.duration[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface">Max Attempts <span className="text-error">*</span></label>
                        <input
                            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary"
                            type="number"
                            min="1"
                            value={formData.max_attempts || ''}
                            onChange={(e) => handleChange('max_attempts', e.target.value)}
                        />
                        {errors.max_attempts && <p className="text-error text-label-sm">{errors.max_attempts[0]}</p>}
                    </div>
                </div>

                {/* Dates & Pass Threshold */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface">Start Date</label>
                        <input
                            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary"
                            type="datetime-local"
                            value={formData.start_date || ''}
                            onChange={(e) => handleChange('start_date', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface">Due Date</label>
                        <input
                            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary"
                            type="datetime-local"
                            value={formData.due_date || ''}
                            onChange={(e) => handleChange('due_date', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface">Pass Threshold <span className="text-error">*</span></label>
                        <div className="relative">
                            <input
                                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-body-md focus:ring-2 focus:ring-primary"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.pass_threshold || ''}
                                onChange={(e) => handleChange('pass_threshold', e.target.value)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-outline">%</span>
                        </div>
                        {errors.pass_threshold && <p className="text-error text-label-sm">{errors.pass_threshold[0]}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onNext}
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md shadow-md hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
                >
                    Continue to Questions <Icon name="arrow_forward" />
                </button>
            </div>
        </section>
    );
}
