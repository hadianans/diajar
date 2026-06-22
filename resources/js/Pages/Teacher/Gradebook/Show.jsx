import { Head } from '@inertiajs/react';

export default function Show({ groupId }) {
    return (
        <>
            <Head title={`Gradebook - Group ${groupId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>This is Teacher Gradebook Group Detail page</h1>
                <p>Group ID: {groupId}</p>
            </div>
        </>
    );
}
