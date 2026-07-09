import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import { usePage } from '@inertiajs/react';
import Modal from '@/Components/shared/ui/Modal';
import ReflectionForm from '@/Components/features/reflections/ReflectionForm';

export default function SubmissionCard({ 
    submission, 
    onSubmit, 
    loading,
    reflectionInitialData,
    onSaveReflection,
    isSavingReflection,
    showQuality = true
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // 1. Status Indicator State
    const initialStatus = submission ? (submission.status === 'graded' ? 'graded' : 'submitted') : 'assigned';
    const [status, setStatus] = useState(initialStatus);

    // 2. Attachment State
    const initialAttachment = submission?.path_url ? {
        id: 1, 
        name: submission.path_url.split('/').pop(), 
        type: submission.path_url.startsWith('http') ? 'link' : 'file',
        url: submission.path_url
    } : null;
    const [attachment, setAttachment] = useState(initialAttachment);

    // 3. Modals and Dropdown State
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showReflection, setShowReflection] = useState(false);
    
    // For dropdown click outside
    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        setShowDropdown(false);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAttachment({ id: Date.now(), name: file.name, type: 'file', file: file });
        }
        // Reset input so the same file can be uploaded again if removed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleLinkClick = () => {
        setShowDropdown(false);
        setIsLinkModalOpen(true);
    };

    const handleAddLink = () => {
        if (linkUrl.trim()) {
            setAttachment({ id: Date.now(), name: linkUrl, type: 'link', link: linkUrl });
            setLinkUrl('');
            setIsLinkModalOpen(false);
        }
    };

    const handleRemoveAttachment = () => {
        setAttachment(null);
    };

    const handleActionClick = () => {
        if (status === 'assigned' || status === 'submitted') {
            if (!attachment && status === 'assigned') {
                alert("Please add a file or link before turning in.");
                return;
            }
            const formData = new FormData();
            if (attachment?.type === 'file' && attachment.file) {
                formData.append('file', attachment.file);
            } else if (attachment?.type === 'link' && attachment.link) {
                formData.append('link', attachment.link);
            }
            onSubmit(formData);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Your work</h3>
                    <span className={`font-label-md text-label-md ${status === 'missing' ? 'text-error' : (status === 'assigned' ? 'text-primary' : 'text-on-surface-variant')}`}>
                        {status === 'missing' ? 'Missing' : (status === 'assigned' ? 'Assigned' : (status === 'graded' ? 'Graded' : 'Turned in'))}
                    </span>
                </div>

                {/* Attachment List */}
                {attachment && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg group hover:bg-surface-container-lowest transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Icon name={attachment.type === 'link' ? 'link' : 'description'} className="text-primary text-[20px] shrink-0" />
                                {attachment.url ? (
                                    <a href={attachment.url} target="_blank" rel="noreferrer" className="font-body-md text-primary hover:underline truncate">
                                        {attachment.name}
                                    </a>
                                ) : (
                                    <span className="font-body-md text-on-surface truncate">{attachment.name}</span>
                                )}
                            </div>
                            {(status === 'assigned' || status === 'submitted') && (
                                <button 
                                    onClick={handleRemoveAttachment}
                                    className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-surface-container"
                                    title="Remove"
                                >
                                    <Icon name="close" className="text-[18px]" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    {(status === 'assigned' || status === 'submitted') && !attachment && (
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="w-full py-2 border border-outline hover:bg-primary/5 rounded-md text-primary font-label-md flex items-center justify-center gap-2 transition-colors"
                            >
                                <Icon name="add" className="text-[20px]" />
                                Add or create
                            </button>
                            {showDropdown && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                    <button 
                                        onClick={handleUploadClick}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors text-on-surface"
                                    >
                                        <Icon name="upload_file" className="text-gray-500" />
                                        Upload File
                                    </button>
                                    <button 
                                        onClick={handleLinkClick}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors text-on-surface"
                                    >
                                        <Icon name="link" className="text-gray-500" />
                                        Add Link
                                    </button>
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                            />
                        </div>
                    )}
                    {(status === 'assigned' || status === 'submitted') && (
                        <button 
                            onClick={handleActionClick}
                            className={`w-full py-2 rounded-md font-label-md flex items-center justify-center transition-colors ${
                                status === 'assigned' 
                                    ? 'bg-[#1a73e8] text-white hover:bg-blue-600 shadow-sm' 
                                    : 'border border-outline hover:bg-surface-container-lowest text-on-surface'
                            }`}
                        >
                            {status === 'assigned' ? 'Turn in' : 'Resubmit'}
                        </button>
                    )}
                </div>
            </div>

            {/* Reflections Section */}
            <div className="border-t border-gray-200 bg-gray-50/50">
                <button
                    onClick={() => setShowReflection(!showReflection)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-100/50 transition-colors text-on-surface select-none outline-none"
                    type="button"
                >
                    <div className="flex items-center gap-2.5">
                        <Icon name="self_improvement" className="text-primary text-[20px]" />
                        <span className="font-label-md font-semibold text-on-surface">Reflection</span>
                    </div>
                    <Icon 
                        name={showReflection ? 'expand_less' : 'expand_more'} 
                        className="text-on-surface-variant text-[20px] transition-transform duration-200" 
                    />
                </button>

                {showReflection && (
                    <div className="px-5 pb-5 space-y-4 animate-fadeIn">
                        <ReflectionForm 
                            initialData={reflectionInitialData}
                            onSubmit={onSaveReflection}
                            loading={isSavingReflection}
                            showQuality={showQuality}
                        />
                    </div>
                )}
            </div>

            {/* Link Modal */}
            <Modal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                title="Add Link"
                size="md"
            >
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Link</label>
                        <input
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-surface-container-low border border-transparent focus:border-primary rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface outline-none transition-all"
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setIsLinkModalOpen(false)}
                            className="px-5 py-2 font-label-md text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddLink}
                            disabled={!linkUrl.trim()}
                            className="px-5 py-2 bg-primary text-on-primary font-label-md rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            Add Link
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
