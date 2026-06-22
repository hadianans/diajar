import React from 'react';

export default function ProgressRing({ percentage = 0, label, colorClass = 'text-primary' }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius; // 251.2
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-16">
                <svg className="w-16 h-16" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                        className="text-outline-variant"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                    />
                    {/* Foreground Circle */}
                    <circle
                        className={`${colorClass}`}
                        style={{
                            transition: 'stroke-dashoffset 0.35s',
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%'
                        }}
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-label-sm text-label-sm font-bold">
                    {percentage}%
                </span>
            </div>
            {label && (
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    {label}
                </span>
            )}
        </div>
    );
}
