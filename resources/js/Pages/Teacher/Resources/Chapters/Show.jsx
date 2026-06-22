import { Head } from '@inertiajs/react';

export default function Show({ chapterId }) {
    return (
        <>
            <Head title={`Resource Chapter ${chapterId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>This is Teacher Resource Chapter Detail page</h1>
                <p>Chapter ID: {chapterId}</p>
            </div>
        </>
    );
}
