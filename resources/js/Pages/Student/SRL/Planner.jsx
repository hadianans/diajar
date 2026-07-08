import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';
import api from '@/utils/api';

export default function Planner() {
    const { data: plansData, loading, mutate } = useApiGet('/plans');
    const plans = plansData?.data || [];

    const [isCreating, setIsCreating] = useState(false);
    const [newPlan, setNewPlan] = useState({
        title: '',
        description: '',
        target_date: moment().format('YYYY-MM-DD')
    });

    const handleBack = () => router.visit('/student/dashboard');

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/plans', {
                ...newPlan,
                class_id: null, // Just a standalone plan for now unless tied to class
            });
            setIsCreating(false);
            setNewPlan({ title: '', description: '', target_date: moment().format('YYYY-MM-DD') });
            mutate(); // Refresh the list
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating plan');
        }
    };

    const handleMarkComplete = async (planId) => {
        try {
            await api.patch(`/plans/${planId}/progress`, { progress: 100 });
            mutate();
        } catch (err) {
            console.error(err);
        }
    };

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Study Planner</h2>
            <p className="text-body-md text-on-surface-variant">Set clear goals and choose your learning strategies.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            role="student"
            activeTab="dashboard"
            title="Planner"
            headerSection={headerSection}
            onBack={handleBack}
        >
            <Head title="Study Planner - Diajar" />

            <div className="flex flex-col md:flex-row gap-gutter pb-12">
                
                {/* Left Column: Create New Plan */}
                <div className="md:w-1/3 flex flex-col gap-stack-md">
                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
                        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Set a New Goal</h3>
                        
                        <form onSubmit={handleCreate} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Goal Title</label>
                                <input 
                                    type="text"
                                    required
                                    value={newPlan.title}
                                    onChange={e => setNewPlan({...newPlan, title: e.target.value})}
                                    placeholder="e.g. Master Chapter 4"
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Target Date</label>
                                <input 
                                    type="date"
                                    required
                                    value={newPlan.target_date}
                                    onChange={e => setNewPlan({...newPlan, target_date: e.target.value})}
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Study Strategy (Description)</label>
                                <textarea 
                                    rows="3"
                                    required
                                    value={newPlan.description}
                                    onChange={e => setNewPlan({...newPlan, description: e.target.value})}
                                    placeholder="Describe how you plan to achieve this goal..."
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors resize-y"
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm mt-2"
                            >
                                Commit to Plan
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Upcoming Plans */}
                <div className="md:w-2/3 flex flex-col gap-stack-md">
                    <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Your Commitments</h3>
                    
                    {loading ? (
                        <div className="text-on-surface-variant text-center py-8">Loading plans...</div>
                    ) : plans.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {plans.map(plan => (
                                <div key={plan.id} className={`bg-surface-container-low p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between border border-outline-variant/30 gap-4 ${plan.completed_at ? 'opacity-60' : ''}`}>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center text-primary shrink-0">
                                            <Icon name={plan.completed_at ? "check_circle" : "flag"} />
                                        </div>
                                        <div>
                                            <h4 className={`font-headline-sm text-headline-sm text-on-surface ${plan.completed_at ? 'line-through text-on-surface-variant' : ''}`}>
                                                {plan.title}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                                                    <Icon name="event" className="text-[14px]" />
                                                    {moment(plan.target_date).format('MMM D')}
                                                </span>
                                                <span className="text-label-sm font-label-sm text-secondary flex items-center gap-1 bg-secondary/10 px-2 rounded-full">
                                                    <Icon name="psychology" className="text-[14px]" />
                                                    Strategy Selected
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {!plan.completed_at && (
                                        <button 
                                            onClick={() => handleMarkComplete(plan.id)}
                                            className="bg-surface-container-high text-on-surface border border-outline-variant px-5 py-2 rounded-full font-label-md text-label-md hover:bg-success-container hover:text-on-success-container hover:border-transparent transition-all whitespace-nowrap"
                                        >
                                            Mark Done
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                            <Icon name="edit_calendar" className="text-primary text-display-md mb-2 opacity-50" />
                            <h4 className="text-headline-sm font-headline-sm text-on-surface">No Plans Yet</h4>
                            <p className="text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
                                Successful students plan their time. Use the form to set your first learning target!
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </DashboardTemplate>
    );
}
