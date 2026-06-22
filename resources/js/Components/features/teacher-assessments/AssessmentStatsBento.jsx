import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentStatsBento({ attemptsCompleted, attemptsTotal, avgScore, avgChange, high, low, passRate }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Attempts */}
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-on-surface-variant font-label-md text-label-md">Attempts</span>
                    <div className="bg-primary-fixed p-1.5 rounded-lg flex items-center justify-center">
                        <Icon name="group" className="text-primary" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-headline-lg text-headline-lg">{attemptsCompleted}/{attemptsTotal}</span>
                    <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(attemptsCompleted / attemptsTotal) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Avg Score */}
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-on-surface-variant font-label-md text-label-md">Avg. Score</span>
                    <div className="bg-secondary-fixed p-1.5 rounded-lg flex items-center justify-center">
                        <Icon name="analytics" className="text-secondary" />
                    </div>
                </div>
                <span className="font-headline-lg text-headline-lg">{avgScore}%</span>
                {avgChange && (
                    <span className={`font-label-sm text-label-sm mt-1 flex items-center gap-1 ${avgChange > 0 ? 'text-secondary' : 'text-error'}`}>
                        <Icon name={avgChange > 0 ? 'trending_up' : 'trending_down'} className="text-sm" /> 
                        {avgChange > 0 ? '+' : ''}{avgChange}% from last
                    </span>
                )}
            </div>

            {/* High/Low */}
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-on-surface-variant font-label-md text-label-md">High / Low</span>
                    <div className="bg-tertiary-fixed p-1.5 rounded-lg flex items-center justify-center">
                        <Icon name="swap_vert" className="text-tertiary" />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-headline-lg">{high}%</span>
                    <span className="text-on-surface-variant font-body-md text-body-md">/ {low}%</span>
                </div>
                <span className="text-on-surface-variant font-label-sm text-label-sm mt-1">Wide range variance</span>
            </div>

            {/* Pass Rate */}
            <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-on-surface-variant font-label-md text-label-md">Pass Rate</span>
                    <div className="bg-error-container p-1.5 rounded-lg flex items-center justify-center">
                        <Icon name="check_circle" className="text-error" />
                    </div>
                </div>
                <span className="font-headline-lg text-headline-lg">{passRate}%</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm mt-1">Target: 80%</span>
            </div>
        </div>
    );
}
