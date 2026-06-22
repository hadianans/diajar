import { Head } from '@inertiajs/react';

export default function LessonShow({ chapterId, lessonId }) {
    return (
        <>
            <Head title={`Resource Chapter ${chapterId || ''} - Lesson ${lessonId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>This is Teacher Resource Chapter Lesson Detail page</h1>
                <p>Chapter ID: {chapterId}</p>
                <p>Lesson ID: {lessonId}</p>
            </div>
        </>
    );
}
