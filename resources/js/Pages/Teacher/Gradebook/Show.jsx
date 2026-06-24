import React from 'react';
import { Head, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import GradebookOverview from '@/Components/features/teacher-gradebook/GradebookOverview';
import GradebookTable from '@/Components/features/teacher-gradebook/GradebookTable';

export default function Index() {
    const handleBack = () => {
        router.visit(route('teacher.classes.show', { id: 1 }));
    };

    const averages = {
        lab: '82%',
        quiz: '78%',
        midterm: 'Missing',
        final: 'B+'
    };

    const students = [
        {
            name: 'Alex Johnson',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBm7PPgNgpoI5jUeRM8ijsidSv4r6vIbekcnJSARSM-YfS-dNJwB5S0RCAXD0rtZVhMu3gW8UEjRuFDwmaSr-nKMSH3c3zPbidQAAXsx-uYnwH0DcM3zUdL2vJMLQtMit_rO5DRCXCzoSI6nQ2x3fcEZj8ozfdkMxtGbGKxff4_Eh4HEhRkGeF-qY0kg02CDbZn5AUY-Y-X5T_BQfRClZ9VM5hzyoUu49rnuhRvgwcSMaGwKLo4qXFr4Z3W6Mk4QccK3hYJqa_8-Q',
            lab: '85%',
            quiz: 'Pending',
            midterm: '80%',
            final: 'B'
        },
        {
            name: 'Maria Garcia',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOOqezyeH4gNObVt6zs6TJcvQ9h4C-KM7MsA_qEtopkLO6di6_YT2A-3gYhl1R4tNz6cjqrJ1JsQj-dEhHAbjDDHbb5xonfyNZMLGC6LKGtsa7UkGNtvZRNWx3XI9XP-ZB_nlOH523uzyIsSEsf-eO2sWNzIGLqAeGAtwmHHDCJSs6w33HBTb3ddVXa5RduRsfUzcZbBD2sfo_1PqAaw7qOwmfK3C80DfAuN2VZo_IZ41oTJS_YlGH7dTdbVy9S7VS44EKMXjnUOQ',
            lab: '92%',
            quiz: '88%',
            midterm: '95%',
            final: 'A'
        },
        {
            name: 'Liam Chen',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHt2AG2p9wX6-ZP6F5G7np37ye3Wql8t37auLSNePZfs-2KyYEvoVIrMCaJgr5Z8JNQyAlMcHKuGYa1ZGpvjUbe76_kY14rtzr_9atEVAgwoDUUll1upA14fu-U2MpmXFAYP7ldpwAvOxwIWRys_FHEwKWU3gqsZCrPPhp3UULciBwZ-LP0EWn16mHMt8Zct_BoEVCCS28DwzOWdJVKNpPP6sfSxDjEK5TD3ak-c_2v8pPyxQzsvbBR6qtq3YWU-E2JHU4Tg-lwN4',
            lab: 'Missing',
            quiz: '70%',
            midterm: '65%',
            final: 'C-'
        },
        {
            name: 'Sarah Miller',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeSbwTObjelwHzeIA39HIg5zmMy8wVYaspv08zjg4EBTOoGm4mx09N2lHrdEOag5gyFP7luvbbtDBT_l6NArE9KE9c3kKTDh256_IeLjYYeEFl5lHDTpemNlx4gEdao8sH6ydUDZ_0AD--aLvyhuH3JVQZX_WDYru_5OeSKKVmsFLfEu8cCcEVh2ybeY7hyiCFMXRrWWGSBVuBsfL7AbB2B644zn55wCFa7VIoGo7GNK0oFogaJDZe871xdWVxuxbMp-3HdfOzq6I',
            lab: '88%',
            quiz: '84%',
            midterm: 'Pending',
            final: 'B+'
        }
    ];

    return (
        <div className="bg-[#FAFAFA] text-on-surface min-h-screen pb-24">
            <Head title="Class Gradebook" />

            {/* Top App Bar */}
            <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile h-16 bg-surface shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="hover:bg-surface-container-low transition-colors active:scale-95 duration-100 p-2 rounded-full"
                    >
                        <Icon name="arrow_back" className="text-primary" />
                    </button>
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Class Gradebook</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="hover:bg-surface-container-low transition-colors active:scale-95 duration-100 p-2 rounded-full">
                        <Icon name="more_vert" className="text-primary" />
                    </button>
                </div>
            </header>

            <main className="mt-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-stack-lg">
                    <h2 className="font-headline-lg text-headline-lg text-on-background">Biology 11A - Group A</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Grade 10 | 2024 Academic Year | 24 Students</p>
                </div>

                <GradebookOverview />

                {/* Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-gutter mb-stack-md">
                    <div className="flex gap-stack-sm">
                        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
                            <Icon name="filter_list" />
                            <span>Filter: All Columns</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
                            <Icon name="sort_by_alpha" />
                            <span>Sort: Name A-Z</span>
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                            <Icon name="download" />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                            <Icon name="print" />
                        </button>
                    </div>
                </div>

                <GradebookTable students={students} averages={averages} />
            </main>
        </div>
    );
}
