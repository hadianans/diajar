import React, { useMemo, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';
import api from '@/utils/api';
import Modal from '@/Components/shared/ui/Modal';
import Pagination from '@/Components/shared/ui/Pagination';

// Helper component for Planning Widget
function PlanWidget() {
    const [page, setPage] = useState(1);
    const [type, setType] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const { data: response, loading, refetch } = useApiGet(`/plans?page=${page}&per_page=5&type=${type}&subject_id=${subjectId}`);
    
    // Also fetch subjects for the filter drop down
    const { data: subjectsData } = useApiGet('/subjects');
    const subjects = subjectsData || [];

    const plans = response?.data || [];
    const total = response?.total || 0;

    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleComplete = async (plan, e) => {
        e.stopPropagation();
        try {
            const newProgress = plan.progress >= 1 ? 0 : 1;
            await api.patch(`/plans/${plan.id}/progress`, { progress: newProgress });
            refetch();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-stack-md">
            <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-headline-md text-on-surface">Up Next</h3>
                <div className="flex gap-3 items-center">
                    <button 
                        onClick={() => router.visit('/student/plans')}
                        className="text-primary font-label-md hover:underline"
                    >
                        View All
                    </button>
                </div>
            </div>

            <div className="flex gap-2 mb-2">
                <select 
                    value={subjectId} 
                    onChange={(e) => { setSubjectId(e.target.value); setPage(1); }}
                    className="bg-surface-container border border-outline-variant rounded-md text-xs py-1"
                >
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select 
                    value={type} 
                    onChange={(e) => { setType(e.target.value); setPage(1); }}
                    className="bg-surface-container border border-outline-variant rounded-md text-xs py-1"
                >
                    <option value="">All Types</option>
                    <option value="lesson">Lesson</option>
                    <option value="assignment">Assignment</option>
                    <option value="assessment">Assessment</option>
                </select>
            </div>
            
            <div className="flex flex-col gap-3 min-h-[300px]">
                {loading ? (
                    <div className="flex justify-center p-6 text-on-surface-variant">Loading...</div>
                ) : plans.length > 0 ? (
                    plans.map(plan => {
                        const planable = plan.planables?.[0]?.planable;
                        const subjectName = plan.class?.subject?.name || plan.chapter?.subject?.name || 'Unknown Subject';
                        let typeLabel = 'Unknown';
                        if (plan.planables?.[0]?.planable_type?.includes('Material')) typeLabel = 'Lesson';
                        if (plan.planables?.[0]?.planable_type?.includes('Assignment')) typeLabel = 'Assignment';
                        if (plan.planables?.[0]?.planable_type?.includes('Assessment')) typeLabel = 'Assessment';

                        return (
                            <div 
                                key={plan.id} 
                                className="bg-surface-container-low p-4 rounded-xl flex justify-between items-center border border-outline-variant/30 group hover:border-primary/30 transition-all cursor-pointer"
                                onClick={() => setSelectedPlan(plan)}
                            >
                                <div className="flex gap-3 items-start">
                                    <input 
                                        type="checkbox" 
                                        className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                                        checked={plan.progress >= 1}
                                        onChange={(e) => handleComplete(plan, e)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div>
                                        <h4 className={`font-headline-sm text-headline-sm ${plan.progress >= 1 ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                                            {plan.title}
                                        </h4>
                                        <div className="text-label-sm text-on-surface-variant mt-1 flex flex-wrap gap-2 items-center">
                                            <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-xs">{typeLabel}</span>
                                            <span>{subjectName}</span>
                                            {planable?.title && <span>&bull; {planable.title}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-on-surface-variant text-body-md p-6 bg-surface-container-low rounded-xl text-center border border-outline-variant/30">
                        No upcoming plans found.
                    </div>
                )}
            </div>

            {total > 5 && (
                <Pagination
                    currentPage={page}
                    totalItems={total}
                    itemsPerPage={5}
                    onPageChange={setPage}
                    onItemsPerPageChange={() => {}}
                    itemsPerPageOptions={[5]}
                />
            )}

            <Modal show={!!selectedPlan} onClose={() => setSelectedPlan(null)}>
                {selectedPlan && (
                    <div className="p-6">
                        <h3 className="text-title-lg mb-4">{selectedPlan.title}</h3>
                        <div className="flex flex-col gap-2">
                            <p><strong>Target Date:</strong> {moment(selectedPlan.target_date).format('MMM D, YYYY')}</p>
                            <p><strong>Description:</strong> {selectedPlan.description || 'No description'}</p>
                            <p><strong>Status:</strong> {selectedPlan.progress >= 1 ? 'Completed' : 'Pending'}</p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-2 bg-surface-container rounded border border-outline-variant" onClick={() => setSelectedPlan(null)}>Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

// Helper component for Reflection Widget
function ReflectionWidget() {
    const [page, setPage] = useState(1);
    const [type, setType] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const { data: response, loading } = useApiGet(`/reflections?page=${page}&per_page=5&type=${type}&subject_id=${subjectId}`);
    
    const { data: subjectsData } = useApiGet('/subjects');
    const subjects = subjectsData || [];

    const reflections = response?.data || [];
    const total = response?.total || 0;

    const [selectedRef, setSelectedRef] = useState(null);

    return (
        <div className="flex flex-col gap-stack-md xl:col-span-1 md:col-span-2">
            <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-headline-md text-on-surface">Completed Reflections</h3>
                <button 
                    onClick={() => router.visit('/student/reflections')}
                    className="text-primary font-label-md hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="flex gap-2 mb-2">
                <select 
                    value={subjectId} 
                    onChange={(e) => { setSubjectId(e.target.value); setPage(1); }}
                    className="bg-surface-container border border-outline-variant rounded-md text-xs py-1"
                >
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select 
                    value={type} 
                    onChange={(e) => { setType(e.target.value); setPage(1); }}
                    className="bg-surface-container border border-outline-variant rounded-md text-xs py-1"
                >
                    <option value="">All Types</option>
                    <option value="lesson">Lesson</option>
                    <option value="assignment">Assignment</option>
                    <option value="assessment">Assessment</option>
                </select>
            </div>

            <div className="flex flex-col gap-3 min-h-[300px]">
                {loading ? (
                    <div className="flex justify-center p-6 text-on-surface-variant">Loading...</div>
                ) : reflections.length > 0 ? (
                    reflections.map(ref => {
                        const reflectable = ref.reflectables?.[0]?.reflectable;
                        const subjectName = reflectable?.class?.subject?.name || reflectable?.chapter?.subject?.name || 'Unknown Subject';
                        let typeLabel = 'Unknown';
                        if (ref.reflectables?.[0]?.reflectable_type?.includes('Material')) typeLabel = 'Lesson';
                        if (ref.reflectables?.[0]?.reflectable_type?.includes('Assignment')) typeLabel = 'Assignment';
                        if (ref.reflectables?.[0]?.reflectable_type?.includes('Assessment')) typeLabel = 'Assessment';
                        
                        const compColors = {
                            5: 'bg-success',
                            4: 'bg-success',
                            3: 'bg-primary',
                            2: 'bg-tertiary',
                            1: 'bg-error'
                        };

                        return (
                            <div 
                                key={ref.id} 
                                className="bg-secondary-container/20 p-4 rounded-xl flex flex-col gap-2 border border-secondary-container cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => setSelectedRef(ref)}
                            >
                                <div>
                                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{reflectable?.title || 'Unknown Target'}</h4>
                                    <div className="text-label-sm text-on-surface-variant mt-1 flex flex-wrap gap-2 items-center">
                                        <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-xs">{typeLabel}</span>
                                        <span>{subjectName}</span>
                                        <span className={`w-2 h-2 rounded-full ${compColors[ref.comprehension_level] || 'bg-gray-400'}`} title={`Comprehension: ${ref.comprehension_level}/5`}></span>
                                    </div>
                                </div>
                                {ref.content && (
                                    <p className="text-body-sm text-on-surface-variant line-clamp-2 italic border-l-2 border-outline-variant pl-2">
                                        "{ref.content}"
                                    </p>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-on-surface-variant text-body-md p-6 bg-surface-container-low rounded-xl text-center border border-outline-variant/30 flex flex-col items-center gap-2">
                        <Icon name="done_all" className="text-primary text-[32px]" />
                        No reflections found.
                    </div>
                )}
            </div>

            {total > 5 && (
                <Pagination
                    currentPage={page}
                    totalItems={total}
                    itemsPerPage={5}
                    onPageChange={setPage}
                    onItemsPerPageChange={() => {}}
                    itemsPerPageOptions={[5]}
                />
            )}

            <Modal show={!!selectedRef} onClose={() => setSelectedRef(null)}>
                {selectedRef && (
                    <div className="p-6">
                        <h3 className="text-title-lg mb-4">Reflection Details</h3>
                        <div className="flex flex-col gap-2">
                            <p><strong>Title:</strong> {selectedRef.title || 'Untitled'}</p>
                            <p><strong>Comprehension:</strong> {selectedRef.comprehension_level} / 5</p>
                            <p><strong>Note:</strong> {selectedRef.content || 'No notes'}</p>
                            {selectedRef.teacher_comment && (
                                <div className="mt-4 p-4 bg-tertiary-container rounded border border-outline-variant">
                                    <p className="text-sm font-semibold mb-1">Teacher Comment:</p>
                                    <p>{selectedRef.teacher_comment}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-2 bg-surface-container rounded border border-outline-variant" onClick={() => setSelectedRef(null)}>Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default function Dashboard() {
    const { data, loading } = useApiGet('/dashboard');

    const stats = data?.weekly_stats || { total: 0, completed: 0, progress: 0 };
    const lmsProgress = data?.lms_progress || { material: 0, assignment: 0, assessment: 0 };
    
    const comprehension = useMemo(() => {
        const dist = data?.comprehension_distribution || {};
        let total = 0;
        let strong = 0;
        let good = 0;
        let fair = 0;
        let needsWork = 0;

        Object.keys(dist).forEach(level => {
            const count = parseInt(dist[level], 10);
            total += count;
            if (level == 5 || level == 4) strong += count;
            else if (level == 3) good += count;
            else if (level == 2) fair += count;
            else if (level == 1) needsWork += count;
        });

        if (total === 0) return { total: 0, strong: 0, good: 0, fair: 0, needsWork: 0 };

        return {
            total,
            strong: Math.round((strong / total) * 100),
            good: Math.round((good / total) * 100),
            fair: Math.round((fair / total) * 100),
            needsWork: Math.round((needsWork / total) * 100)
        };
    }, [data?.comprehension_distribution]);

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Learning Hub</h2>
            <p className="text-body-md text-on-surface-variant">Your personal snapshot for planning, monitoring, and reflection.</p>
        </section>
    );

    if (loading) {
        return (
            <DashboardTemplate role="student" activeTab="dashboard" title="Learning Hub">
                <div className="flex justify-center p-12 text-on-surface-variant">Loading hub data...</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate 
            role="student"
            activeTab="dashboard"
            title="Learning Hub"
            headerSection={headerSection}
            showBack={false}
        >
            <Head title="Student Hub - Diajar" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter pb-12 items-start">
                
                <div className="flex flex-col gap-stack-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-headline-md font-headline-md text-on-surface">Monitoring Snapshot</h3>
                    </div>

                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-label-md font-label-md text-on-surface-variant mb-1">Weekly Plan Progress</p>
                                <p className="text-display-sm font-display-sm text-on-surface">
                                    {stats.completed} <span className="text-headline-sm text-on-surface-variant">/ {stats.total}</span>
                                </p>
                            </div>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-surface-container-high" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="text-primary transition-all duration-1000 ease-out" strokeDasharray={`${stats.progress}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-label-sm font-label-sm text-on-surface">{stats.progress}%</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-outline-variant/30" />

                        <div className="flex flex-col gap-3">
                            <p className="text-label-md font-label-md text-on-surface-variant">LMS Completion Rate</p>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Materials</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary transition-all" style={{width: `${lmsProgress.material}%`}}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.material}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Assignments</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-tertiary transition-all" style={{width: `${lmsProgress.assignment}%`}}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.assignment}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Assessments</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all" style={{width: `${lmsProgress.assessment}%`}}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.assessment}%</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-outline-variant/30" />

                        <div className="flex flex-col gap-3">
                            <p className="text-label-md font-label-md text-on-surface-variant">Average Comprehension Stats</p>
                            {comprehension.total > 0 ? (
                                <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                                    <div className="bg-success" style={{ width: `${comprehension.strong}%` }} title={`Strong: ${comprehension.strong}%`}></div>
                                    <div className="bg-primary" style={{ width: `${comprehension.good}%` }} title={`Good: ${comprehension.good}%`}></div>
                                    <div className="bg-tertiary" style={{ width: `${comprehension.fair}%` }} title={`Fair: ${comprehension.fair}%`}></div>
                                    <div className="bg-error" style={{ width: `${comprehension.needsWork}%` }} title={`Needs Work: ${comprehension.needsWork}%`}></div>
                                </div>
                            ) : (
                                <p className="text-label-sm text-on-surface-variant italic">No reflections recorded yet.</p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-label-sm text-on-surface-variant mt-1">
                                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> Strong</div>
                                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Good</div>
                                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Fair</div>
                                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error"></span> Needs Work</div>
                            </div>
                        </div>
                    </div>
                </div>

                <PlanWidget />
                <ReflectionWidget />

            </div>
        </DashboardTemplate>
    );
}
