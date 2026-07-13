import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';
import api from '@/utils/api';
import { showError, confirmDelete } from '@/utils/swal';
import Pagination from '@/Components/shared/ui/Pagination';

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

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target_date: moment().format('YYYY-MM-DD')
    });
    const [selectedSubjectForm, setSelectedSubjectForm] = useState('');
    const [selectedChapterForm, setSelectedChapterForm] = useState('');
    const [selectedTargetForm, setSelectedTargetForm] = useState('');

    const { data: chaptersData } = useApiGet(selectedSubjectForm ? `/subjects/${selectedSubjectForm}/chapters` : null);
    const formChapters = chaptersData || [];

    const { data: materialsData } = useApiGet(selectedSubjectForm && selectedChapterForm ? `/subjects/${selectedSubjectForm}/chapters/${selectedChapterForm}/materials` : null);
    const { data: assignmentsData } = useApiGet(selectedSubjectForm ? `/assignments?subject_id=${selectedSubjectForm}` : null);
    const { data: assessmentsData } = useApiGet(selectedSubjectForm ? `/assessments?subject_id=${selectedSubjectForm}` : null);

    const formTargets = React.useMemo(() => {
        let list = [];

        if (materialsData) {
            const mats = Object.values(materialsData).flat();
            mats.forEach(m => {
                list.push({
                    value: `App\\Models\\Material:${m.id}`,
                    label: `Lesson - ${m.title}`,
                });
            });
        }

        if (assignmentsData) {
            const assigns = Array.isArray(assignmentsData) ? assignmentsData : (assignmentsData.data || []);
            assigns.filter(a => a.chapter_id == selectedChapterForm).forEach(a => {
                list.push({
                    value: `App\\Models\\ClassAssignment:${a.id}`,
                    label: `Assignment - ${a.title}`,
                });
            });
        }

        if (assessmentsData) {
            const assess = Array.isArray(assessmentsData) ? assessmentsData : (assessmentsData.data || []);
            assess.filter(a => a.chapter_id == selectedChapterForm).forEach(a => {
                list.push({
                    value: `App\\Models\\ClassAssessment:${a.id}`,
                    label: `Assessment - ${a.title}`,
                });
            });
        }

        return list;
    }, [materialsData, assignmentsData, assessmentsData, selectedChapterForm]);

    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        if (selectedPlan) {
            setFormData({
                title: selectedPlan.title || '',
                description: selectedPlan.description || '',
                target_date: selectedPlan.target_date ? moment(selectedPlan.target_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            });
        } else {
            setFormData({
                title: '',
                description: '',
                target_date: moment().format('YYYY-MM-DD')
            });
            setSelectedSubjectForm('');
            setSelectedChapterForm('');
            setSelectedTargetForm('');
        }
    }, [selectedPlan]);

    const handleBack = () => router.visit('/student/dashboard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedPlan) {
                await api.put(`/plans/${selectedPlan.id}`, formData);
                refetch();
                setSelectedPlan(null);
            } else {
                const [type, id] = selectedTargetForm.split(':');
                await api.post('/plans', {
                    ...formData,
                    class_id: null,
                    chapter_id: selectedChapterForm,
                    planables: [
                        {
                            planable_id: id,
                            planable_type: type
                        }
                    ]
                });
                setSelectedPlan(null);
                refetch();
            }
        } catch (err) {
            showError('Error', err.response?.data?.message || 'Error saving plan');
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
        const confirmed = await confirmDelete('Delete Plan?', 'Are you sure you want to delete this study plan?');
        if (!confirmed) return;
        try {
            await api.delete(`/plans/${planId}`);
            refetch();
            setSelectedPlan(null);
        } catch (err) {
            console.error(err);
        }
    };

    const getTargetLink = (planable, plan) => {
        if (!planable) return '#';
        if (planable.planable_type.includes('Material')) {
            const subjectId = plan?.chapter?.subject_id || plan?.class?.subject_id || 1;
            const chapterId = plan?.chapter_id || 1;
            return `/student/subjects/${subjectId}/${chapterId}/${planable.planable_id}`;
        }
        if (planable.planable_type.includes('Assignment')) {
            return `/student/assignments/${planable.planable_id}`;
        }
        if (planable.planable_type.includes('Assessment')) {
            return `/student/assessments/${planable.planable_id}`;
        }
        return '#';
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

                {/* Left Column: Create / Edit Form */}
                <div className="md:w-1/3 flex flex-col gap-stack-md w-full sticky top-24">
                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 min-h-[400px]">
                        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-6">
                            {selectedPlan ? 'Edit Study Plan' : 'Set a New Goal'}
                        </h3>
                        
                        {selectedPlan && (
                            <div className="border-b border-outline-variant/50 pb-4 mb-4 flex justify-between items-start gap-4 animate-fadeIn">
                                <div>
                                    <p className="text-label-sm text-on-surface-variant font-label-sm uppercase tracking-wider">Target Task</p>
                                    <p className="text-headline-sm font-headline-sm mt-1">{selectedPlan.planables?.[0]?.planable?.title || 'Untitled'}</p>
                                    <p className="text-label-md text-on-surface-variant mt-2 flex items-center gap-1">
                                        <Icon name="event" className="text-[16px]" />
                                        {moment(selectedPlan.created_at).format('MMMM D, YYYY')}
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Goal Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Master Chapter 4"
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Target Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.target_date}
                                    onChange={e => setFormData({ ...formData, target_date: e.target.value })}
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Study Strategy (Description)</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe how you plan to achieve this goal..."
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors resize-y"
                                ></textarea>
                            </div>

                            {!selectedPlan && (
                                <div className="grid grid-cols-1 gap-4 border-t border-outline-variant/50 pt-4 mt-2">
                                    <div>
                                        <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Subject</label>
                                        <select
                                            required
                                            value={selectedSubjectForm}
                                            onChange={e => { setSelectedSubjectForm(e.target.value); setSelectedChapterForm(''); setSelectedTargetForm(''); }}
                                            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                                        >
                                            <option value="" disabled>Select Subject</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.subject?.subject_name || s.subject_name || s.name}</option>)}
                                        </select>
                                    </div>

                                    {selectedSubjectForm && (
                                        <div>
                                            <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Chapter</label>
                                            <select
                                                required
                                                value={selectedChapterForm}
                                                onChange={e => { setSelectedChapterForm(e.target.value); setSelectedTargetForm(''); }}
                                                className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                                            >
                                                <option value="" disabled>Select Chapter</option>
                                                {formChapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    {selectedChapterForm && (
                                        <div>
                                            <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Target</label>
                                            <select
                                                required
                                                value={selectedTargetForm}
                                                onChange={e => setSelectedTargetForm(e.target.value)}
                                                className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                                            >
                                                <option value="" disabled>Select Target (Lesson / Assignment / Assessment)</option>
                                                {formTargets.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={!selectedPlan && !selectedTargetForm}
                                    className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                                >
                                    {selectedPlan ? 'Update Plan' : 'Commit to Plan'}
                                </button>
                                
                                {selectedPlan && (
                                    <div className="flex gap-2">
                                        <Link href={getTargetLink(selectedPlan.planables?.[0], selectedPlan)} className="flex-1 flex justify-center items-center gap-2 py-3 bg-secondary-container text-on-secondary-container rounded-xl text-label-md font-label-md hover:opacity-90 transition-opacity">
                                            <Icon name="arrow_forward" className="text-[18px]" />
                                            View Task
                                        </Link>
                                        <button 
                                            type="button"
                                            onClick={() => setSelectedPlan(null)}
                                            className="flex-1 flex justify-center items-center gap-2 py-3 bg-surface-container text-on-surface rounded-xl text-label-md font-label-md hover:bg-surface-variant transition-opacity border border-outline-variant"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
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
                            onItemsPerPageChange={() => { }}
                            itemsPerPageOptions={[10]}
                        />
                    )}

                </div>
            </div>

        </DashboardTemplate>
    );
}
