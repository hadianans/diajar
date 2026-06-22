import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuestionEditorText({ value, onChange }) {
    return (
        <section className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm transition-all duration-300">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-stack-sm">Question</label>
            <div className="flex flex-col gap-stack-sm border border-outline-variant rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 bg-surface-container border-b border-outline-variant overflow-x-auto no-scrollbar">
                    <button className="p-2 hover:bg-surface-variant rounded-lg text-on-surface-variant transition-colors flex-shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>format_bold</span>
                    </button>
                    <button className="p-2 hover:bg-surface-variant rounded-lg text-on-surface-variant transition-colors flex-shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 400" }}>format_italic</span>
                    </button>
                    <button className="p-2 hover:bg-surface-variant rounded-lg text-on-surface-variant transition-colors flex-shrink-0">
                        <Icon name="functions" />
                    </button>
                    <div className="w-[1px] h-6 bg-outline-variant mx-1 flex-shrink-0"></div>
                    <button className="p-2 hover:bg-surface-variant rounded-lg text-on-surface-variant transition-colors flex-shrink-0">
                        <Icon name="image" />
                    </button>
                </div>
                <textarea 
                    className="w-full min-h-[140px] p-4 bg-transparent border-none focus:ring-0 text-on-surface resize-none font-body-md text-body-md" 
                    placeholder="Type your question here..."
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                ></textarea>
            </div>
        </section>
    );
}
