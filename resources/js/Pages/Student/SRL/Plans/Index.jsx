import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';
import api from '@/utils/api';

export default function PlansIndex() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (statusFilter) queryParams.append('status', statusFilter);

    const { data: plansData, loading, mutate } = useApiGet(`/plans?${queryParams.toString()}`);
    const plans = plansData?.data || [];

    const handleBack = () => router.visit('/student/dashboard');

    const handleMarkComplete = async (planId) => {
        try {
            await api.patch(`/plans/${planId}/progress`, { progress: 100 });
            mutate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (planId) => {
        if (!confirm('Are you sure you want to delete this study plan?')) return;
        try {
            await api.delete(`/plans/${planId}`);
            mutate();
        } catch (err) {
            console.error(err);
        }
    };

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">My Study Plans</h2>
            <p className="text-body-md text-on-surface-variant">View and manage all your learning goals.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            role="student"
            activeTab="dashboard"
            title="Study Plans"
            headerSection={headerSection}
            onBack={handleBack}
        >
            <Head title="My Study Plans - Diajar" />

            <div className="flex flex-col gap-stack-lg pb-12">
                
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                    <div className="flex items-center bg-surface w-full md:w-96 rounded-full px-4 py-2 border border-outline-variant">
                        <Icon name="search" className="text-on-surface-variant mr-2" />
                        <input 
                            type="text" 
                            placeholder="Search plans..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-body-md text-on-surface"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-surface border border-outline-variant rounded-full px-4 py-2 text-label-md text-on-surface outline-none focus:border-primary flex-1 md:flex-none"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <button 
                            onClick={() => router.visit('/student/planner')}
                            className="bg-primary text-on-primary px-5 py-2 rounded-full text-label-md font-label-md hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Icon name="add" /> New Plan
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex flex-col gap-3">
                    {loading ? (
                        <div className="text-center p-12 text-on-surface-variant">Loading plans...</div>
                    ) : plans.length > 0 ? (
                        plans.map(plan => (
                            <div key={plan.id} className={`bg-surface p-5 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${plan.completed_at ? 'opacity-70 bg-surface-container-low' : ''}`}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-headline-sm text-headline-sm text-on-surface ${plan.completed_at ? 'line-through' : ''}`}>
                                            {plan.title}
                                        </h3>
                                        {plan.derived_status === 'overdue' && !plan.completed_at && (
                                            <span className="text-[10px] uppercase font-bold bg-error text-on-error px-2 py-0.5 rounded-full">Overdue</span>
                                        )}
                                        {plan.completed_at && (
                                            <span className="text-[10px] uppercase font-bold bg-success text-on-success px-2 py-0.5 rounded-full">Completed</span>
                                        )}
                                    </div>
                                    <p className="text-body-md text-on-surface-variant line-clamp-2 max-w-3xl">
                                        {plan.description || <span className="italic opacity-50">No strategy description provided.</span>}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                                            <Icon name="event" className="text-[16px]" />
                                            {moment(plan.target_date).format('MMMM D, YYYY')}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-outline-variant/30">
                                    {!plan.completed_at && (
                                        <button 
                                            onClick={() => handleMarkComplete(plan.id)}
                                            className="flex-1 md:flex-none text-center bg-surface-container-high hover:bg-success hover:text-on-success hover:border-transparent text-on-surface border border-outline-variant px-4 py-2 rounded-full font-label-md transition-colors"
                                        >
                                            Mark Done
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(plan.id)}
                                        className="p-2 text-error hover:bg-error-container hover:text-on-error-container rounded-full transition-colors"
                                        title="Delete Plan"
                                    >
                                        <Icon name="delete" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-12 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                            <Icon name="event_busy" className="text-primary text-display-md mb-2 opacity-50" />
                            <h4 className="text-headline-sm font-headline-sm text-on-surface">No Plans Found</h4>
                            <p className="text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
                                You don't have any study plans matching these filters.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </DashboardTemplate>
    );
}
