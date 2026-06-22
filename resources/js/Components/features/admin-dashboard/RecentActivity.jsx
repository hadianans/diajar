import React from 'react';

export default function RecentActivity({ activities = [], onViewLogs }) {
    return (
        <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-sm">
            <h4 className="font-headline-md text-headline-md font-bold mb-6 text-on-surface">Recent Activity</h4>
            <div className="flex flex-col gap-6">
                {activities.map((activity, idx) => {
                    const isLast = idx === activities.length - 1;
                    return (
                        <div key={idx} className="flex gap-4">
                            <div className="relative flex flex-col items-center">
                                <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${activity.dotColor || 'bg-primary'}`}></div>
                                {!isLast && <div className="w-[1px] flex-grow bg-outline-variant my-1"></div>}
                            </div>
                            <div>
                                <p className="font-body-md text-body-md text-on-surface font-semibold">{activity.title}</p>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">
                                    {activity.time} • {activity.meta}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {onViewLogs && (
                <button
                    onClick={onViewLogs}
                    className="w-full mt-8 border border-outline text-outline font-label-md text-label-md py-2 rounded-lg hover:bg-surface-container hover:text-on-surface transition-all active:scale-[0.98]"
                    type="button"
                >
                    View Full Logs
                </button>
            )}
        </div>
    );
}
