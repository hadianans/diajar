import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssignmentSummaryCard({ title, linkedMaterial, submitted, totalStudents, submissionRate, graded, gradedRate }) {
    return (
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 h-1 w-full bg-secondary"></div>
            
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{title}</h4>
                <Icon name="link" className="text-on-surface-variant text-[18px]" />
            </div>
            
            <p className="text-label-sm font-label-sm text-outline-variant mb-4">Linked to {linkedMaterial}</p>
            
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-label-sm">
                    <span className="text-on-surface-variant">Submitted: {submitted}/{totalStudents}</span>
                    <span className="text-primary font-bold">{submissionRate}%</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${submissionRate}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center text-label-sm">
                    <span className="text-on-surface-variant">Graded: {graded}/{submitted}</span>
                    <span className="text-secondary font-bold">{gradedRate}%</span>
                </div>
            </div>
        </div>
    );
}
