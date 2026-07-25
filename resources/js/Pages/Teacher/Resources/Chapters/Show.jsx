import { Head } from '@inertiajs/react';

export default function Show({ chapterId }) {
    return (
        <>
            <Head title={`Bab Sumber Daya ${chapterId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>Ini adalah halaman Detail Bab Sumber Daya Guru</h1>
                <p>ID Bab: {chapterId}</p>
            </div>
        </>
    );
}
