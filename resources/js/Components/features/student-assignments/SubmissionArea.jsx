import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SubmissionArea({ submission, onSubmit, loading }) {
    const [pathUrl, setPathUrl] = useState(submission?.path_url || '');
    const [studentNote, setStudentNote] = useState(submission?.student_note || '');
    const [isEditing, setIsEditing] = useState(!submission || submission.status !== 'graded');
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ path_url: pathUrl, student_note: studentNote });
    };

    if (submission && submission.status === 'graded') {
        return (
            <section className="bg-surface-container border border-outline-variant rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <Icon name="check_circle" />
                    <h4 className="font-headline-md text-headline-md">Graded Submission</h4>
                </div>
                <div>
                    <span className="font-label-sm text-outline-variant uppercase">Submitted Link</span>
                    <a href={submission.path_url} target="_blank" rel="noreferrer" className="block text-primary hover:underline mt-1 font-body-md">
                        {submission.path_url}
                    </a>
                </div>
                {submission.student_note && (
                    <div>
                        <span className="font-label-sm text-outline-variant uppercase">Note</span>
                        <p className="mt-1 font-body-md text-on-surface-variant bg-surface-container-high p-3 rounded-xl">{submission.student_note}</p>
                    </div>
                )}
            </section>
        );
    }

    return (
        <section 
            className={`bg-white border-2 ${submission ? 'border-solid border-primary' : 'border-dashed border-primary-fixed'} ${isHovered && !submission ? 'border-primary' : ''} rounded-2xl p-6 space-y-4 transition-colors`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mb-2">
                    <Icon name={submission ? "check_circle" : "upload_file"} className="text-primary text-3xl" />
                </div>
                <h4 className="font-headline-md text-headline-md text-on-surface">
                    {submission ? 'Update Submission' : 'Submit Your Work'}
                </h4>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Work URL (Google Drive, GitHub, etc)*</label>
                    <input 
                        type="url"
                        required
                        value={pathUrl}
                        onChange={e => setPathUrl(e.target.value)}
                        className="w-full h-12 px-4 bg-surface-container-low border-none rounded-xl text-body-md font-body-md focus:ring-2 focus:ring-primary shadow-sm"
                        placeholder="https://..."
                    />
                </div>
                <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Student Note (Optional)</label>
                    <textarea 
                        value={studentNote}
                        onChange={e => setStudentNote(e.target.value)}
                        className="w-full p-4 bg-surface-container-low border-none rounded-xl text-body-md font-body-md focus:ring-2 focus:ring-primary shadow-sm resize-none"
                        rows="3"
                        placeholder="Any comments for your teacher..."
                    />
                </div>
                
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading && <Icon name="sync" className="animate-spin" />}
                    {submission ? 'Update Submission' : 'Submit Assignment'}
                </button>
            </form>
        </section>
    );
}
