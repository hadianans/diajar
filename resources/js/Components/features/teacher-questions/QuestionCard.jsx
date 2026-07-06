import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionCard({ id, title, level, levelClass, levelColorClass, points, tags, onDelete }) {
    return (
        <div className="group relative overflow-hidden bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
            <div className={`absolute left-0 top-0 w-1 h-full ${levelColorClass}`}></div>
            <div className="flex-1 flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${levelClass}`}>
                        {level}
                    </span>
                    <span className="text-xs text-outline">•</span>
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <Icon name="stars" className="text-sm" />
                        {points} pts
                    </span>
                </div>
                <Link href={route('teacher.assessments.questions.show', { questionId: id })}>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                        {title}
                    </h3>
                </Link>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-md bg-surface-container text-xs text-on-surface-variant">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-center">
                <Link href={route('teacher.assessments.questions.edit', { questionId: id })}>
                    <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-outline">
                        <Icon name="edit" />
                    </button>
                </Link>
                <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-outline">
                    <Icon name="content_copy" />
                </button>
                <button onClick={onDelete} className="p-2 rounded-full hover:bg-error-container hover:text-error transition-colors text-outline">
                    <Icon name="delete" />
                </button>
            </div>
        </div>
    );
}
