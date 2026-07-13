import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function LessonTabs({ overviewContent, resources, content }) {
    const [activeTab, setActiveTab] = useState(content ? 'content' : 'overview');

    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
            <div className="flex border-b border-outline-variant">
                {content && (
                    <button 
                        className={`px-6 py-4 font-label-md text-label-md transition-colors border-b-2 ${
                            activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-surface'
                        }`}
                        onClick={() => setActiveTab('content')}
                    >
                        Content
                    </button>
                )}
                <button 
                    className={`px-6 py-4 font-label-md text-label-md transition-colors border-b-2 ${
                        activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-surface'
                    }`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`px-6 py-4 font-label-md text-label-md transition-colors border-b-2 ${
                        activeTab === 'resources' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-surface'
                    }`}
                    onClick={() => setActiveTab('resources')}
                >
                    Resources
                </button>
            </div>
            
            <div className="p-6">
                {activeTab === 'content' && content && (
                    <div 
                        className="prose max-w-none text-on-surface-variant font-body-md"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}

                {activeTab === 'overview' && (
                    <div className="block">
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                            {overviewContent.description}
                        </p>
                        <ul className="space-y-3">
                            {overviewContent.points.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <Icon 
                                        name={point.checked ? 'check_circle' : 'circle'} 
                                        className={`mt-0.5 ${point.checked ? 'text-secondary' : 'text-outline'}`} 
                                    />
                                    <span className="font-body-md text-body-md">{point.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resources.map((resource, idx) => (
                            <a 
                                key={idx} 
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 border border-outline-variant rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${resource.bgClass} ${resource.textClass}`}>
                                        <Icon name={resource.icon} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="font-label-md text-label-md truncate" title={resource.title}>{resource.title}</div>
                                        <div className="text-[10px] text-outline uppercase font-bold">{resource.meta}</div>
                                    </div>
                                </div>
                                <Icon name={resource.actionIcon} className="shrink-0 text-outline group-hover:text-primary transition-colors" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
