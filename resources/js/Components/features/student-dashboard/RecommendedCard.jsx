import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function RecommendedCard({ subject, title, duration, imageUrl, onClick }) {
    const isHistory = subject && subject.toLowerCase() === 'history';
    const tagColorClass = isHistory ? 'text-secondary' : 'text-primary';

    return (
        <article
            onClick={onClick}
            className="min-w-[240px] w-60 bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-shrink-0 group"
        >
            <div className="h-32 bg-surface-container overflow-hidden flex items-center justify-center group">
                {imageUrl ? (
                    <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={imageUrl}
                        alt={title}
                    />
                ) : (
                    // Menggunakan Gradasi + Emoji Sistem yang Presisi
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300 select-none">
                            🎓
                        </span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${tagColorClass}`}>
                    {subject}
                </span>
                <h4 className="font-label-md text-label-md text-on-surface mt-1 font-bold truncate">
                    {title}
                </h4>
                <div className="flex items-center gap-2 mt-3 text-on-surface-variant">
                    <Icon name="timer" className="text-[16px] text-on-surface-variant" />
                    <span className="font-label-sm text-label-sm font-medium">
                        {duration}
                    </span>
                </div>
            </div>
        </article>
    );
}
