import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function GradebookTable({ students, columns, averages }) {
    
    return (
        <div className="bg-surface-container-lowest border border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] rounded-xl overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant">
                            <th className="sticky left-0 z-10 px-6 py-4 font-label-md text-label-md bg-surface-container border-r border-outline-variant/30 min-w-[200px]">Student Name</th>
                            {columns && columns.map(c => (
                                <th key={c.key} className="px-6 py-4 font-label-md text-label-md min-w-[120px]">{c.label}</th>
                            ))}
                            <th className="px-6 py-4 font-label-md text-label-md bg-primary-fixed text-primary font-bold border-l border-outline-variant/30 min-w-[120px]">Final Grade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                        {/* Class Average Pinned (Mocked for now since not fully supported by API per column) */}
                        <tr className="bg-surface-container-low font-bold">
                            <td className="sticky left-0 z-10 px-6 py-4 font-label-md text-label-md bg-surface-container-low border-r border-outline-variant/30">Class Average</td>
                            {columns && columns.map(c => (
                                <td key={`avg-${c.key}`} className="px-6 py-4 font-label-md text-label-md">-</td>
                            ))}
                            <td className="px-6 py-4 font-label-md text-label-md bg-surface-container-high border-l border-outline-variant/30">-</td>
                        </tr>

                        {/* Student Rows */}
                        {students && students.map((student, idx) => (
                            <tr key={student.id || idx} className="hover:bg-surface-bright transition-colors group cursor-pointer">
                                <td className="sticky left-0 z-10 px-6 py-4 flex items-center gap-3 bg-surface-container-lowest group-hover:bg-surface-bright border-r border-outline-variant/30">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-highest">
                                        {student.avatar ? (
                                            <img src={student.avatar} className="w-full h-full object-cover" alt={student.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary text-on-primary font-bold text-xs uppercase">
                                                {student.name ? student.name.substring(0, 2) : '??'}
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-body-md text-body-md font-medium text-on-surface whitespace-nowrap">{student.name}</span>
                                </td>
                                {columns && columns.map(c => (
                                    <td key={`${student.id || idx}-${c.key}`} className="px-6 py-4 font-body-md text-body-md">
                                        {student[c.key] === 'Missing' ? (
                                            <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-label-sm">Missing</span>
                                        ) : student[c.key] === 'pending' || student[c.key] === 'Pending' ? (
                                            <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-label-sm">Pending</span>
                                        ) : (
                                            student[c.key] !== null && student[c.key] !== undefined ? student[c.key] : '-'
                                        )}
                                    </td>
                                ))}
                                <td className="px-6 py-4 font-label-md text-label-md bg-surface-container-low font-bold border-l border-outline-variant/30">
                                    {student.final}%
                                </td>
                            </tr>
                        ))}
                        {(!students || students.length === 0) && (
                            <tr>
                                <td colSpan={(columns?.length || 0) + 2} className="px-6 py-12 text-center text-on-surface-variant">
                                    No students found in this class.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Footer Pagination */}
            <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between">
                <p className="font-label-sm text-label-sm text-on-surface-variant">Showing {students?.length || 0} students</p>
                <div className="flex items-center gap-4">
                    <button className="p-1 rounded-full hover:bg-surface-container-low disabled:opacity-30 transition-colors" disabled>
                        <Icon name="chevron_left" />
                    </button>
                    <span className="font-label-sm text-label-sm font-bold">1</span>
                    <button className="p-1 rounded-full hover:bg-surface-container-low disabled:opacity-30 transition-colors" disabled>
                        <Icon name="chevron_right" />
                    </button>
                </div>
            </div>
        </div>
    );
}
