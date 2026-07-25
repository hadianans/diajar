import { Head } from '@inertiajs/react';

export default function Show({ subjectId }) {
    return (
        <>
            <Head title={`Buku Nilai - Mata Pelajaran ${subjectId || ''}`} />
            <div style={{ padding: '2rem' }}>
                <h1>Ini adalah halaman Detail Mata Pelajaran Buku Nilai Siswa</h1>
                <p>ID Mata Pelajaran: {subjectId}</p>
            </div>
        </>
    );
}
