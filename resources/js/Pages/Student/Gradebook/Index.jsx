import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';

export default function Index() {
    const { data: gradeData, loading } = useApiGet('/gradebook');

    const headerSection = (
        <section>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Gradebook</h1>
            <p className="text-on-surface-variant text-body-md mt-1">View your performance across all enrolled courses.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            activeTab="grades" // Custom tab? Or just dashboard
            title="Gradebook"
            headerSection={headerSection}
        >
            <Head title="Gradebook - Diajar LMS" />

            <div className="max-w-3xl mx-auto space-y-stack-lg">
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-on-surface-variant">Loading grades...</div>
                    ) : gradeData && gradeData.length > 0 ? (
                        gradeData.map((grade) => (
                            <div key={grade.class_id} className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container">
                                        <Icon name="school" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{grade.subject_name}</h3>
                                        <p className="text-label-sm text-outline-variant">{grade.subject_code} • {grade.total_items} graded items</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-display-sm text-primary font-bold">{grade.average}%</div>
                                    <p className="text-label-sm text-outline-variant uppercase">Average</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">
                            No grades available yet.
                        </div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
