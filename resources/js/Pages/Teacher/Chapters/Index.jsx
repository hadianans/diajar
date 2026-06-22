import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ChapterFilterBar from '@/Components/features/teacher-chapters/ChapterFilterBar';
import ChapterListCard from '@/Components/features/teacher-chapters/ChapterListCard';
import Icon from '@/Components/shared/ui/Icon';

export default function Index() {
    const headerSection = (
        <section className="mb-stack-lg">
            <div className="flex flex-col gap-1">
                <span className="text-primary font-label-md tracking-wider uppercase">Academic Year 2023/2024</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Biology - Class 11A</h2>
                <p className="text-on-surface-variant font-body-md">Manage your curriculum chapters, review class performance, and track overall student engagement.</p>
            </div>
        </section>
    );

    const handleCreateChapter = () => {
        // Mock action
        console.log("Create new chapter");
    };

    return (
        <DashboardTemplate role="teacher" title="Chapters" headerSection={headerSection}>
            <Head title="Chapters" />

            <ChapterFilterBar />

            <div className="flex flex-col gap-stack-md relative pb-24">
                <ChapterListCard
                    chapterId="1"
                    number={1}
                    title="Introduction to Biology"
                    description="Fundamental concepts of life, scientific method, and biological organization."
                    materialsCount={10}
                    assignmentsCount={2}
                    assessmentsCount={1}
                    completionProgress={95}
                />
                <ChapterListCard
                    chapterId="2"
                    number={2}
                    title="Cell Structure & Function"
                    description="Exploring the microscopic world: Organelles, membranes, and cellular metabolism."
                    materialsCount={15}
                    assignmentsCount={3}
                    assessmentsCount={2}
                    completionProgress={82}
                />
                <ChapterListCard
                    chapterId="3"
                    number={3}
                    title="Molecular Basis of Inheritance"
                    description="The blueprint of life: DNA replication, transcription, and translation mechanics."
                    materialsCount={12}
                    assignmentsCount={2}
                    assessmentsCount={1}
                    completionProgress={45}
                />
                <ChapterListCard
                    chapterId="4"
                    number={4}
                    title="Evolution & Biodiversity"
                    description="Natural selection, adaptation, and the diverse tree of life across geological time."
                    materialsCount={8}
                    assignmentsCount={1}
                    assessmentsCount={1}
                    completionProgress={10}
                />
            </div>

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
        </DashboardTemplate>
    );
}
