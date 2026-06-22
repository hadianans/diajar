import React from 'react';

export default function WeeklyCalendar({ monthYear = 'October 2023', days = [] }) {
    // Expected days: [{ day: 'M', date: 23, isToday: false, hasTask: false, taskColor: 'bg-secondary' }]
    return (
        <section className="bg-surface-container-low border border-outline-variant rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-label-md font-label-md text-on-surface">Weekly Overview</h3>
                <span className="text-label-sm font-label-sm text-primary">{monthYear}</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((d, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-label-sm text-outline">{d.day}</span>
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-label-md ${
                            d.isToday ? 'bg-primary text-on-primary' : ''
                        }`}>
                            {d.date}
                        </div>
                        {d.hasTask && (
                            <div className={`w-1.5 h-1.5 rounded-full ${d.taskColor || 'bg-secondary'}`}></div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
