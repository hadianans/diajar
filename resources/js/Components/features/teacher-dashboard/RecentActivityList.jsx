import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function RecentActivityList({ activities = [] }) {
    return (
        <div className="bg-white/80 backdrop-blur-[8px] border border-slate-200/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                    <Icon name="history" className="text-primary" />
                    Recent Activity
                </h3>
                <button className="text-primary font-label-md hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
                {activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.iconBg}`}>
                            <Icon name={activity.icon} className={activity.iconColor} />
                        </div>
                        <div className="flex-1">
                            <p className="text-on-surface font-body-md">
                                <span className="font-bold">{activity.studentName}</span> {activity.action}
                            </p>
                            <p className="text-on-surface-variant text-sm">{activity.time} • {activity.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
