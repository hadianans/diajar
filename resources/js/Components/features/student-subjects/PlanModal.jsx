import React, { useState, useEffect } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';

export default function PlanModal({ show, onClose, item, itemType = 'App\\Models\\Material', classId, chapterId, existingPlan }) {
    const [title, setTitle] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show && item) {
            if (existingPlan) {
                setTitle(existingPlan.title || '');
                setTargetDate(existingPlan.target_date ? existingPlan.target_date.split('T')[0] : '');
                setDescription(existingPlan.description || '');
            } else {
                const prefix = itemType === 'App\\Models\\Material' ? 'Study' : 
                               itemType === 'App\\Models\\ClassAssignment' ? 'Submit' : 'Take';
                setTitle(`${prefix}: ${item.title}`);
                // Default target date to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setTargetDate(tomorrow.toISOString().split('T')[0]);
                setDescription('');
            }
            setErrors({});
        }
    }, [show, item, itemType, existingPlan]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            if (existingPlan) {
                await api.put(`/plans/${existingPlan.id}`, {
                    title,
                    target_date: targetDate,
                    description,
                });
            } else {
                await api.post('/plans', {
                    class_id: classId,
                    chapter_id: chapterId,
                    title,
                    target_date: targetDate,
                    description,
                    planables: [
                        {
                            planable_id: item.id,
                            planable_type: itemType,
                        }
                    ]
                });
            }
            onClose();
        } catch (error) {
            console.error('Failed to save plan', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        {existingPlan ? 'Edit Study Plan' : 'Add to Study Plan'}
                    </h2>
                    <button type="button" onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                        <Icon name="close" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-1">Plan Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="e.g. Study Math Chapter 1"
                            required
                        />
                        {errors.title && <p className="text-error font-body-sm mt-1">{errors.title[0]}</p>}
                    </div>

                    <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-1">Target Date</label>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                            required
                        />
                        {errors.target_date && <p className="text-error font-body-sm mt-1">{errors.target_date[0]}</p>}
                    </div>

                    <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-1">Note / Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                            placeholder="Any specific goals or focus areas?"
                        />
                        {errors.description && <p className="text-error font-body-sm mt-1">{errors.description[0]}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Icon name="sync" className="animate-spin text-[20px]" />
                                Saving...
                            </>
                        ) : 'Save Plan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
