import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ChapterProgressList({ chapters = [] }) {
    return (
        <div className="bg-surface-container-lowest/80 backdrop-blur-[8px] border border-slate-200/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-2">
                <Icon name="bookmark" className="text-primary" />
                Chapter Progress
            </h3>
            
            <div className="space-y-6">
                {chapters.map((chapter, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between mb-2">
                            <span className="text-on-surface font-label-md">{chapter.title}</span>
                            <span className={`${chapter.progress > 50 ? 'text-primary' : 'text-on-surface-variant'} font-bold`}>
                                {chapter.progress}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div 
                                className={`${chapter.progress > 50 ? 'bg-primary' : 'bg-primary/50'} h-full rounded-full transition-all duration-1000`} 
                                style={{ width: `${chapter.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
