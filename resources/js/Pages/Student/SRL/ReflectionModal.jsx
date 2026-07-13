import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import { showError, showWarning } from '@/utils/swal';

export default function ReflectionModal() {
    const urlParams = new URLSearchParams(window.location.search);
    const reflectableType = urlParams.get('type') || 'task';
    const reflectableId = urlParams.get('id');

    const [form, setForm] = useState({
        title: `Reflection on ${reflectableType}`,
        content: '',
        comprehension_level: 3,
        emotions: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const emotionsList = ['😀 Confident', '🤔 Confused', '😫 Frustrated', '😌 Relieved', '🥱 Bored', '🤩 Excited'];

    const toggleArrayItem = (arrayName, item) => {
        setForm(prev => {
            const arr = prev[arrayName];
            if (arr.includes(item)) {
                return { ...prev, [arrayName]: arr.filter(i => i !== item) };
            } else {
                return { ...prev, [arrayName]: [...arr, item] };
            }
        });
    };

    const handleBack = () => router.visit('/student/dashboard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reflectableId) {
            showWarning('Missing Data', 'Missing reflectable ID');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/reflections', {
                title: form.title,
                content: form.content || 'Completed reflection.',
                comprehension_level: parseInt(form.comprehension_level, 10),
                emotions: form.emotions,
                reflectable_type: reflectableType === 'assessment' ? 'App\\Models\\ClassAssessment' : 'App\\Models\\ClassAssignment',
                reflectable_id: parseInt(reflectableId, 10)
            });
            router.visit('/student/dashboard');
        } catch (err) {
            showError('Error', err.response?.data?.message || 'Error saving reflection');
            setIsSubmitting(false);
        }
    };

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Growth Journal</h2>
            <p className="text-body-md text-on-surface-variant">Take a moment to reflect on your learning process.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            role="student"
            activeTab="dashboard"
            title="Reflection"
            headerSection={headerSection}
            onBack={handleBack}
        >
            <Head title="Reflect - Diajar" />

            <div className="max-w-2xl mx-auto pb-12">
                <div className="bg-surface-container-low p-6 md:p-8 rounded-3xl border border-outline-variant/30">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-lg">
                        
                        {/* 1. Title */}
                        <div>
                            <label className="block text-headline-sm font-headline-sm text-on-surface mb-2">Reflection Title</label>
                            <input 
                                type="text"
                                required
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        {/* 2. Comprehension Level Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-headline-sm font-headline-sm text-on-surface">Comprehension Level</label>
                                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                                    {form.comprehension_level}
                                </div>
                            </div>
                            
                            <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                value={form.comprehension_level}
                                onChange={e => setForm({...form, comprehension_level: e.target.value})}
                                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-label-sm text-on-surface-variant mt-2">
                                <span>1 - Totally Lost</span>
                                <span>3 - Getting There</span>
                                <span>5 - Mastered It</span>
                            </div>
                        </div>

                        {/* 3. Emotional State */}
                        <div>
                            <label className="block text-headline-sm font-headline-sm text-on-surface mb-3">How did you feel?</label>
                            <div className="flex flex-wrap gap-3">
                                {emotionsList.map(emotion => (
                                    <button
                                        key={emotion}
                                        type="button"
                                        onClick={() => toggleArrayItem('emotions', emotion)}
                                        className={`px-4 py-2 rounded-full border transition-all ${form.emotions.includes(emotion) ? 'bg-primary-container text-on-primary-container border-primary-container shadow-sm' : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container-high'}`}
                                    >
                                        {emotion}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Open Journaling */}
                        <div>
                            <label className="block text-headline-sm font-headline-sm text-on-surface mb-2">Additional Thoughts & Strategies</label>
                            <p className="text-label-md text-on-surface-variant mb-3">What strategies did you use? What worked well? What would you do differently next time?</p>
                            <textarea 
                                rows="6"
                                value={form.content}
                                onChange={e => setForm({...form, content: e.target.value})}
                                placeholder="Write your thoughts here..."
                                className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors resize-y"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button 
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl text-primary font-label-lg hover:bg-primary/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary text-on-primary px-8 py-3 rounded-xl font-label-lg shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <Icon name="send" />
                                {isSubmitting ? 'Saving...' : 'Save Reflection'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </DashboardTemplate>
    );
}
