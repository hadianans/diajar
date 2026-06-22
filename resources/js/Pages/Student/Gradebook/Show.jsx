import { Head } from '@inertiajs/react';

export default function Show({ subjectId }) {
    return (
        <>
            <Head title={`Gradebook - Subject ${subjectId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>This is Student Gradebook Subject Detail page</h1>
                <p>Subject ID: {subjectId}</p>
            </div>
        </>
    );
}
