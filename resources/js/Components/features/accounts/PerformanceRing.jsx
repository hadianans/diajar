import React from 'react';

export default function PerformanceRing({ percentage = 0 }) {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-outline-variant"
                        cx="32"
                        cy="32"
                        fill="transparent"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <circle
                        className="text-primary transition-all duration-1000 ease-out"
                        cx="32"
                        cy="32"
                        fill="transparent"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-on-surface">
                    {percentage}%
                </span>
            </div>
            <p className="font-label-sm text-[12px] text-on-surface-variant font-medium">
                {percentage > 0 ? 'Consistent performance' : 'No data available'}
            </p>
        </div>
    );
}
