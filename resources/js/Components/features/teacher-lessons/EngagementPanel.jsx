import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import moment from 'moment';

export default function EngagementPanel({ stats }) {
    const [showFullReport, setShowFullReport] = useState(false);

    return (
        <section className="bg-surface-container-low border border-outline-variant/50 shadow-sm rounded-3xl mt-12 mb-8 overflow-hidden">
            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest/50">
                <div className="flex items-center gap-3">
                    <Icon name="analytics" className="text-primary text-[24px]" />
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Student Engagement</h3>
                </div>
            </div>

            {/* Panel Content */}
            <div className="p-6 md:p-8 space-y-8">
                {/* Bento Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Progress Circle Card */}
                    <div className="col-span-1 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="relative w-20 h-20 mb-3">
                            <svg className="w-full h-full -rotate-90 origin-center">
                                <circle className="text-surface-container-high" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="8"></circle>
                                <circle className="text-secondary transition-all duration-1000 ease-out" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeDasharray="226.2" strokeDashoffset={226.2 - (226.2 * stats.completionRate / 100)} strokeWidth="8"></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-title-md text-on-surface">{stats.completionRate}%</div>
                        </div>
                        <div className="font-label-md text-label-md text-on-surface-variant">{stats.completedCount} / {stats.totalStudents} Students Completed</div>
                    </div>

                    {/* Metric Card: Time */}
                    <div className="col-span-1 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-sm">
                        <Icon name="timer" className="text-primary-container mb-4 text-3xl" />
                        <div>
                            <div className="font-headline-lg text-headline-lg text-on-surface">{stats.avgTime}m</div>
                            <div className="font-label-md text-label-md text-on-surface-variant mt-1">Avg. Time Spent</div>
                        </div>
                    </div>

                    {/* Metric Card: Comprehension */}
                    <div className="col-span-1 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-sm">
                        <div className="flex gap-1 mb-4 text-tertiary-container">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icon key={star} name="star" className="text-xl" filled={star <= Math.round(stats.comprehension)} />
                            ))}
                        </div>
                        <div>
                            <div className="font-headline-lg text-headline-lg text-on-surface">{stats.comprehension}/5</div>
                            <div className="font-label-md text-label-md text-on-surface-variant mt-1">Avg. Comprehension</div>
                        </div>
                    </div>

                    {/* Metric Card: Quality */}
                    <div className="col-span-1 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-sm">
                        <Icon name="verified" className="text-secondary mb-4 text-3xl" />
                        <div>
                            <div className="font-headline-lg text-headline-lg text-on-surface">{stats.quality}/5</div>
                            <div className="font-label-md text-label-md text-on-surface-variant mt-1">Material Quality</div>
                        </div>
                    </div>
                </div>

                {/* View Full Report Toggle */}
                <div className="flex justify-center pt-2">
                    <button 
                        onClick={() => setShowFullReport(!showFullReport)}
                        className="bg-primary text-white font-label-md px-8 py-3 rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-sm whitespace-nowrap flex items-center gap-2"
                    >
                        <Icon name={showFullReport ? "visibility_off" : "visibility"} />
                        {showFullReport ? 'Hide Full Report' : 'View Full Report'}
                    </button>
                </div>

                {/* Detailed Student Activities Table */}
                {showFullReport && (
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden mt-6">
                        <div className="px-6 py-5 border-b border-outline-variant/30 bg-surface-container-low/50">
                            <h4 className="font-headline-sm text-headline-sm text-on-surface">Student Activity Detail</h4>
                            <p className="text-on-surface-variant text-label-md mt-1">Detailed list of activities for every student with available data.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md uppercase tracking-wider text-sm border-b border-outline-variant/30">
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Last Access</th>
                                        <th className="px-6 py-4">Time Spent</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/30">
                                    {stats.activities && stats.activities.length > 0 ? (
                                        stats.activities.map((activity) => (
                                            <tr key={activity.id} className="hover:bg-surface-container-low/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 bg-surface-container-high">
                                                            {activity.picture ? (
                                                                <img src={activity.picture} alt={activity.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                                                                    {activity.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-title-sm text-on-surface font-medium">{activity.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {activity.is_completed ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm">
                                                            <Icon name="check_circle" className="text-[16px]" />
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/30 text-on-primary-container font-label-sm">
                                                            <Icon name="pending" className="text-[16px]" />
                                                            In Progress
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-on-surface-variant font-body-sm">
                                                    {activity.last_access ? moment(activity.last_access).format('MMM D, YYYY HH:mm') : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 text-on-surface-variant font-body-sm">
                                                    {activity.duration_seconds > 0 ? `${Math.round(activity.duration_seconds / 60)} mins` : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant">
                                                No student activity data available yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
