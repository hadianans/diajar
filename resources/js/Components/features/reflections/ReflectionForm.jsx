import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ReflectionForm({
    initialData = null,
    onSubmit,
    onCancel,
    loading = false,
    showQuality = true,
    extraActions = null
}) {
    const [comprehension, setComprehension] = useState(initialData?.comprehension_level || 0);
    const [quality, setQuality] = useState(initialData?.material_quality || 0);
    const [selectedEmojis, setSelectedEmojis] = useState(initialData?.emotions || []);
    const [reflectionNotes, setReflectionNotes] = useState(initialData?.content || '');

    const emojis = ['😊', '😕', '🤓', '🤯', '😴', '😡'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comprehension === 0) {
            alert('Comprehension level is mandatory.');
            return;
        }

        onSubmit({
            comprehension_level: comprehension,
            material_quality: quality,
            emotions: selectedEmojis,
            content: reflectionNotes
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Comprehension rating (scale) */}
            <div>
                <label className="block font-title-sm text-title-sm text-on-surface mb-6 font-semibold tracking-wide">
                    Comprehension Level <span className="text-error">*</span>
                </label>

                <div className="relative flex flex-col w-full">
                    <div className="relative w-full flex justify-between items-center px-2 h-8">
                        <div className="absolute top-1/2 left-8 right-8 h-[4px] bg-outline-variant/30 rounded-full -translate-y-1/2 pointer-events-none">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${((comprehension - 1) / 4) * 100}%` }}
                            ></div>
                        </div>

                        {[1, 2, 3, 4, 5].map((val) => {
                            const isActive = comprehension === val;
                            const isPassed = comprehension >= val;

                            return (
                                <label
                                    key={val}
                                    className="relative z-10 cursor-pointer flex flex-col items-center group touch-none"
                                >
                                    <input
                                        type="radio"
                                        name="comprehension"
                                        value={val}
                                        checked={isActive}
                                        onChange={() => setComprehension(val)}
                                        className="sr-only"
                                    />
                                    <div className="relative w-8 h-8 flex items-center justify-center">
                                        <span className={`absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-200 ${isActive ? 'scale-110 bg-primary/15' : ''}`}></span>
                                        <span
                                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 border-2 z-10 ${isActive
                                                ? 'border-primary bg-white scale-110 shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]'
                                                : isPassed
                                                    ? 'border-primary bg-white group-hover:border-primary-container'
                                                    : 'border-outline-variant bg-white group-hover:border-primary/60'
                                                }`}
                                        >
                                            {isActive && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-[scaleIn_0.2s_ease-out] shadow-sm"></span>
                                            )}
                                        </span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-center mt-3 px-4 w-full select-none pointer-events-none">
                        <span className="text-[12px] font-medium text-on-surface-variant/80 tracking-wide uppercase">
                            Tidak Paham
                        </span>
                        <span className="text-[12px] font-medium text-primary tracking-wide uppercase font-semibold">
                            Paham
                        </span>
                    </div>
                </div>
            </div>

            {/* Quality rating (optional) */}
            {showQuality && (
                <div>
                    <label className="block font-title-sm text-title-sm text-on-surface mb-4 font-semibold tracking-wide flex items-center gap-2">
                        <span>Material Quality</span>
                        <span className="text-on-surface-variant/50 text-[12px] font-normal px-2 py-0.5 rounded-md border border-outline-variant/20">Optional</span>
                    </label>

                    <div className="flex gap-2.5 items-center group/rating">
                        {[1, 2, 3, 4, 5].map((val) => {
                            const isSelected = val <= quality;
                            return (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setQuality(val)}
                                    className="relative text-[34px] focus:outline-none transition-all duration-200 hover:scale-125 active:scale-95 ease-out [&:hover~button]:opacity-40"
                                >
                                    <span className="relative block transition-all duration-300">
                                        <Icon
                                            name="star"
                                            className={`transition-all duration-300 ${isSelected
                                                ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] scale-105'
                                                : 'text-outline-variant/30 group-hover/rating:text-amber-500/40 [&:hover]:text-amber-500'
                                                } ${quality === val ? 'animate-[bounce_0.3s_ease-in-out_1]' : ''}`}
                                            style={{ fontVariationSettings: isSelected ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
                                        />
                                    </span>
                                </button>
                            );
                        })}

                        {quality > 0 && (
                            <span className="ml-2 text-[14px] font-bold text-amber-600 tracking-wide animate-[fadeIn_0.2s_ease-out]">
                                {quality === 1 && 'Buruk'}
                                {quality === 2 && 'Cukup'}
                                {quality === 3 && 'Bagus'}
                                {quality === 4 && 'Sangat Bagus'}
                                {quality === 5 && 'Sempurna!'}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Emoji emotions selection (optional) */}
            <div>
                <label className="block font-title-sm text-title-sm text-on-surface mb-3 select-none">
                    How do you feel? <span className="text-on-surface-variant/50 text-[12px] font-normal px-2 py-0.5 rounded-md border border-outline-variant/20">Optional</span>
                </label>

                <div className="flex gap-3 flex-wrap p-1">
                    {emojis.map(emoji => {
                        const isSelected = selectedEmojis.includes(emoji);
                        return (
                            <button
                                key={emoji}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => {
                                    if (isSelected) {
                                        setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
                                    } else {
                                        setSelectedEmojis([...selectedEmojis, emoji]);
                                    }
                                }}
                                className={`w-12 h-12 text-2xl rounded-full flex items-center justify-center transition-all duration-200 ease-out active:scale-95 select-none
                                    ${isSelected
                                        ? 'bg-secondary-container border-2 border-secondary scale-110 shadow-md ring-4 ring-secondary/10'
                                        : 'bg-transparent hover:bg-surface-container-high border border-outline-variant/30 hover:border-outline-variant hover:scale-105 shadow-sm'
                                    }`}
                            >
                                <span className="transform transition-transform duration-200 hover:rotate-6">
                                    {emoji}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block font-title-sm text-title-sm text-on-surface mb-2 select-none flex items-center gap-2">
                    <span>Reflection Notes</span>
                    <span className="text-on-surface-variant/50 text-[12px] font-normal px-2 py-0.5 rounded-md border border-outline-variant/20">Optional</span>
                </label>

                <div className="relative group">
                    <textarea
                        className="w-full bg-transparent border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-all duration-200 min-h-[120px] resize-y hover:border-outline"
                        placeholder="What did you learn? Any difficulties?"
                        value={reflectionNotes}
                        onChange={e => setReflectionNotes(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
                {extraActions}
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-2.5 border border-outline-variant text-on-surface-variant rounded-full font-label-lg hover:bg-surface-container transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 bg-primary text-on-primary rounded-full font-label-lg hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (initialData ? 'Update' : 'Save')}
                </button>
            </div>
        </form>
    );
}
