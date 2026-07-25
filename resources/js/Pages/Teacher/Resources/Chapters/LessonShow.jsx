import { Head } from '@inertiajs/react';

export default function LessonShow({ chapterId, lessonId }) {
    return (
        <>
            <Head title={`Bab Sumber Daya ${chapterId || ''} - Pelajaran ${lessonId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>Ini adalah halaman Detail Pelajaran Bab Sumber Daya Guru</h1>
                <p>ID Bab: {chapterId}</p>
                <p>ID Pelajaran: {lessonId}</p>
            </div>
        </>
    );
}
