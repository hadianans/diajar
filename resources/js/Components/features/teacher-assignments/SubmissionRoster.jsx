import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import { Link } from '@inertiajs/react';

export default function SubmissionRoster({ assignmentId, students }) {
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <section className="space-y-stack-md">
            <div className="flex items-center justify-between gap-stack-md">
                <div className="relative flex-1 group">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input 
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl font-body-md text-on-surface focus:ring-2 focus:ring-primary transition-all" 
                        placeholder="Search students..." 
                        type="text" 
                    />
                </div>
                <button className="bg-primary text-on-primary px-4 py-3 rounded-xl font-label-md shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-transform">
                    <Icon name="task_alt" className="text-sm" />
                    <span className="hidden sm:inline">Grade All</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {['All (28)', 'Ungraded (16)', 'Graded (12)'].map(filter => (
                    <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter.split(' ')[0])}
                        className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md transition-colors ${
                            activeFilter === filter.split(' ')[0]
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Roster */}
            <div className="space-y-stack-sm">
                {students.map((student, idx) => (
                    <Link 
                        key={idx}
                        href={route('teacher.assignments.students.show', { assignmentId, studentId: student.id })}
                        className="block"
                    >
                        <div className="flex items-center justify-between p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl group hover:border-primary transition-colors active:scale-[0.98] duration-150">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${student.avatarColorClass}`}>
                                    {student.initials}
                                </div>
                                <div>
                                    <h4 className="font-label-md text-label-md text-on-surface">
                                        {student.name} <span className="text-on-surface-variant font-normal">({student.group})</span>
                                    </h4>
                                    <p className="text-[11px] text-on-surface-variant">Submitted {student.submittedAt}</p>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                {student.status === 'ungraded' ? (
                                    <span className="inline-block px-2 py-1 rounded bg-error-container text-on-error-container font-label-sm">Ungraded</span>
                                ) : (
                                    <>
                                        <div className="font-headline-md text-headline-md text-secondary">
                                            {student.grade}<span className="text-[12px] text-on-surface-variant">/100</span>
                                        </div>
                                        <span className="text-[10px] text-secondary font-bold uppercase tracking-tighter">Graded</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
