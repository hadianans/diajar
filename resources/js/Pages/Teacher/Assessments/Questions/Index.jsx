import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import QuestionFilters from '@/Components/features/teacher-questions/QuestionFilters';
import QuestionCard from '@/Components/features/teacher-questions/QuestionCard';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError, confirmDelete } from '@/utils/swal';

export default function Index() {
    const { data: response, loading } = useApiGet('/questions');

    const handleCreate = () => {
        router.visit(route('teacher.assessments.questions.create'));
    };

    const handleDelete = async (id) => {
        const confirmed = await confirmDelete('Hapus Soal?', 'Tindakan ini akan menghapus soal ini secara permanen.');
        if (!confirmed) return;
        try {
            await api.delete(`/questions/${id}`);
            window.location.reload();
        } catch (err) {
            showError('Kesalahan', err.response?.data?.message || 'Kesalahan saat menghapus soal');
        }
    };

    const questionsData = response?.data || [];
    const totalQuestions = response?.total || 0;

    const customTitleSection = (
        <div>
            <h2 className="font-headline-md text-headline-md font-bold text-primary">Bank Soal</h2>
            <span className="text-xs text-on-surface-variant hidden md:block mt-1">{totalQuestions} soal tersedia</span>
        </div>
    );

    const actions = (
        <button
            onClick={handleCreate}
            className="bg-primary-container text-on-primary-container hover:bg-primary transition-colors px-6 py-2 rounded-full font-label-md text-label-md shadow-sm active:scale-95 flex items-center gap-2"
        >
            <Icon name="add" className="text-sm" />
            Buat Soal
        </button>
    );

    const getLevelClass = (level) => {
        const lv = Number(level);
        if (lv <= 2) return 'bg-green-100 text-green-700';
        if (lv <= 4) return 'bg-yellow-100 text-yellow-700';
        return 'bg-purple-100 text-purple-700';
    };

    const getLevelColorClass = (level) => {
        const lv = Number(level);
        if (lv <= 2) return 'bg-green-500';
        if (lv <= 4) return 'bg-yellow-500';
        return 'bg-purple-500';
    };

    const questions = questionsData.map(q => ({
        id: q.id,
        level: `Level ${parseInt(q.levels) + 1}`,
        levelClass: getLevelClass(q.levels),
        levelColorClass: getLevelColorClass(q.levels),
        points: q.score,
        title: q.question.replace(/<[^>]+>/g, ''), // Strip HTML for list view
        tags: (q.tags || []).map(t => t.name)
    }));

    const headerSection = (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            {customTitleSection}
            {actions}
        </div>
    );

    return (
        <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection}>
            <Head title="Bank Soal | LMS Diajar" />

            <div className="max-w-6xl mx-auto w-full pb-20 md:pb-0">
                <QuestionFilters />

                {/* List Metadata & Sorting */}
                <div className="flex items-center justify-between mb-stack-md mt-4">
                    <p className="text-body-md text-on-surface-variant">Menampilkan <span className="font-bold text-on-surface">{questions.length}</span> dari {totalQuestions} soal</p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-outline">Urutkan berdasarkan:</span>
                        <button className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant hover:bg-surface transition-colors font-label-md text-label-md">
                            Terbaru Dahulu
                            <Icon name="expand_more" className="text-sm" />
                        </button>
                    </div>
                </div>

                {/* Question Cards Container */}
                {loading ? (
                    <div className="text-center py-12 text-on-surface-variant">Memuat soal...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {questions.length > 0 ? (
                            questions.map((q) => (
                                <QuestionCard key={q.id} {...q} onDelete={() => handleDelete(q.id)} />
                            ))
                        ) : (
                            <div className="p-8 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                                Tidak ada soal yang ditemukan di bank Anda.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardTemplate>
    );
}
