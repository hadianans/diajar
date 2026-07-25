import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonTabs({ overviewContent, resources, content }) {
    const [activeTab, setActiveTab] = useState(content ? 'content' : 'overview');

    return (
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm">
            <div className="flex border-b border-outline-variant/40 bg-surface-container-low/50 px-2 pt-2 gap-2">
                {content && (
                    <button 
                        className={`px-5 py-3 font-label-lg text-label-md rounded-t-xl transition-all border-b-2 font-bold ${
                            activeTab === 'content' 
                                ? 'bg-surface-container-lowest border-primary text-primary shadow-xs' 
                                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                        }`}
                        onClick={() => setActiveTab('content')}
                    >
                        Konten
                    </button>
                )}
                <button 
                    className={`px-5 py-3 font-label-lg text-label-md rounded-t-xl transition-all border-b-2 font-bold ${
                        activeTab === 'overview' 
                            ? 'bg-surface-container-lowest border-primary text-primary shadow-xs' 
                            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                    }`}
                    onClick={() => setActiveTab('overview')}
                >
                    Ringkasan
                </button>
                <button 
                    className={`px-5 py-3 font-label-lg text-label-md rounded-t-xl transition-all border-b-2 font-bold ${
                        activeTab === 'resources' 
                            ? 'bg-surface-container-lowest border-primary text-primary shadow-xs' 
                            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                    }`}
                    onClick={() => setActiveTab('resources')}
                >
                    Sumber Daya {resources && resources.length > 0 && `(${resources.length})`}
                </button>
            </div>
            
            <div className="p-6 md:p-8">
                {activeTab === 'content' && content && (
                    <div 
                        className="prose max-w-none text-on-surface-variant font-body-md leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}

                {activeTab === 'overview' && (
                    <div className="block space-y-4">
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                            {overviewContent?.description || 'Tidak ada deskripsi yang tersedia.'}
                        </p>
                        {overviewContent?.points && overviewContent.points.length > 0 && (
                            <ul className="space-y-3 pt-2">
                                {overviewContent.points.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Icon 
                                            name={point.checked ? 'check_circle' : 'circle'} 
                                            className={`mt-0.5 ${point.checked ? 'text-secondary' : 'text-outline'}`} 
                                        />
                                        <span className="font-body-md text-body-md text-on-surface">{point.text}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resources && resources.length > 0 ? (
                            resources.map((resource, idx) => (
                                <a 
                                    key={idx} 
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 border border-outline-variant/40 rounded-2xl flex items-center justify-between hover:bg-surface-container-low/70 hover:border-primary/40 transition-all cursor-pointer group shadow-2xs"
                                >
                                    <div className="flex items-center gap-3.5 overflow-hidden">
                                        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${resource.bgClass} ${resource.textClass}`}>
                                            <Icon name={resource.icon} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="font-label-md text-label-md truncate text-on-surface group-hover:text-primary transition-colors" title={resource.title}>
                                                {resource.title}
                                            </div>
                                            <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{resource.meta}</div>
                                        </div>
                                    </div>
                                    <Icon name={resource.actionIcon} className="shrink-0 text-outline group-hover:text-primary transition-colors" />
                                </a>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-6 text-on-surface-variant italic">
                                Tidak ada sumber daya terlampir.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
