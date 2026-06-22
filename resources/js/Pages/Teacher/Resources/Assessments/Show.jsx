import { Head } from '@inertiajs/react';

export default function Show({ assessmentId }) {
    return (
        <>
            <Head title={`Resource Assessment ${assessmentId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>This is Teacher Resource Assessment Detail page</h1>
                <p>Assessment ID: {assessmentId}</p>
            </div>
        </>
    );
}
