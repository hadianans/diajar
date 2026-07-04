import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ChapterFilterBar from '@/Components/features/teacher-chapters/ChapterFilterBar';
import ChapterListCard from '@/Components/features/teacher-chapters/ChapterListCard';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import ChapterModal from '@/Components/features/teacher-chapters/modals/ChapterModal';

export default function Index() {
    const { data: chapters, loading, refetch } = useApiGet('/chapters');
    const [showModal, setShowModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);

    const headerSection = (
        <section className="mb-stack-lg">
            <div className="flex flex-col gap-1">
                <span className="text-primary font-label-md tracking-wider uppercase">Curriculum</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">My Chapters</h2>
                <p className="text-on-surface-variant font-body-md">Manage your curriculum chapters, review materials, and track overall structure.</p>
            </div>
        </section>
    );

    const handleCreateChapter = () => {
        setEditingChapter(null);
        setShowModal(true);
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!confirm('Are you sure you want to delete this chapter?')) return;
        try {
            await api.delete(`/chapters/${chapterId}`);
            refetch();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting chapter');
        }
    };

    return (
        <DashboardTemplate role="teacher" activeTab="chapters" title="Chapters" headerSection={headerSection}>
            <Head title="Chapters | Diajar LMS" />

            <ChapterFilterBar />

            {loading ? (
                <div className="text-center py-12 text-on-surface-variant">Loading chapters...</div>
            ) : (
                <div className="flex flex-col gap-stack-md relative pb-24">
                    {chapters && chapters.length > 0 ? (
                        chapters.map((ch, idx) => (
                            <ChapterListCard
                                key={ch.id}
                                chapterId={ch.id}
                                number={idx + 1}
                                title={ch.name}
                                description={ch.description || 'No description provided.'}
                                materialsCount={ch.materials_count || 0}
                                assignmentsCount={ch.class_assignments_count || 0}
                                assessmentsCount={ch.class_assessments_count || 0}
                                completionProgress={0} // To be calculated or mocked if needed
                                onEdit={() => {
                                    setEditingChapter(ch);
                                    setShowModal(true);
                                }}
                                onDelete={() => handleDeleteChapter(ch.id)}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                            You haven't created any chapters yet.
                        </div>
                    )}
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={handleCreateChapter}
                className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-transform group z-40"
            >
                <Icon name="add" className="text-[32px] group-hover:rotate-90 transition-transform" />
                <div className="absolute right-16 bg-inverse-surface text-inverse-on-surface px-3 py-1 rounded text-label-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    New Chapter
                </div>
            </button>

            <ChapterModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    setShowModal(false);
                    refetch();
                }}
                initialData={editingChapter}
            />
        </DashboardTemplate>
    );
}
