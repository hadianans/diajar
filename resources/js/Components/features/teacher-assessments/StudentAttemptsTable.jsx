import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function StudentAttemptsTable({ assessmentId, attempts }) {
    const [filter, setFilter] = useState('All');

    const handleRowClick = (studentId) => {
        router.visit(route('teacher.assessments.students.show', { assessmentId: assessmentId || 1, studentId }));
    };

    return (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden mt-stack-lg">
            <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-headline-md text-headline-md">Student Attempts</h3>
                
                <div className="flex items-center bg-surface-container rounded-lg p-1">
                    {['All', 'In Progress', 'Submitted'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-label-md font-label-md transition-colors ${
                                filter === f 
                                ? 'bg-surface-container-lowest shadow-sm text-primary' 
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-surface-container-low text-on-surface-variant text-left">
                        <tr>
                            <th className="px-6 py-4 font-label-md text-label-md">Student</th>
                            <th className="px-6 py-4 font-label-md text-label-md">Status</th>
                            <th className="px-6 py-4 font-label-md text-label-md">Time Taken</th>
                            <th className="px-6 py-4 font-label-md text-label-md text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {attempts.map((attempt, idx) => (
                            <tr 
                                key={idx} 
                                onClick={() => handleRowClick(attempt.studentId)}
                                className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant">
                                            {attempt.avatar ? (
                                                <img src={attempt.avatar} className="w-full h-full object-cover" alt="Student" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-on-surface-variant">{attempt.initials}</div>
                                            )}
                                        </div>
                                        <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{attempt.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {attempt.status === 'Submitted' ? (
                                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">Submitted</span>
                                    ) : (
                                        <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">In Progress</span>
                                    )}
                                </td>
                                <td className={`px-6 py-4 font-body-md text-body-md ${attempt.status === 'In Progress' ? 'text-error' : 'text-on-surface-variant'}`}>
                                    {attempt.timeText}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {attempt.score ? (
                                        <span className="font-headline-md text-headline-md text-secondary">{attempt.score}/100</span>
                                    ) : (
                                        <span className="font-headline-md text-headline-md text-outline-variant">--</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 bg-surface-container-low text-center">
                <button className="text-primary font-label-md text-label-md hover:underline transition-all">Download CSV Report</button>
            </div>
        </section>
    );
}
