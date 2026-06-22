import React from 'react';

export default function SRLEngagementCard({ activePlans = 24, newReflections = 18, avgComprehension = 4.2 }) {
    return (
        <div className="bg-secondary text-on-secondary p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-label-md uppercase tracking-wider mb-4 text-on-secondary/80">SRL Engagement</h3>
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <span className="font-body-md">Active Plans</span>
                    <span className="text-2xl font-bold">{activePlans}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="font-body-md">New Reflections</span>
                    <span className="text-2xl font-bold">{newReflections}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="font-body-md">Avg Comprehension</span>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold">{avgComprehension}</span>
                        <span className="text-sm">/5</span>
                    </div>
                </div>
                
                <button className="w-full bg-secondary-container text-on-secondary-container font-label-md py-3 rounded-lg hover:brightness-110 transition-all shadow-sm">
                    Engagement Report
                </button>
            </div>
        </div>
    );
}
