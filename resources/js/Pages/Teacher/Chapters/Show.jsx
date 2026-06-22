import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ChapterHeader from '@/Components/features/teacher-chapters/ChapterHeader';
import CurriculumAccordion from '@/Components/features/teacher-chapters/CurriculumAccordion';
import LessonItem from '@/Components/features/teacher-chapters/LessonItem';
import AssignmentSummaryCard from '@/Components/features/teacher-chapters/AssignmentSummaryCard';
import AssessmentSummaryCard from '@/Components/features/teacher-chapters/AssessmentSummaryCard';
import FloatingActionBar from '@/Components/features/teacher-chapters/FloatingActionBar';
import Icon from '@/Components/shared/ui/Icon';

export default function Show({ chapterId }) {

    const headerSection = (
        <ChapterHeader
            title={`Chapter ${chapterId}: Cell Structure & Function`}
            description="Explore the intricate architecture of life. This chapter covers the microscopic components that define biological boundaries and cellular powerhouses."
            coverImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCVZh3r-NE7MIgc4V1wqC0qiWpXgd3KoV67K2XGipW6aTqBpI6dwLKCiwPiYlsqlpWNbJFUxmaHcvcyY4fUPrvlvNkq-UdkBF-NglJtffaeIRJRwsJbZuzkjDW4URD2Ze5CVUGVGeb-_9L6N_eQ3wQXtx0sWjRnaTxkRJkys7P2wGKoTeaxTU80Xla4Mziu7e8t76C96YgIFGX0H2grNxtTsMLKPNsQfr-pxXHNeIZjeFSBfCODaCCSpAS8eI9pg0tbHpYpbbcm0ww"
        />
    );

    return (
        <DashboardTemplate
            role="teacher"
            title="Chapter Management"
            headerSection={headerSection}
            actions={(
                <button className="transition-colors duration-200 active:scale-95 text-primary hover:bg-surface-container-high p-2 rounded-full">
                    <Icon name="edit" />
                </button>
            )}
        >
            <Head title={`Chapter ${chapterId} - Chapter Management`} />

            {/* Content Tree Section */}
            <section className="mb-stack-lg">
                <div className="flex items-center justify-between mb-stack-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Curriculum Content</h3>
                    <span className="text-label-sm font-label-sm text-outline px-3 py-1 bg-surface-container rounded-full">Biology - Class 11A</span>
                </div>

                <div className="space-y-4">
                    <CurriculumAccordion title="Cell Membrane" materialsCount={2} defaultOpen={true}>
                        <LessonItem chapterId={chapterId} lessonId="1" title="Intro to Cell Membranes" type="text" />
                        <LessonItem chapterId={chapterId} lessonId="2" title="Fluid Mosaic Model" type="video" />
                    </CurriculumAccordion>

                    <CurriculumAccordion title="Organelles" materialsCount={2} defaultOpen={true}>
                        <LessonItem chapterId={chapterId} lessonId="3" title="Mitochondria: Powerhouse" type="video" />
                        <LessonItem chapterId={chapterId} lessonId="4" title="Protein Synthesis" type="text" />
                    </CurriculumAccordion>
                </div>
            </section>

            {/* Assignments & Assessments Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg pb-32">
                {/* Assignments Section */}
                <section>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Assignments</h3>
                    <div className="space-y-4">
                        <AssignmentSummaryCard
                            title="Cell Labeling Worksheet"
                            linkedMaterial="Intro material"
                            submitted={28}
                            totalStudents={32}
                            submissionRate={87}
                            graded={20}
                            gradedRate={71}
                        />
                        <button className="w-full py-3 flex items-center justify-center gap-2 bg-primary/5 border border-primary/20 rounded-lg text-label-md font-label-md text-primary hover:bg-primary/10 transition-colors">
                            <Icon name="assignment_add" />
                            Add assignment
                        </button>
                    </div>
                </section>

                {/* Assessments Section */}
                <section>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Assessments</h3>
                    <div className="space-y-4">
                        <AssessmentSummaryCard
                            title="Cell Structure Quiz"
                            duration={45}
                            attempts={25}
                            totalStudents={32}
                            averageScore={78}
                            studentInitials={['JD', 'AS', 'MK', 'ZZ']}
                        />
                        <button className="w-full py-3 flex items-center justify-center gap-2 bg-tertiary-container/5 border border-tertiary-container/20 rounded-lg text-label-md font-label-md text-tertiary hover:bg-tertiary-container/10 transition-colors">
                            <Icon name="post_add" />
                            Add assessment
                        </button>
                    </div>
                </section>
            </div>

            <FloatingActionBar
                onAddSubchapter={() => console.log('add subchapter')}
                onAddMaterial={() => router.visit(route('teacher.chapters.lessons.create'))}
                onAddTask={() => console.log('add task')}
            />

        </DashboardTemplate>
    );
}
