import React from 'react';
import TeacherRow from '@/Components/features/academic/TeacherRow';
import Icon from '@/Components/shared/ui/Icon';

export default function LinkedTeachersBox({ teachers = [], onLinkTeacherClick, onUnlinkTeacher }) {
    return (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center gap-4">
                <div className="flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                        Linked Teachers ({teachers.length})
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                        Educators currently assigned to this subject curriculum.
                    </p>
                </div>
                <button
                    onClick={onLinkTeacherClick}
                    className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary/95 active:scale-95 transition-all shadow-md"
                    type="button"
                >
                    <Icon name="person_add" className="text-[20px]" />
                    <span>Link Teacher</span>
                </button>
            </div>

            <div className="divide-y divide-outline-variant">
                {teachers.length === 0 ? (
                    <div className="p-6 text-center text-on-surface-variant text-body-md">
                        No teachers linked to this subject.
                    </div>
                ) : (
                    teachers.map((teacher, idx) => (
                        <TeacherRow
                            key={teacher.id || idx}
                            name={teacher.name}
                            email={teacher.email}
                            initials={teacher.initials}
                            onUnlink={() => {
                                if (onUnlinkTeacher) onUnlinkTeacher(teacher);
                            }}
                        />
                    ))
                )}
            </div>

            {/* Mobile Action Button */}
            <div className="p-4 md:hidden border-t border-outline-variant bg-surface-container-lowest">
                <button
                    onClick={onLinkTeacherClick}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md active:scale-95 transition-all shadow-sm"
                    type="button"
                >
                    <Icon name="person_add" className="text-[20px]" />
                    <span>Link Teacher</span>
                </button>
            </div>
        </section>
    );
}
