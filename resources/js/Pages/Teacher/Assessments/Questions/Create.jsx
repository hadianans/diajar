import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import QuestionEditorText from '@/Components/features/teacher-questions/QuestionEditorText';
import QuestionOptionsBuilder from '@/Components/features/teacher-questions/QuestionOptionsBuilder';
import QuestionSettingsBento from '@/Components/features/teacher-questions/QuestionSettingsBento';

export default function Create() {
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([
        { id: 1, text: 'Mitochondria', isCorrect: true },
        { id: 2, text: 'Nucleus', isCorrect: false },
        { id: 3, text: 'Ribosome', isCorrect: false },
    ]);
    const [score, setScore] = useState(1);
    const [tags, setTags] = useState(['Biology', 'Cells']);
    const [bloom, setBloom] = useState(2); // Apply
    const [explanation, setExplanation] = useState('');

    const handleCancel = () => {
        router.visit(route('teacher.assessments.questions.index'));
    };

    const handleSave = () => {
        // Validation & Save logic
        router.visit(route('teacher.assessments.questions.index'));
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

    return (
        <div className="bg-background text-on-surface font-body-md text-body-md min-h-screen pb-24 selection:bg-primary/20">
            <Head title="New Question" />

            {/* TopAppBar */}
            <header className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-margin-mobile h-16">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleCancel}
                        className="p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors duration-200"
                    >
                        <Icon name="close" className="text-on-surface" />
                    </button>
                    <h1 className="font-headline-md text-headline-md text-primary">New Question</h1>
                </div>
                <button 
                    onClick={handleSave}
                    className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md text-label-md shadow-sm hover:opacity-90 active:scale-95 transition-all"
                >
                    Save
                </button>
            </header>

            <main className="max-w-3xl mx-auto px-margin-mobile py-stack-lg space-y-stack-lg">
                <QuestionEditorText 
                    value={questionText}
                    onChange={setQuestionText}
                />

                <QuestionOptionsBuilder 
                    options={options}
                    onOptionChange={handleOptionChange}
                    onMarkCorrect={handleMarkCorrect}
                    onAddOption={handleAddOption}
                    onRemoveOption={handleRemoveOption}
                />

                <QuestionSettingsBento 
                    score={score}
                    tags={tags}
                    selectedBloom={bloom}
                    explanation={explanation}
                    onScoreChange={setScore}
                    onBloomChange={setBloom}
                    onExplanationChange={setExplanation}
                />
            </main>
        </div>
    );
}
