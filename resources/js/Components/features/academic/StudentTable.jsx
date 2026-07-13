import React, { useState, useEffect } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import Avatar from '@/Components/shared/ui/Avatar';
import { confirmAction } from '@/utils/swal';

const colorBgs = [
    'bg-primary-fixed text-on-primary-fixed',
    'bg-secondary-fixed text-on-secondary-fixed',
    'bg-tertiary-fixed text-on-tertiary-fixed',
    'bg-surface-dim text-on-surface'
];

export default function StudentTable({ initialStudents = [], onUnlink }) {
    const [students, setStudents] = useState(initialStudents);
    const [search, setSearch] = useState('');
    const [unlinkingIds, setUnlinkingIds] = useState([]);

    useEffect(() => {
        setStudents(initialStudents);
    }, [initialStudents]);

    const handleUnlink = async (id) => {
        if (onUnlink) {
            onUnlink(id);
            return;
        }
        // Fallback for demo
        const confirmed = await confirmAction('Unlink Student?', 'Are you sure you want to unlink this student?');
        if (confirmed) {
            setUnlinkingIds(prev => [...prev, id]);

            setTimeout(() => {
                setStudents(prev => prev.filter(s => s.id !== id));
                setUnlinkingIds(prev => prev.filter(activeId => activeId !== id));
            }, 300);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="glass-card rounded-xl shadow-sm overflow-hidden mb-stack-lg">
            <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Icon name="groups" className="text-on-surface-variant" />
                    <h3 className="font-headline-md text-headline-md font-bold">
                        Students in This Group ({students.length})
                    </h3>
                </div>
                <div className="relative w-full md:w-80">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input
                        className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl pl-10 pr-4 py-2 text-sm text-on-surface placeholder-on-surface-variant outline-none"
                        placeholder="Search students..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            
            {filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-container-low">
                            <tr>
                                <th className="px-6 py-4 font-label-md text-on-surface-variant border-b border-outline-variant">Student Name</th>
                                <th className="px-6 py-4 font-label-md text-on-surface-variant border-b border-outline-variant">Email Address</th>
                                <th className="px-6 py-4 font-label-md text-on-surface-variant border-b border-outline-variant text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {filteredStudents.map((student, idx) => {
                                const isUnlinking = unlinkingIds.includes(student.id);
                                const initials = student.name ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NA';
                                const avatarBg = colorBgs[idx % colorBgs.length];

                                return (
                                    <tr
                                        key={student.id}
                                        className={`hover:bg-surface-container transition-all duration-300 group ${
                                            isUnlinking ? 'opacity-0 translate-x-[20px]' : 'opacity-100 translate-x-0'
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    initials={initials}
                                                    className="w-8 h-8 text-xs"
                                                    bgClassName={avatarBg}
                                                />
                                                <span className="font-body-md text-on-surface">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-body-md text-on-surface-variant">{student.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleUnlink(student.id)}
                                                className="text-error font-label-md hover:bg-error-container/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                                                type="button"
                                            >
                                                <Icon name="link_off" className="text-sm" />
                                                Unlink
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-12 text-center flex flex-col items-center" id="empty-state">
                    <Icon name="person_off" className="text-6xl text-outline mb-4" />
                    <h4 className="text-lg font-bold text-on-surface mb-2">No students linked to this group</h4>
                    <p className="text-on-surface-variant mb-6 max-w-xs mx-auto">Get started by adding students manually or importing from a CSV file.</p>
                </div>
            )}
        </section>
    );
}
