import React from 'react';

export default function SubjectStatsBox({ subjectName = 'Subject', stats = [], previewImageUrl }) {
    return (
        <aside className="flex flex-col gap-stack-lg">
            {/* Quick Stats Block */}
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 hover:shadow-sm transition-shadow">
                <h4 className="font-label-md text-label-md text-on-surface mb-4 font-bold">
                    Subject Quick Stats
                </h4>
                <div className="space-y-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-outline-variant/10 pb-2 last:border-0 last:pb-0">
                            <span className="font-body-md text-body-md text-on-surface-variant">
                                {stat.label}
                            </span>
                            <span className="font-label-md text-label-md text-primary font-bold">
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Curriculum Illustration Preview Box */}
            {previewImageUrl && (
                <div className="relative h-48 rounded-xl overflow-hidden group border border-outline-variant shadow-sm cursor-pointer">
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                            backgroundImage: `url("${previewImageUrl}")`
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <span className="text-white font-label-md text-label-md font-semibold">
                            {subjectName} Curriculum Preview
                        </span>
                    </div>
                </div>
            )}
        </aside>
    );
}
