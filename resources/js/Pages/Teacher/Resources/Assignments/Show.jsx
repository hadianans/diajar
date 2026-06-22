import { Head } from '@inertiajs/react';

export default function Show({ assignmentId }) {
    return (
        <>
            <Head title={`Resource Assignment ${assignmentId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>This is Teacher Resource Assignment Detail page</h1>
                <p>Assignment ID: {assignmentId}</p>
            </div>
        </>
    );
}
