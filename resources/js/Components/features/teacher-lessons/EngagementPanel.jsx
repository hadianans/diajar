import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function EngagementPanel({ stats }) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <aside 
            className={`fixed bottom-0 left-0 right-0 z-40 bg-surface-container-low border-t border-outline-variant shadow-[0_-8px_30px_rgb(0,0,0,0.08)] rounded-t-[32px] transition-all duration-500 ease-in-out transform ${!isExpanded ? 'translate-y-[calc(100%-72px)]' : 'translate-y-0'}`}
        >
            {/* Panel Header/Handle */}
            <div 
                className="px-margin-mobile py-4 flex items-center justify-between cursor-pointer" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <Icon name="analytics" className="text-primary text-[24px]" />
                    <span className="font-headline-md text-headline-md">Student Engagement</span>
                </div>
                <button 
                    className={`w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                >
                    <Icon name="expand_less" />
                </button>
            </div>

            {/* Panel Content */}
            <div 
                className={`px-margin-mobile pb-margin-mobile space-y-6 transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {/* Bento Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Progress Circle Card */}
                    <div className="col-span-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center text-center">
                        <div className="relative w-16 h-16 mb-2">
                            <svg className="w-full h-full -rotate-90 origin-center">
                                <circle className="text-surface-container-high" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                                <circle className="text-secondary transition-all duration-500" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * stats.completionRate / 100)} strokeWidth="6"></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-label-md text-on-surface">{stats.completionRate}%</div>
                        </div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">{stats.completedCount}/{stats.totalStudents} Students Completed</div>
                    </div>

                    {/* Metric Card: Time */}
                    <div className="col-span-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
                        <Icon name="timer" className="text-primary-container mb-2" />
                        <div>
                            <div className="font-headline-md text-headline-md">{stats.avgTime}m</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Avg. Time Spent</div>
                        </div>
                    </div>

                    {/* Metric Card: Comprehension */}
                    <div className="col-span-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
                        <div className="flex gap-0.5 mb-2 text-tertiary-container">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icon key={star} name="star" className="!text-sm" filled={star <= Math.round(stats.comprehension)} />
                            ))}
                        </div>
                        <div>
                            <div className="font-headline-md text-headline-md">{stats.comprehension}/5</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Avg. Comprehension</div>
                        </div>
                    </div>

                    {/* Metric Card: Quality */}
                    <div className="col-span-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
                        <Icon name="verified" className="text-secondary mb-2" />
                        <div>
                            <div className="font-headline-md text-headline-md">{stats.quality}/5</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Material Quality</div>
                        </div>
                    </div>
                </div>

                {/* Emotions Distribution */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30">
                    <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-tighter">Emotion Distribution</h4>
                    <div className="flex items-center gap-6 overflow-x-auto pb-2 no-scrollbar">
                        <div className="flex flex-col items-center gap-2 min-w-[64px]">
                            <span className="text-2xl">😃</span>
                            <div className="font-headline-md text-headline-md">{stats.emotions.happy}</div>
                            <div className="w-full h-1 bg-secondary rounded-full"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2 min-w-[64px]">
                            <span className="text-2xl">🤔</span>
                            <div className="font-headline-md text-headline-md">{stats.emotions.thinking}</div>
                            <div className="w-full h-1 bg-primary-container rounded-full opacity-60"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2 min-w-[64px]">
                            <span className="text-2xl">🤩</span>
                            <div className="font-headline-md text-headline-md">{stats.emotions.amazed}</div>
                            <div className="w-full h-1 bg-tertiary-container rounded-full opacity-40"></div>
                        </div>
                        <div className="ml-auto">
                            <button className="bg-primary text-white font-label-md px-6 py-3 rounded-xl hover:bg-primary-container active:scale-95 transition-all shadow-sm whitespace-nowrap">
                                View Full Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
