import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';
import api from '@/utils/api';
import Pagination from '@/Components/shared/ui/Pagination';

export default function ReflectionsIndex() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
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
    if (typeFilter) queryParams.append('type', typeFilter);
    if (subjectFilter) queryParams.append('subject_id', subjectFilter);
    queryParams.append('page', page);
    queryParams.append('per_page', 10);

    const { data: response, loading, refetch } = useApiGet(`/reflections?${queryParams.toString()}`);
    const reflections = response?.data || [];
    const total = response?.total || 0;

    const [selectedRef, setSelectedRef] = useState(null);

    const handleBack = () => router.visit('/student/dashboard');

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!confirm('Are you sure you want to delete this reflection?')) return;
        try {
            await api.delete(`/reflections/${id}`);
            refetch();
            if (selectedRef && selectedRef.id === id) {
                setSelectedRef(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Growth Journal</h2>
            <p className="text-body-md text-on-surface-variant">Review your past reflections and strategies.</p>
        </section>
    );

    const compColors = {
        5: 'bg-success text-on-success',
        4: 'bg-success text-on-success',
        3: 'bg-primary text-on-primary',
        2: 'bg-tertiary text-on-tertiary',
        1: 'bg-error text-on-error'
    };

    return (
        <DashboardTemplate 
            role="student"
            activeTab="dashboard"
            title="Reflections"
            headerSection={headerSection}
            onBack={handleBack}
        >
            <Head title="My Reflections - Diajar" />

            <div className="flex flex-col md:flex-row gap-gutter pb-12 items-start">
                
                {/* Left Column: Details Form */}
                <div className="md:w-1/3 flex flex-col gap-stack-md w-full sticky top-24">
                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 min-h-[400px]">
                        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-6">Reflection Details</h3>
                        
                        {selectedRef ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-start border-b border-outline-variant/50 pb-4">
                                    <div>
                                        <p className="text-label-sm text-on-surface-variant font-label-sm uppercase tracking-wider">Target Task</p>
                                        <p className="text-headline-sm font-headline-sm mt-1">{selectedRef.reflectables?.[0]?.reflectable?.title || selectedRef.title || 'Untitled'}</p>
                                        <p className="text-label-md text-on-surface-variant mt-2 flex items-center gap-1">
                                            <Icon name="event" className="text-[16px]" />
                                            {moment(selectedRef.created_at).format('MMMM D, YYYY h:mm A')}
                                        </p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold shadow-sm ${compColors[selectedRef.comprehension_level] || 'bg-surface border border-outline-variant text-on-surface-variant'}`}>
                                        <span className="text-xl leading-none">{selectedRef.comprehension_level}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-label-md font-label-md text-on-surface-variant block mb-2">Your Reflection</span>
                                    <div className="text-body-md text-on-surface bg-surface border border-outline-variant/30 p-4 rounded-xl whitespace-pre-wrap leading-relaxed">
                                        {selectedRef.content || <span className="italic opacity-50">No notes provided.</span>}
                                    </div>
                                </div>

                                {selectedRef.teacher_comment && (
                                    <div>
                                        <span className="text-label-md font-label-md text-primary block mb-2 flex items-center gap-2">
                                            <Icon name="forum" className="text-[18px]" />
                                            Teacher Feedback
                                        </span>
                                        <div className="text-body-md whitespace-pre-wrap bg-primary-container text-on-primary-container p-4 rounded-xl leading-relaxed shadow-sm">
                                            {selectedRef.teacher_comment}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-4 pt-4 border-t border-outline-variant/50 flex justify-end">
                                    <button 
                                        onClick={(e) => handleDelete(selectedRef.id, e)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-error-container text-on-error-container rounded-full text-label-md font-label-md hover:opacity-90 transition-opacity"
                                    >
                                        <Icon name="delete" className="text-[18px]" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant opacity-70 mt-12">
                                <Icon name="touch_app" className="text-display-md mb-4 text-primary" />
                                <p className="text-body-lg font-medium">Select a Reflection</p>
                                <p className="text-body-md mt-2">Click on any entry from the list to view its complete details and teacher feedback.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: List & Filters */}
                <div className="md:w-2/3 flex flex-col gap-stack-md w-full">
                    
                    {/* Toolbar */}
                    <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                        <div className="flex items-center bg-surface w-full xl:w-80 rounded-full px-4 py-2 border border-outline-variant focus-within:border-primary transition-colors">
                            <Icon name="search" className="text-on-surface-variant mr-2" />
                            <input 
                                type="text" 
                                placeholder="Search journal..." 
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
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-3 min-h-[400px]">
                        {loading ? (
                            <div className="text-center p-12 text-on-surface-variant">Loading journal entries...</div>
                        ) : reflections.length > 0 ? (
                            reflections.map(ref => {
                                const reflectable = ref.reflectables?.[0]?.reflectable;
                                const subjectName = reflectable?.class?.subject?.name || reflectable?.chapter?.subject?.name;
                                let typeLabel = '';
                                if (ref.reflectables?.[0]?.reflectable_type?.includes('Material')) typeLabel = 'Lesson';
                                if (ref.reflectables?.[0]?.reflectable_type?.includes('Assignment')) typeLabel = 'Assignment';
                                if (ref.reflectables?.[0]?.reflectable_type?.includes('Assessment')) typeLabel = 'Assessment';
                                
                                const isSelected = selectedRef?.id === ref.id;

                                return (
                                    <div 
                                        key={ref.id} 
                                        className={`p-5 rounded-2xl border flex flex-col gap-3 cursor-pointer transition-all ${
                                            isSelected 
                                                ? 'bg-primary-container/20 border-primary shadow-sm' 
                                                : 'bg-surface-container-low border-outline-variant/30 hover:border-primary/50'
                                        }`}
                                        onClick={() => setSelectedRef(ref)}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">
                                                    {reflectable?.title || ref.title || 'Untitled'}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                                    <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                                                        <Icon name="event" className="text-[16px]" />
                                                        {moment(ref.created_at).format('MMM D, YYYY')}
                                                    </span>
                                                    {(subjectName || typeLabel) && (
                                                        <span className="text-label-sm font-label-sm bg-surface border border-outline-variant px-2 py-0.5 rounded-full text-on-surface-variant">
                                                            {[typeLabel, subjectName].filter(Boolean).join(' • ')}
                                                        </span>
                                                    )}
                                                    {ref.teacher_comment && (
                                                        <span className="text-label-sm font-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <Icon name="forum" className="text-[14px]" /> Feedback
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-center gap-1 shrink-0">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${compColors[ref.comprehension_level] || 'bg-surface border border-outline-variant text-on-surface-variant'}`} title={`Comprehension Level: ${ref.comprehension_level}/5`}>
                                                    {ref.comprehension_level}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center p-12 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                                <Icon name="history_edu" className="text-primary text-display-md mb-2 opacity-50" />
                                <h4 className="text-headline-sm font-headline-sm text-on-surface">No Entries Found</h4>
                                <p className="text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
                                    You don't have any reflections matching these filters. Try completing a task and writing a reflection!
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
        </DashboardTemplate>
    );
}
