import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

const emptyLevel = () => ({ label: '', score: 0, description: '' });
const emptyCriterion = () => ({ title: '', description: '', weight: 0, levels: [emptyLevel()] });

export default function RubricBuilder({ rubric, onChange }) {
    const [expandedCriterion, setExpandedCriterion] = useState(0);

    const handleRubricField = (field, value) => {
        onChange?.({ ...rubric, [field]: value });
    };

    const handleCriterionChange = (idx, field, value) => {
        const updated = [...(rubric?.criteria || [])];
        updated[idx] = { ...updated[idx], [field]: value };
        onChange?.({ ...rubric, criteria: updated });
    };

    const handleLevelChange = (cIdx, lIdx, field, value) => {
        const criteria = [...(rubric?.criteria || [])];
        const levels = [...(criteria[cIdx]?.levels || [])];
        levels[lIdx] = { ...levels[lIdx], [field]: value };
        criteria[cIdx] = { ...criteria[cIdx], levels };
        onChange?.({ ...rubric, criteria });
    };

    const addCriterion = () => {
        const criteria = [...(rubric?.criteria || []), emptyCriterion()];
        onChange?.({ ...rubric, criteria });
        setExpandedCriterion(criteria.length - 1);
    };

    const removeCriterion = (idx) => {
        const criteria = (rubric?.criteria || []).filter((_, i) => i !== idx);
        onChange?.({ ...rubric, criteria });
        if (expandedCriterion >= criteria.length) setExpandedCriterion(Math.max(0, criteria.length - 1));
    };

    const addLevel = (cIdx) => {
        const criteria = [...(rubric?.criteria || [])];
        criteria[cIdx] = { ...criteria[cIdx], levels: [...(criteria[cIdx].levels || []), emptyLevel()] };
        onChange?.({ ...rubric, criteria });
    };

    const removeLevel = (cIdx, lIdx) => {
        const criteria = [...(rubric?.criteria || [])];
        criteria[cIdx] = { ...criteria[cIdx], levels: criteria[cIdx].levels.filter((_, i) => i !== lIdx) };
        onChange?.({ ...rubric, criteria });
    };

    const totalWeight = (rubric?.criteria || []).reduce((sum, c) => sum + (parseInt(c.weight) || 0), 0);
    const criteria = rubric?.criteria || [];

    return (
        <section className="space-y-stack-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="grading" className="text-primary text-[20px]" />
                    <h2 className="font-headline-md text-headline-md text-on-surface">Grading Rubric</h2>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-label-sm text-label-sm ${
                    totalWeight === 100 
                        ? 'bg-secondary-container text-on-secondary-container' 
                        : 'bg-error-container text-on-error-container'
                }`}>
                    <Icon name={totalWeight === 100 ? "check_circle" : "warning"} className="text-[16px]" filled />
                    <span>Total Weight: {totalWeight}%</span>
                </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-6">
                {/* Rubric Title & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Rubric Title</label>
                        <input 
                            type="text" 
                            className="w-full h-12 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-body-md" 
                            placeholder="Standard Composition Rubric"
                            value={rubric?.title || ''}
                            onChange={e => handleRubricField('title', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Rubric Description</label>
                        <input 
                            type="text" 
                            className="w-full h-12 px-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-body-md" 
                            placeholder="General criteria for grading essays"
                            value={rubric?.description || ''}
                            onChange={e => handleRubricField('description', e.target.value)}
                        />
                    </div>
                </div>

                {/* Criterion Cards */}
                <div className="space-y-4">
                    {criteria.map((criterion, cIdx) => (
                        <div 
                            key={cIdx}
                            className={`group border rounded-2xl overflow-hidden transition-all hover:shadow-md ${
                                expandedCriterion === cIdx 
                                    ? 'border-primary shadow-[0_4px_12px_rgba(0,74,198,0.08)]' 
                                    : 'border-outline-variant'
                            }`}
                        >
                            {/* Criterion Header */}
                            <div 
                                className="p-4 bg-surface-container-low flex items-center justify-between cursor-pointer"
                                onClick={() => setExpandedCriterion(expandedCriterion === cIdx ? -1 : cIdx)}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon name="drag_indicator" className="text-outline" />
                                    <div>
                                        <h3 className="font-label-md text-label-md text-on-surface">
                                            {criterion.title || `Criterion ${cIdx + 1}`}
                                        </h3>
                                        <p className="text-label-sm text-outline">
                                            {criterion.weight || 0}% Weight • {criterion.levels?.length || 0} Levels
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeCriterion(cIdx); }}
                                        className="p-1.5 rounded-full hover:bg-error-container/20 text-error transition-colors"
                                        title="Remove Criterion"
                                    >
                                        <Icon name="delete" className="text-[18px]" />
                                    </button>
                                    <Icon name="expand_more" className={`text-outline transition-transform ${expandedCriterion === cIdx ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                            
                            {/* Criterion Body */}
                            <div className={`p-5 space-y-6 bg-white border-t border-outline-variant ${expandedCriterion === cIdx ? 'block' : 'hidden'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-3 space-y-2">
                                        <label className="font-label-sm text-label-sm text-outline">Criterion Title</label>
                                        <input 
                                            type="text" 
                                            className="w-full h-10 px-3 bg-surface-container border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary" 
                                            value={criterion.title}
                                            onChange={e => handleCriterionChange(cIdx, 'title', e.target.value)}
                                            placeholder="e.g. Clarity of Argument"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-label-sm text-label-sm text-outline">Weight %</label>
                                        <input 
                                            type="number"
                                            min="1"
                                            className="w-full h-10 px-3 bg-surface-container border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary" 
                                            value={criterion.weight}
                                            onChange={e => {
                                                let val = parseInt(e.target.value);
                                                if (isNaN(val)) val = '';
                                                else if (val < 1) val = 1;
                                                handleCriterionChange(cIdx, 'weight', val);
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Performance Levels */}
                                <div className="space-y-4">
                                    <label className="font-label-md text-label-md text-on-surface">Performance Levels</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {(criterion.levels || []).map((level, lIdx) => (
                                            <div key={lIdx} className="p-3 rounded-xl bg-surface-container-high border border-outline-variant space-y-2 focus-within:border-primary relative group/level">
                                                <button 
                                                    onClick={() => removeLevel(cIdx, lIdx)}
                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/level:opacity-100 transition-opacity shadow-sm"
                                                    title="Remove Level"
                                                >×</button>
                                                <div className="flex justify-between items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        className="bg-transparent border-none p-0 font-label-md text-primary flex-1 min-w-0 focus:ring-0" 
                                                        value={level.label}
                                                        onChange={e => handleLevelChange(cIdx, lIdx, 'label', e.target.value)}
                                                        placeholder="Label"
                                                    />
                                                    <input 
                                                        type="number"
                                                        min="1"
                                                        className="bg-white rounded px-1 w-14 shrink-0 text-center text-label-sm font-bold border-none" 
                                                        value={level.score}
                                                        onChange={e => {
                                                            let val = parseInt(e.target.value);
                                                            if (isNaN(val)) val = '';
                                                            else if (val < 1) val = 1;
                                                            handleLevelChange(cIdx, lIdx, 'score', val);
                                                        }}
                                                    />
                                                </div>
                                                <textarea 
                                                    className="w-full text-label-sm bg-transparent border-none resize-none p-0 h-16 focus:ring-0 text-on-surface-variant" 
                                                    value={level.description}
                                                    onChange={e => handleLevelChange(cIdx, lIdx, 'description', e.target.value)}
                                                    placeholder="Description..."
                                                />
                                            </div>
                                        ))}
                                        
                                        <button 
                                            type="button" 
                                            onClick={() => addLevel(cIdx)}
                                            className="h-full min-h-[120px] border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center text-outline hover:text-primary hover:border-primary transition-colors py-4 group"
                                        >
                                            <Icon name="add" className="group-hover:scale-110 transition-transform" />
                                            <span className="text-label-sm mt-1">Add Level</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    type="button" 
                    onClick={addCriterion}
                    className="w-full py-4 border-2 border-dashed border-primary/30 rounded-xl flex items-center justify-center gap-2 text-primary font-label-md hover:bg-primary-container/10 transition-colors"
                >
                    <Icon name="playlist_add" /> Add Criterion
                </button>
            </div>
        </section>
    );
}
