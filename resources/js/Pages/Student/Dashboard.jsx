import React, { useMemo, useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';
import api from '@/utils/api';
import Modal from '@/Components/shared/ui/Modal';
import Pagination from '@/Components/shared/ui/Pagination';
import ReflectionForm from '@/Components/features/reflections/ReflectionForm';
import { showSuccess, showError } from '@/utils/swal';

const getTargetLink = (item, parent = null) => {
    if (!item) return '#';
    const type = item.planable_type || item.reflectable_type || '';
    const id = item.planable_id || item.reflectable_id;
    const target = item.planable || item.reflectable;
    if (!id) return '#';
    if (type.includes('Material')) {
        const chapterId = target?.chapter_id || target?.chapter?.id || parent?.chapter_id || 1;
        const subjectId = target?.chapter?.subject_id || target?.chapter?.subject?.id || parent?.chapter?.subject_id || parent?.class?.subject_id || 1;
        return `/student/subjects/${subjectId}/${chapterId}/${id}`;
    }
    if (type.includes('Assignment')) {
        return `/student/assignments/${id}`;
    }
    if (type.includes('Assessment')) {
        return `/student/assessments/${id}`;
    }
    return '#';
};

const formatSubjects = (subjects = []) => {
    const map = new Map();
    subjects.forEach(s => {
        const id = s.subject_id || s.id;
        const name = s.subject?.subject_name || s.subject_name || s.name || 'Subject';
        if (id && !map.has(id)) {
            map.set(id, { id, name });
        }
    });
    return Array.from(map.values());
};

// Helper component for Planning Widget
function PlanWidget() {
    const [page, setPage] = useState(1);
    const [type, setType] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const { data: response, loading, refetch } = useApiGet(`/plans?page=${page}&per_page=5&type=${type}&subject_id=${subjectId}`);

    const { data: subjectsData } = useApiGet('/subjects');
    const subjects = useMemo(() => formatSubjects(subjectsData || []), [subjectsData]);

    const plans = response?.data || [];
    const total = response?.total || 0;

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [formData, setFormData] = useState({ title: '', target_date: '', description: '' });
    const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

    useEffect(() => {
        if (selectedPlan) {
            setFormData({
                title: selectedPlan.title || '',
                description: selectedPlan.description || '',
                target_date: selectedPlan.target_date ? moment(selectedPlan.target_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            });
        }
    }, [selectedPlan]);

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

    const handleUpdatePlan = async (e) => {
        e.preventDefault();
        if (!selectedPlan) return;
        setIsUpdatingPlan(true);
        try {
            await api.put(`/plans/${selectedPlan.id}`, formData);
            showSuccess('Rencana belajar berhasil diperbarui!');
            refetch();
            setSelectedPlan(null);
        } catch (error) {
            console.error(error);
            showError('Kesalahan', 'Gagal memperbarui rencana belajar.');
        } finally {
            setIsUpdatingPlan(false);
        }
    };

    return (
        <div className="flex flex-col gap-stack-md">
            <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-headline-md text-on-surface">Selanjutnya</h3>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => router.visit('/student/plans')}
                        className="text-primary font-label-md hover:underline"
                    >
                        Lihat Semua
                    </button>
                </div>
            </div>

            <div className="flex gap-2">
                <select
                    value={subjectId}
                    onChange={(e) => { setSubjectId(e.target.value); setPage(1); }}
                    className="bg-surface border border-outline-variant rounded-md px-2.5 py-1 text-label-sm text-on-surface focus:border-primary outline-none"
                >
                    <option value="">Semua Mata Pelajaran</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select
                    value={type}
                    onChange={(e) => { setType(e.target.value); setPage(1); }}
                    className="bg-surface border border-outline-variant rounded-md px-2.5 py-1 text-label-sm text-on-surface focus:border-primary outline-none"
                >
                    <option value="">Semua Jenis</option>
                    <option value="lesson">Pelajaran</option>
                    <option value="assignment">Tugas</option>
                    <option value="assessment">Penilaian</option>
                </select>
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="text-on-surface-variant text-body-md py-6 text-center">Memuat rencana...</div>
                ) : plans.length > 0 ? (
                    plans.map(plan => {
                        const isCompleted = plan.progress >= 1;
                        let typeLabel = 'Target';
                        let typeColor = 'bg-surface-container text-on-surface-variant';
                        if (plan.planables?.[0]?.planable_type?.includes('Material')) {
                            typeLabel = 'Pelajaran';
                            typeColor = 'bg-secondary-container text-on-secondary-container';
                        } else if (plan.planables?.[0]?.planable_type?.includes('Assignment')) {
                            typeLabel = 'Tugas';
                            typeColor = 'bg-tertiary-container text-on-tertiary-container';
                        } else if (plan.planables?.[0]?.planable_type?.includes('Assessment')) {
                            typeLabel = 'Penilaian';
                            typeColor = 'bg-primary-container text-on-primary-container';
                        }

                        return (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${isCompleted
                                    ? 'bg-surface-container-low/50 border-outline-variant/30 opacity-75'
                                    : 'bg-surface-container-low border-outline-variant/60 hover:border-primary/50 hover:shadow-sm'
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={(e) => handleComplete(plan, e)}
                                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${isCompleted
                                        ? 'bg-primary text-on-primary'
                                        : 'border-2 border-outline hover:border-primary'
                                        }`}
                                >
                                    {isCompleted && <Icon name="check" className="text-[14px]" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor}`}>
                                            {typeLabel}
                                        </span>
                                        <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                                            <Icon name="event" className="text-[14px]" />
                                            {moment(plan.target_date).format('MMM D')}
                                        </span>
                                    </div>
                                    <p className={`text-label-lg font-semibold truncate ${isCompleted ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                                        {plan.title}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-on-surface-variant text-body-md p-6 bg-surface-container-low rounded-xl text-center border border-outline-variant/30 flex flex-col items-center gap-2">
                        <Icon name="event_busy" className="text-on-surface-variant text-[32px]" />
                        Tidak ada rencana yang akan datang ditemukan.
                    </div>
                )}
            </div>

            {total > 5 && (
                <Pagination
                    currentPage={page}
                    totalItems={total}
                    itemsPerPage={5}
                    onPageChange={setPage}
                    onItemsPerPageChange={() => { }}
                    itemsPerPageOptions={[5]}
                />
            )}

            <Modal show={!!selectedPlan} onClose={() => setSelectedPlan(null)} maxWidth="lg">
                {selectedPlan && (
                    <div className="p-6 max-h-[85vh] overflow-y-auto">
                        <div className="border-b border-outline-variant/50 pb-4 mb-6 flex justify-between items-start gap-4">
                            <div>
                                <p className="text-label-sm text-on-surface-variant font-label-sm uppercase tracking-wider">Tugas Target</p>
                                <p className="text-headline-sm font-headline-sm mt-1">
                                    {selectedPlan.planables?.[0]?.planable?.title || selectedPlan.title || 'Tanpa Judul'}
                                </p>
                                <p className="text-label-md text-on-surface-variant mt-2 flex items-center gap-1">
                                    <Icon name="event" className="text-[16px]" />
                                    {moment(selectedPlan.created_at).format('MMMM D, YYYY')}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdatePlan} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Judul Tujuan</label>
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
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Tanggal Target</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.target_date}
                                    onChange={e => setFormData({ ...formData, target_date: e.target.value })}
                                    onClick={(e) => { try { e.currentTarget.showPicker && e.currentTarget.showPicker(); } catch (err) {} }}
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer dark:[color-scheme:dark] dark:[&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>

                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Strategi Belajar (Deskripsi)</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe how you plan to achieve this goal..."
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors resize-y"
                                ></textarea>
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={isUpdatingPlan}
                                    className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                                >
                                    {isUpdatingPlan ? 'Memperbarui...' : 'Perbarui Rencana'}
                                </button>

                                <div className="flex gap-2">
                                    <Link
                                        href={getTargetLink(selectedPlan.planables?.[0], selectedPlan)}
                                        className="flex-1 flex justify-center items-center gap-2 py-3 bg-secondary-container text-on-secondary-container rounded-xl text-label-md font-label-md hover:opacity-90 transition-opacity"
                                    >
                                        <Icon name="arrow_forward" className="text-[18px]" />
                                        Lihat Tugas
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPlan(null)}
                                        className="flex-1 flex justify-center items-center gap-2 py-3 bg-surface-container text-on-surface rounded-xl text-label-md font-label-md hover:bg-surface-variant transition-opacity border border-outline-variant"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </form>
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
    const { data: response, loading, refetch } = useApiGet(`/reflections?page=${page}&per_page=5&type=${type}&subject_id=${subjectId}`);

    const { data: subjectsData } = useApiGet('/subjects');
    const subjects = useMemo(() => formatSubjects(subjectsData || []), [subjectsData]);

    const reflections = response?.data || [];
    const total = response?.total || 0;

    const [selectedRef, setSelectedRef] = useState(null);
    const [isUpdatingRef, setIsUpdatingRef] = useState(false);

    const handleUpdateRef = async (formData) => {
        if (!selectedRef) return;
        setIsUpdatingRef(true);
        try {
            await api.put(`/reflections/${selectedRef.id}`, {
                title: selectedRef.title,
                content: formData.content,
                comprehension_level: formData.comprehension_level,
                material_quality: formData.material_quality,
                emotions: formData.emotions,
            });
            showSuccess('Refleksi berhasil diperbarui!');
            refetch();
            setSelectedRef(null);
        } catch (error) {
            console.error(error);
            showError('Kesalahan', 'Gagal memperbarui refleksi.');
        } finally {
            setIsUpdatingRef(false);
        }
    };

    return (
        <div className="flex flex-col gap-stack-md">
            <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-headline-md text-on-surface">Refleksi Selesai</h3>
                <button
                    onClick={() => router.visit('/student/reflections')}
                    className="text-primary font-label-md hover:underline"
                >
                    Lihat Semua
                </button>
            </div>

            <div className="flex gap-2">
                <select
                    value={subjectId}
                    onChange={(e) => { setSubjectId(e.target.value); setPage(1); }}
                    className="bg-surface border border-outline-variant rounded-md px-2.5 py-1 text-label-sm text-on-surface focus:border-primary outline-none"
                >
                    <option value="">Semua Mata Pelajaran</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select
                    value={type}
                    onChange={(e) => { setType(e.target.value); setPage(1); }}
                    className="bg-surface border border-outline-variant rounded-md px-2.5 py-1 text-label-sm text-on-surface focus:border-primary outline-none"
                >
                    <option value="">Semua Jenis</option>
                    <option value="lesson">Pelajaran</option>
                    <option value="assignment">Tugas</option>
                    <option value="assessment">Penilaian</option>
                </select>
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="text-on-surface-variant text-body-md py-6 text-center">Memuat refleksi...</div>
                ) : reflections.length > 0 ? (
                    reflections.map(ref => {
                        const levelColors = {
                            5: 'bg-success text-on-success',
                            4: 'bg-primary text-on-primary',
                            3: 'bg-tertiary text-on-tertiary',
                            2: 'bg-warning text-on-warning',
                            1: 'bg-error text-on-error',
                        };

                        return (
                            <div
                                key={ref.id}
                                onClick={() => setSelectedRef(ref)}
                                className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-label-lg font-semibold text-on-surface truncate mb-1">
                                        {ref.title || 'Refleksi Tanpa Judul'}
                                    </p>
                                    <p className="text-label-sm text-on-surface-variant truncate">
                                        {ref.content || 'Tidak ada konten yang ditulis'}
                                    </p>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-md flex-shrink-0 ${levelColors[ref.comprehension_level] || 'bg-surface-variant text-on-surface-variant'}`} title={`Level ${ref.comprehension_level}/5`}>
                                    {ref.comprehension_level}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-on-surface-variant text-body-md p-6 bg-surface-container-low rounded-xl text-center border border-outline-variant/30 flex flex-col items-center gap-2">
                        <Icon name="done_all" className="text-primary text-[32px]" />
                        Tidak ada refleksi yang ditemukan.
                    </div>
                )}
            </div>

            {total > 5 && (
                <Pagination
                    currentPage={page}
                    totalItems={total}
                    itemsPerPage={5}
                    onPageChange={setPage}
                    onItemsPerPageChange={() => { }}
                    itemsPerPageOptions={[5]}
                />
            )}

            <Modal show={!!selectedRef} onClose={() => setSelectedRef(null)} maxWidth="lg">
                {selectedRef && (
                    <div className="p-6 max-h-[85vh] overflow-y-auto">
                        <div className="border-b border-outline-variant/50 pb-4 mb-4 flex justify-between items-start gap-4">
                            <div>
                                <p className="text-label-sm text-on-surface-variant font-label-sm uppercase tracking-wider">Tugas Target</p>
                                <p className="text-headline-sm font-headline-sm mt-1">
                                    {selectedRef.reflectables?.[0]?.reflectable?.title || selectedRef.title || 'Tanpa Judul'}
                                </p>
                                <p className="text-label-md text-on-surface-variant mt-2 flex items-center gap-1">
                                    <Icon name="event" className="text-[16px]" />
                                    {moment(selectedRef.created_at).format('MMMM D, YYYY h:mm A')}
                                </p>
                            </div>
                        </div>

                        {selectedRef.teacher_comment && (
                            <div className="mb-4">
                                <span className="text-label-md font-label-md text-primary block mb-2 flex items-center gap-2">
                                    <Icon name="forum" className="text-[18px]" />
                                    Umpan Balik Guru
                                </span>
                                <div className="text-body-md whitespace-pre-wrap bg-primary-container text-on-primary-container p-4 rounded-xl leading-relaxed shadow-sm">
                                    {selectedRef.teacher_comment}
                                </div>
                            </div>
                        )}

                        <ReflectionForm
                            key={selectedRef.id}
                            initialData={{
                                ...selectedRef,
                                emotions: typeof selectedRef.emotions === 'string' ? JSON.parse(selectedRef.emotions) : (selectedRef.emotions || [])
                            }}
                            onSubmit={handleUpdateRef}
                            onCancel={() => setSelectedRef(null)}
                            loading={isUpdatingRef}
                            showQuality={selectedRef.reflectables?.[0]?.reflectable_type?.includes('Material') || false}
                            extraActions={
                                <Link
                                    href={getTargetLink(selectedRef.reflectables?.[0], selectedRef)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-full text-label-md font-label-md hover:opacity-90 transition-opacity"
                                >
                                    <Icon name="arrow_forward" className="text-[18px]" />
                                    Lihat Tugas
                                </Link>
                            }
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default function Dashboard() {
    const [subjectFilter, setSubjectFilter] = useState('');
    const { data: subjectsData } = useApiGet('/subjects');
    const subjects = useMemo(() => formatSubjects(subjectsData || []), [subjectsData]);

    const { data, loading } = useApiGet(`/dashboard?subject_id=${subjectFilter}`);

    const stats = data?.weekly_stats || { total: 0, completed: 0, progress: 0 };
    const lmsProgress = data?.lms_progress || { material: 0, assignment: 0, assessment: 0 };

    const comprehension = useMemo(() => {
        const dist = data?.comprehension_distribution || {};
        const avgScore = data?.comprehension_average || 0;
        const totalCount = data?.comprehension_total || 0;

        const level5 = parseInt(dist[5] || 0, 10);
        const level4 = parseInt(dist[4] || 0, 10);
        const level3 = parseInt(dist[3] || 0, 10);
        const level2 = parseInt(dist[2] || 0, 10);
        const level1 = parseInt(dist[1] || 0, 10);
        const total = level5 + level4 + level3 + level2 + level1 || totalCount;

        if (total === 0) {
            return {
                total: 0,
                averageScore: 0,
                level5: 0, level4: 0, level3: 0, level2: 0, level1: 0,
                label: 'Belum ada penilaian'
            };
        }

        const calculatedAvg = avgScore || ((level5 * 5 + level4 * 4 + level3 * 3 + level2 * 2 + level1 * 1) / total).toFixed(1);

        let label = 'Kuat';
        if (calculatedAvg >= 4.5) label = 'Sangat Baik';
        else if (calculatedAvg >= 3.5) label = 'Kuat';
        else if (calculatedAvg >= 2.5) label = 'Baik';
        else if (calculatedAvg >= 1.5) label = 'Cukup';
        else label = 'Perlu Perbaikan';

        return {
            total,
            averageScore: calculatedAvg,
            label,
            level5: Math.round((level5 / total) * 100),
            level4: Math.round((level4 / total) * 100),
            level3: Math.round((level3 / total) * 100),
            level2: Math.round((level2 / total) * 100),
            level1: Math.round((level1 / total) * 100),
        };
    }, [data?.comprehension_distribution, data?.comprehension_average, data?.comprehension_total]);

    const headerSection = (
        <section className="flex flex-row items-center justify-between gap-4 pt-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Pusat Pembelajaran</h2>
                <p className="text-body-md text-on-surface-variant">Ringkasan pribadi Anda untuk perencanaan, pemantauan, dan refleksi.</p>
            </div>
            <div className="flex items-center justify-end flex-shrink-0">
                <button
                    onClick={() => router.visit('/student/plans')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold shadow-sm hover:bg-primary/95 active:scale-95 transition-all"
                    type="button"
                >
                    <Icon name="add" className="text-lg" />
                    <span>Tambah Rencana</span>
                </button>
            </div>
        </section>
    );

    if (loading) {
        return (
            <DashboardTemplate role="student" activeTab="dashboard" title="Pusat Pembelajaran">
                <div className="flex justify-center p-12 text-on-surface-variant">Memuat data pusat pembelajaran...</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate
            role="student"
            activeTab="dashboard"
            title="Pusat Pembelajaran"
            headerSection={headerSection}
            showBack={false}
        >
            <Head title="Pusat Siswa - Diajar" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter pb-12 items-start">

                <div className="flex flex-col gap-stack-md">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-headline-md font-headline-md text-on-surface">Ringkasan Pemantauan</h3>
                        <select
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="bg-surface border border-outline-variant rounded-xl px-3 py-1.5 text-label-sm text-on-surface focus:border-primary outline-none transition-colors"
                        >
                            <option value="">Semua Mata Pelajaran</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-label-md font-label-md text-on-surface-variant mb-1">Kemajuan Rencana Mingguan</p>
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
                            <p className="text-label-md font-label-md text-on-surface-variant">Tingkat Penyelesaian LMS</p>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Materi</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary transition-all" style={{ width: `${lmsProgress.material}%` }}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.material}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Tugas</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-tertiary transition-all" style={{ width: `${lmsProgress.assignment}%` }}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.assignment}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-24 text-label-sm text-on-surface-variant">Penilaian</span>
                                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all" style={{ width: `${lmsProgress.assessment}%` }}></div>
                                    </div>
                                    <span className="w-8 text-right text-label-sm text-on-surface">{lmsProgress.assessment}%</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-outline-variant/30" />

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-label-md font-label-md text-on-surface-variant">Statistik Rata-rata Pemahaman</p>
                                {/* {comprehension.total > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-primary-container text-on-primary-container">
                                        5-Point Scale
                                    </span>
                                )} */}
                            </div>

                            {comprehension.total > 0 ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between bg-surface p-3 rounded-xl border border-outline-variant/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-headline-sm">
                                                {comprehension.averageScore}
                                            </div>
                                            <div>
                                                <p className="font-label-lg font-bold text-on-surface">{comprehension.label}</p>
                                                <p className="text-label-sm text-on-surface-variant">Berdasarkan {comprehension.total} refleksi</p>
                                            </div>
                                        </div>
                                        <div className="text-label-sm font-bold text-primary">/ 5.0</div>
                                    </div>

                                    <div className="w-full flex h-3.5 rounded-full overflow-hidden bg-surface-container-high">
                                        {comprehension.level5 > 0 && <div className="h-full bg-success transition-all" style={{ width: `${comprehension.level5}%` }} title={`Level 5 (Excellent): ${comprehension.level5}%`}></div>}
                                        {comprehension.level4 > 0 && <div className="h-full bg-primary transition-all" style={{ width: `${comprehension.level4}%` }} title={`Level 4 (Strong): ${comprehension.level4}%`}></div>}
                                        {comprehension.level3 > 0 && <div className="h-full bg-tertiary transition-all" style={{ width: `${comprehension.level3}%` }} title={`Level 3 (Good): ${comprehension.level3}%`}></div>}
                                        {comprehension.level2 > 0 && <div className="h-full bg-warning transition-all" style={{ width: `${comprehension.level2}%` }} title={`Level 2 (Fair): ${comprehension.level2}%`}></div>}
                                        {comprehension.level1 > 0 && <div className="h-full bg-error transition-all" style={{ width: `${comprehension.level1}%` }} title={`Level 1 (Needs Work): ${comprehension.level1}%`}></div>}
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-on-surface-variant">
                                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> L5 ({comprehension.level5}%)</div>
                                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> L4 ({comprehension.level4}%)</div>
                                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> L3 ({comprehension.level3}%)</div>
                                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning"></span> L2 ({comprehension.level2}%)</div>
                                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error"></span> L1 ({comprehension.level1}%)</div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-label-sm text-on-surface-variant italic">Belum ada refleksi yang dicatat.</p>
                            )}
                        </div>
                    </div>
                </div>

                <PlanWidget />
                <ReflectionWidget />

            </div>
        </DashboardTemplate>
    );
}
