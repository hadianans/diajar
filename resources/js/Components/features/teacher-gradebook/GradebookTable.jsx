import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function GradebookTable({ students, averages }) {
    // Averages and columns could be dynamic, but matching mockup structure for now
    
    return (
        <div className="bg-white border border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] rounded-xl overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant">
                            <th className="sticky left-0 z-10 px-6 py-4 font-label-md text-label-md bg-surface-container border-r border-outline-variant/30">Student Name</th>
                            <th className="px-6 py-4 font-label-md text-label-md">Genetics Lab (40%)</th>
                            <th className="px-6 py-4 font-label-md text-label-md">Cell Quiz (20%)</th>
                            <th className="px-6 py-4 font-label-md text-label-md">Midterm (40%)</th>
                            <th className="px-6 py-4 font-label-md text-label-md bg-primary-fixed text-primary font-bold border-l border-outline-variant/30">Final Grade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                        {/* Class Average Pinned */}
                        <tr className="bg-surface-container-low font-bold">
                            <td className="sticky left-0 z-10 px-6 py-4 font-label-md text-label-md bg-surface-container-low border-r border-outline-variant/30">Class Average</td>
                            <td className="px-6 py-4 font-label-md text-label-md">{averages.lab}</td>
                            <td className="px-6 py-4 font-label-md text-label-md">{averages.quiz}</td>
                            <td className={`px-6 py-4 font-label-md text-label-md ${averages.midterm === 'Missing' ? 'text-error' : ''}`}>{averages.midterm}</td>
                            <td className="px-6 py-4 font-label-md text-label-md bg-surface-container-high border-l border-outline-variant/30">{averages.final}</td>
                        </tr>

                        {/* Student Rows */}
                        {students.map((student, idx) => (
                            <tr key={idx} className="hover:bg-surface-bright transition-colors group cursor-pointer">
                                <td className="sticky left-0 z-10 px-6 py-4 flex items-center gap-3 bg-surface-container-lowest group-hover:bg-surface-bright border-r border-outline-variant/30">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-highest">
                                        {student.avatar && <img src={student.avatar} className="w-full h-full object-cover" alt={student.name} />}
                                    </div>
                                    <span className="font-body-md text-body-md font-medium text-on-surface">{student.name}</span>
                                </td>
                                <td className="px-6 py-4 font-body-md text-body-md">
                                    {student.lab === 'Missing' ? (
                                        <span className="px-3 py-1 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant rounded-full text-label-sm font-label-sm">Missing</span>
                                    ) : student.lab}
                                </td>
                                <td className="px-6 py-4 font-body-md text-body-md">
                                    {student.quiz === 'Pending' ? (
                                        <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-label-sm">Pending</span>
                                    ) : student.quiz}
                                </td>
                                <td className="px-6 py-4 font-body-md text-body-md">
                                    {student.midterm === 'Pending' ? (
                                        <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-label-sm">Pending</span>
                                    ) : student.midterm}
                                </td>
                                <td className="px-6 py-4 font-label-md text-label-md bg-surface-container-low font-bold border-l border-outline-variant/30">
                                    {student.final}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer Pagination */}
            <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between">
                <p className="font-label-sm text-label-sm text-on-surface-variant">Showing {students.length} of 24 students</p>
                <div className="flex items-center gap-4">
                    <button className="p-1 rounded-full hover:bg-surface-container-low disabled:opacity-30 transition-colors" disabled>
                        <Icon name="chevron_left" />
                    </button>
                    <span className="font-label-sm text-label-sm font-bold">1</span>
                    <button className="p-1 rounded-full hover:bg-surface-container-low transition-colors">
                        <Icon name="chevron_right" />
                    </button>
                </div>
            </div>
        </div>
    );
}
