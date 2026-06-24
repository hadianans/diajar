import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <>
            <Head title={`Gradebook`} />
            <div style={{ padding: '2rem' }}>
                <h1>This is Teacher Gradebook page</h1>
            </div>
        </>
    );
}