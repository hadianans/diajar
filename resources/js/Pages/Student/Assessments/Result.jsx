import { Head } from '@inertiajs/react';

export default function Result({ assessmentId }) {
    return (
        <>
            <Head title={`Assessment ${assessmentId || ''} Result`} />
            <div style={{ padding: '2rem' }}>
                <h1>This is Student Assessment Result page</h1>
                <p>Assessment ID: {assessmentId}</p>
            </div>
        </>
    );
}
