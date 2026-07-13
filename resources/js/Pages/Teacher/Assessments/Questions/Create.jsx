import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import RichTextEditor from '@/Components/shared/editor/RichTextEditor';
import QuestionOptionsBuilder from '@/Components/features/teacher-questions/QuestionOptionsBuilder';
import QuestionSettingsBento from '@/Components/features/teacher-questions/QuestionSettingsBento';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError, showWarning } from '@/utils/swal';

export default function Create() {
    const { data: subjectsData } = useApiGet('/subjects'); // Fetch subjects linked to teacher
    
    const [subjectId, setSubjectId] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([
        { id: 1, text: '', isCorrect: true },
        { id: 2, text: '', isCorrect: false },
    ]);
    const [score, setScore] = useState(1);
    const [tags, setTags] = useState([]);
    const [bloom, setBloom] = useState(2); // Apply
    const [explanation, setExplanation] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const handleCancel = () => {
        router.visit(route('teacher.assessments.questions.index'));
    };

    const handleSave = async () => {
        if (!subjectId) {
            setErrors({ subject_id: ['Subject is required.'] });
            return;
        }
        
        setIsSaving(true);
        setErrors({});
        
        try {
            // We need tag IDs, so we'll likely need to send just names if backend supports it, 
            // or we do first-or-create tags. Wait, let's just create/fetch tags first if possible.
            // The API for tags provides /tags/first-or-create
            let tagIds = [];
            if (tags.length > 0) {
                const tagPromises = tags.map(tagName => api.post('/tags/first-or-create', { name: tagName }));
                const tagResponses = await Promise.all(tagPromises);
                tagIds = tagResponses.map(tag => tag.id);
            }

            const formattedOptions = options.map(o => ({
                option: o.text,
                is_correct: o.isCorrect
            }));

            await api.post('/questions', {
                subject_id: subjectId,
                question: questionText,
                levels: bloom.toString(),
                explanation: explanation,
                score: score,
                options: formattedOptions,
                tag_ids: tagIds
            });

            router.visit(route('teacher.assessments.questions.index'));
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                showWarning('Form Errors', 'Please check the form for errors.');
            } else {
                showError('Error', err.response?.data?.message || 'Error saving question');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleOptionChange = (id, text) => {
        setOptions(options.map(o => o.id === id ? { ...o, text } : o));
    };

    const handleMarkCorrect = (id) => {
        setOptions(options.map(o => ({ ...o, isCorrect: o.id === id })));
    };

    const handleAddOption = () => {
        const nextId = Math.max(...options.map(o => o.id), 0) + 1;
        setOptions([...options, { id: nextId, text: '', isCorrect: false }]);
    };

    const handleRemoveOption = (id) => {
        setOptions(options.filter(o => o.id !== id));
    };

    const handleAddTag = (tag) => {
        if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    };
    
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const headerSection = (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">New Question</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Create a new question for your assessments.</p>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest active:scale-95 transition-all shadow-sm"
                >
                    <Icon name="close" />
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
                >
                    <Icon name="save" />
                    {isSaving ? 'Saving...' : 'Save Question'}
                </button>
            </div>
        </div>
    );

    return (
        <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection} showBack={true} onBack={handleCancel}>
            <Head title="New Question | Diajar LMS" />

            <div className="space-y-stack-lg max-w-4xl mx-auto">
                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant">Subject</label>
                    <select 
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md focus:border-primary focus:ring-0 transition-colors"
                    >
                        <option value="">Select a subject...</option>
                        {(subjectsData || []).map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.subject_name}
                            </option>
                        ))}
                    </select>
                    {errors.subject_id && <p className="text-error text-label-sm mt-1">{errors.subject_id[0]}</p>}
                </div>

                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Question Content</label>
                    <RichTextEditor 
                        content={questionText}
                        onChange={setQuestionText}
                        placeholder="Write your question here..."
                    />
                    {errors.question && <p className="text-error text-label-sm mt-1">{errors.question[0]}</p>}
                </div>

                <QuestionOptionsBuilder 
                    options={options}
                    onOptionChange={handleOptionChange}
                    onMarkCorrect={handleMarkCorrect}
                    onAddOption={handleAddOption}
                    onRemoveOption={handleRemoveOption}
                />
                {errors.options && <p className="text-error text-label-sm mt-1">{errors.options[0]}</p>}

                <QuestionSettingsBento 
                    score={score}
                    tags={tags}
                    selectedBloom={bloom}
                    explanation={explanation}
                    onScoreChange={setScore}
                    onBloomChange={setBloom}
                    onExplanationChange={setExplanation}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                />
            </div>
        </DashboardTemplate>
    );
}
