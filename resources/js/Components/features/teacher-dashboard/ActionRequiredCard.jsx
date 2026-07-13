import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ActionRequiredCard({ ungradedCount = 12, reviewCount = 5 }) {
    return (
        <div className="bg-primary-container text-on-primary-container p-6 rounded-xl shadow-sm relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-surface-container-lowest/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-2 mb-4">
                <Icon name="notification_important" className="fill-1 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }} />
                <h3 className="font-headline-md text-headline-md">Needs Your Attention</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <div className="text-4xl font-bold mb-1">{ungradedCount}</div>
                    <div className="text-on-primary-container/80 font-label-md mb-4 uppercase tracking-wider">Ungraded Assignments</div>
                    <button className="w-full bg-surface-container-lowest text-primary font-label-md py-3 rounded-lg hover:bg-surface-bright active:scale-95 transition-all shadow-sm">
                        Grade Now
                    </button>
                </div>
                
                <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <div className="text-4xl font-bold mb-1">{reviewCount}</div>
                    <div className="text-on-primary-container/80 font-label-md mb-4 uppercase tracking-wider">Assessment Reviews</div>
                    <button className="w-full bg-primary text-white font-label-md py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
                        Review
                    </button>
                </div>
            </div>
        </div>
    );
}
