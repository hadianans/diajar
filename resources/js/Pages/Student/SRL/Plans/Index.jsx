import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';
import api from '@/utils/api';
import Pagination from '@/Components/shared/ui/Pagination';
import Modal from '@/Components/shared/ui/Modal';

export default function PlansIndex() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [page, setPage] = useState(1);

    const { data: subjectsData } = useApiGet('/subjects');
    const subjects = subjectsData || [];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const queryParams = new URLSearchParams();
    if (debouncedSearch) queryParams.append('search', debouncedSearch);
    if (statusFilter) queryParams.append('status', statusFilter);
    if (typeFilter) queryParams.append('type', typeFilter);
    if (subjectFilter) queryParams.append('subject_id', subjectFilter);
    queryParams.append('page', page);
    queryParams.append('per_page', 10);

    const { data: response, loading, refetch } = useApiGet(`/plans?${queryParams.toString()}`);
    const plans = response?.data || [];
    const total = response?.total || 0;

    const [isCreating, setIsCreating] = useState(false);
    const [newPlan, setNewPlan] = useState({
        title: '',
        description: '',
        target_date: moment().format('YYYY-MM-DD')
    });

    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleBack = () => router.visit('/student/dashboard');

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/plans', {
                ...newPlan,
                class_id: null,
            });
            setNewPlan({ title: '', description: '', target_date: moment().format('YYYY-MM-DD') });
            refetch();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating plan');
        }
    };

    const handleMarkComplete = async (planId, currentProgress, e) => {
        if (e) e.stopPropagation();
        try {
            await api.patch(`/plans/${planId}/progress`, { progress: currentProgress >= 1 ? 0 : 1 });
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (planId, e) => {
        if (e) e.stopPropagation();
        if (!confirm('Are you sure you want to delete this study plan?')) return;
        try {
            await api.delete(`/plans/${planId}`);
            refetch();
            setSelectedPlan(null);
        } catch (err) {
            console.error(err);
        }
    };

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Study Plans</h2>
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

            <div className="flex flex-col md:flex-row gap-gutter pb-12">
                
                {/* Left Column: Create Form */}
                <div className="md:w-1/3 flex flex-col gap-stack-md">
                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 sticky top-24">
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

                {/* Right Column: List & Filters */}
                <div className="md:w-2/3 flex flex-col gap-stack-md">
                    
                    {/* Toolbar */}
                    <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                        <div className="flex items-center bg-surface w-full xl:w-96 rounded-full px-4 py-2 border border-outline-variant">
                            <Icon name="search" className="text-on-surface-variant mr-2" />
                            <input 
                                type="text" 
                                placeholder="Search plans..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-body-md text-on-surface"
                            />
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                            <select 
                                value={subjectFilter}
                                onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }}
                                className="bg-surface border border-outline-variant rounded-md px-3 py-1.5 text-label-md text-on-surface outline-none focus:border-primary flex-1 min-w-[120px]"
                            >
                                <option value="">All Subjects</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <select 
                                value={typeFilter}
                                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                                className="bg-surface border border-outline-variant rounded-md px-3 py-1.5 text-label-md text-on-surface outline-none focus:border-primary flex-1 min-w-[120px]"
                            >
                                <option value="">All Types</option>
                                <option value="lesson">Lesson</option>
                                <option value="assignment">Assignment</option>
                                <option value="assessment">Assessment</option>
                            </select>
                            <select 
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="bg-surface border border-outline-variant rounded-md px-3 py-1.5 text-label-md text-on-surface outline-none focus:border-primary flex-1 min-w-[120px]"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-3 min-h-[400px]">
                        {loading ? (
                            <div className="text-center p-12 text-on-surface-variant">Loading plans...</div>
                        ) : plans.length > 0 ? (
                            plans.map(plan => {
                                const subjectName = plan.class?.subject?.name || plan.chapter?.subject?.name;
                                let typeLabel = '';
                                if (plan.planables?.[0]?.planable_type?.includes('Material')) typeLabel = 'Lesson';
                                if (plan.planables?.[0]?.planable_type?.includes('Assignment')) typeLabel = 'Assignment';
                                if (plan.planables?.[0]?.planable_type?.includes('Assessment')) typeLabel = 'Assessment';

                                return (
                                    <div 
                                        key={plan.id} 
                                        className={`bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors ${plan.completed_at ? 'opacity-70' : ''}`}
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        <div className="flex gap-4 items-start w-full">
                                            <div className="mt-1">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                                                    checked={plan.progress >= 1}
                                                    onChange={(e) => handleMarkComplete(plan.id, plan.progress, e)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-headline-sm text-headline-sm text-on-surface ${plan.completed_at ? 'line-through text-on-surface-variant' : ''}`}>
                                                        {plan.title}
                                                    </h3>
                                                    {plan.derived_status === 'overdue' && !plan.completed_at && (
                                                        <span className="text-[10px] uppercase font-bold bg-error text-on-error px-2 py-0.5 rounded-full">Overdue</span>
                                                    )}
                                                </div>
                                                <p className="text-body-md text-on-surface-variant line-clamp-2 max-w-3xl">
                                                    {plan.description || <span className="italic opacity-50">No strategy description provided.</span>}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                                    <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                                                        <Icon name="event" className="text-[16px]" />
                                                        {moment(plan.target_date).format('MMMM D, YYYY')}
                                                    </span>
                                                    {(subjectName || typeLabel) && (
                                                        <span className="text-label-sm font-label-sm bg-surface-container border border-outline-variant px-2 py-0.5 rounded-full text-on-surface-variant">
                                                            {[typeLabel, subjectName].filter(Boolean).join(' • ')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center ml-auto border-outline-variant/30">
                                                <button 
                                                    onClick={(e) => handleDelete(plan.id, e)}
                                                    className="p-2 text-error hover:bg-error-container hover:text-on-error-container rounded-full transition-colors"
                                                    title="Delete Plan"
                                                >
                                                    <Icon name="delete" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center p-12 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                                <Icon name="event_busy" className="text-primary text-display-md mb-2 opacity-50" />
                                <h4 className="text-headline-sm font-headline-sm text-on-surface">No Plans Found</h4>
                                <p className="text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
                                    You don't have any study plans matching these filters. Use the form on the left to set your first learning target!
                                </p>
                            </div>
                        )}
                    </div>

                    {total > 10 && (
                        <Pagination
                            currentPage={page}
                            totalItems={total}
                            itemsPerPage={10}
                            onPageChange={setPage}
                            onItemsPerPageChange={() => {}}
                            itemsPerPageOptions={[10]}
                        />
                    )}

                </div>
            </div>

            <Modal show={!!selectedPlan} onClose={() => setSelectedPlan(null)}>
                {selectedPlan && (
                    <div className="p-6">
                        <h3 className="text-title-lg mb-4">{selectedPlan.title}</h3>
                        <div className="flex flex-col gap-3">
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Target Date</span>
                                <p className="text-body-md">{moment(selectedPlan.target_date).format('MMMM D, YYYY')}</p>
                            </div>
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Status</span>
                                <p className="text-body-md">
                                    {selectedPlan.progress >= 1 ? 
                                        <span className="text-success font-semibold">Completed</span> : 
                                        <span className="text-warning font-semibold">In Progress</span>
                                    }
                                </p>
                            </div>
                            <div>
                                <span className="text-label-sm text-on-surface-variant block">Description</span>
                                <p className="text-body-md whitespace-pre-wrap">{selectedPlan.description || 'No description provided.'}</p>
                            </div>
                            {selectedPlan.class?.subject?.name && (
                                <div>
                                    <span className="text-label-sm text-on-surface-variant block">Subject</span>
                                    <p className="text-body-md">{selectedPlan.class.subject.name}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button className="px-4 py-2 bg-error text-on-error rounded-full text-label-md" onClick={(e) => handleDelete(selectedPlan.id, e)}>Delete</button>
                            <button className="px-4 py-2 bg-surface-container rounded-full text-label-md border border-outline-variant" onClick={() => setSelectedPlan(null)}>Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardTemplate>
    );
}
