import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Superscript } from '@tiptap/extension-superscript';
import Youtube from '@tiptap/extension-youtube';
import { Extension } from '@tiptap/core';
import { useRef, useCallback, useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';
import './editor.css';

// FontSize custom extension
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() { return { types: ['textStyle'] }; },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
                    renderHTML: attributes => {
                        if (!attributes.fontSize) return {};
                        return { style: `font-size: ${attributes.fontSize}` };
                    },
                },
            },
        }];
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => chain().setMark('textStyle', { fontSize }).run(),
            unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
        };
    },
});

// Custom Image extension with width + display (alignment) attributes
const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: element => element.style.width || null,
                renderHTML: (attrs) => {
                    if (!attrs.width) return {};
                    return { style: `width: ${attrs.width}` };
                },
            },
            display: {
                default: 'block',
                renderHTML: (attrs) => {
                    const map = {
                        'inline': 'display: inline;',
                        'left': 'float: left; margin-right: 1rem;',
                        'right': 'float: right; margin-left: 1rem;',
                        'block': 'display: block; margin-left: auto; margin-right: auto;',
                    };
                    const base = map[attrs.display] || map['block'];
                    const widthStyle = attrs.width ? ` width: ${attrs.width};` : '';
                    return { style: base + widthStyle };
                },
            },
        };
    },
});

// ─── Toolbar Button ──────────────────────────────────────────────────────────
const MenuButton = ({ onClick, isActive, children, title, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`p-1.5 rounded-lg text-sm transition-all duration-150 ${disabled
            ? 'opacity-30 cursor-not-allowed'
            : isActive
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
    >
        {children}
    </button>
);

const Separator = () => <div className="w-px h-6 bg-outline-variant mx-0.5 flex-shrink-0" />;

// ─── Main Component ──────────────────────────────────────────────────────────
export default function RichTextEditor({
    content,
    onChange,
    uploadUrl = '/materials/upload-image',
    placeholder = 'Start typing your educational content here...',
    error,
    disableMedia = false,
}) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [imageSelected, setImageSelected] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-primary underline' },
            }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder }),
            TextStyle,
            FontFamily,
            Superscript,
            FontSize,
            ...(disableMedia ? [] : [
                CustomImage.configure({
                    allowBase64: true,
                    HTMLAttributes: { class: 'rounded-sm max-w-full' },
                }),
                Youtube.configure({
                    HTMLAttributes: { class: 'w-full aspect-video rounded-lg' },
                    controls: false,
                    nocookie: true,
                })
            ]),
        ],
        content: content || '',
        onUpdate: ({ editor: ed }) => onChange?.(ed.getHTML()),
        onSelectionUpdate: ({ editor: ed }) => {
            setImageSelected(ed.isActive('image'));
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-5 py-4',
            },
        },
    });

    // Image upload: tries server first, falls back to base64 for dev/offline
    const handleImageUpload = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const data = await api.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            editor.chain().focus().setImage({
                src: data.url || data,
                alt: file.name.replace(/\.[^/.]+$/, ''),
                width: '100%',
                display: 'block',
            }).run();
        } catch {
            // Fallback: embed as base64 (works offline / without upload endpoint)
            const reader = new FileReader();
            reader.onload = () => {
                editor.chain().focus().setImage({
                    src: reader.result,
                    alt: file.name.replace(/\.[^/.]+$/, ''),
                    width: '100%',
                    display: 'block',
                }).run();
            };
            reader.readAsDataURL(file);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [editor, uploadUrl]);

    const setImageSize = (width) => {
        if (!editor) return;
        editor.chain().focus().updateAttributes('image', { width }).run();
    };

    const setImageDisplay = (display) => {
        if (!editor) return;
        editor.chain().focus().updateAttributes('image', { display }).run();
    };

    const addLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    if (!editor) return null;

    return (
        <div className={`rounded-2xl border ${error ? 'border-error' : 'border-outline-variant'} shadow-sm overflow-hidden bg-surface-container-lowest`}>
            {/* ── Main Toolbar ─────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-outline-variant bg-surface-container-low">
                {/* Font Family & Size Dropdowns */}
                <select
                    className="p-1.5 text-sm bg-transparent border border-outline-variant rounded-lg text-on-surface-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none hover:bg-surface-container-high transition-colors"
                    onChange={(e) => {
                        if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
                        else editor.chain().focus().unsetFontFamily().run();
                    }}
                    value={editor.getAttributes('textStyle').fontFamily || ''}
                >
                    <option value="">Font</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="ui-serif, Georgia, Cambria, Times New Roman, Times, serif">Serif</option>
                    <option value="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">Monospace</option>
                    <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
                </select>

                <div className="flex items-center gap-1 bg-transparent border border-outline-variant rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-colors hover:bg-surface-container-high">
                    <input
                        type="number"
                        min="1"
                        max="72"
                        placeholder="16"
                        className="w-8 p-1.5 pl-2 text-sm bg-transparent border-none outline-none text-center text-on-surface-variant focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= 72) {
                                editor.chain().focus().setFontSize(`${val}px`).run();
                            } else if (!e.target.value) {
                                editor.chain().focus().unsetFontSize().run();
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.target.blur();
                            }
                        }}
                        defaultValue={editor.getAttributes('textStyle').fontSize?.replace(/px/g, '') || ''}
                        key={editor.getAttributes('textStyle').fontSize || 'default'}
                    />
                    <span className="text-xs text-on-surface-variant select-none pr-2 font-medium">px</span>
                </div>

                <Separator />

                {/* Text format */}
                <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                    <Icon name="format_bold" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                    <Icon name="format_italic" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                    <Icon name="format_underlined" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
                    <Icon name="strikethrough_s" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} title="Superscript">
                    <Icon name="superscript" style={{ fontSize: '20px' }} />
                </MenuButton>

                <Separator />

                {/* Headings Dropdown */}
                <select
                    className="p-1.5 pe-8 text-sm bg-transparent border border-outline-variant rounded-lg text-on-surface-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none hover:bg-surface-container-high transition-colors"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'p') editor.chain().focus().setParagraph().run();
                        else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
                    }}
                    value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : 'p'}
                >
                    <option value="p">Paragraph</option>
                    <option value="1">Heading 1</option>
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                </select>

                <Separator />

                {/* Clear formatting & Special characters */}
                <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
                    <Icon name="format_clear" style={{ fontSize: '20px' }} />
                </MenuButton>

                <MenuButton onClick={() => {
                    const char = window.prompt('Enter special character (e.g. ©, ®, ™, €, ∑):', '©');
                    if (char) editor.chain().focus().insertContent(char).run();
                }} title="Insert Special Character">
                    <Icon name="emoji_symbols" style={{ fontSize: '20px' }} />
                </MenuButton>

                <Separator />

                {/* Lists */}
                <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                    <Icon name="format_list_bulleted" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
                    <Icon name="format_list_numbered" style={{ fontSize: '20px' }} />
                </MenuButton>

                <Separator />

                {/* Blocks */}
                <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
                    <Icon name="format_quote" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
                    <Icon name="code" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                    <Icon name="horizontal_rule" style={{ fontSize: '20px' }} />
                </MenuButton>

                <Separator />

                {/* Alignment */}
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
                    <Icon name="format_align_left" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Center">
                    <Icon name="format_align_center" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
                    <Icon name="format_align_right" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
                    <Icon name="format_align_justify" style={{ fontSize: '20px' }} />
                </MenuButton>

                <Separator />

                {/* Link */}
                <MenuButton onClick={addLink} isActive={editor.isActive('link')} title="Insert / Edit Link">
                    <Icon name="link" style={{ fontSize: '20px' }} />
                </MenuButton>
                {editor.isActive('link') && (
                    <MenuButton onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()} title="Remove Link">
                        <Icon name="link_off" style={{ fontSize: '20px' }} />
                    </MenuButton>
                )}

                <Separator />

                {!disableMedia && (
                    <>
                        {/* Media (Image & Embed) */}
                        <MenuButton onClick={() => fileInputRef.current?.click()} title="Insert Image" disabled={uploading}>
                            {uploading ? (
                                <Icon name="progress_activity" className="animate-spin" style={{ fontSize: '20px' }} />
                            ) : (
                                <Icon name="image" style={{ fontSize: '20px' }} />
                            )}
                        </MenuButton>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                        <MenuButton onClick={() => {
                            const url = window.prompt('Enter YouTube URL to Embed:');
                            if (url) {
                                editor.chain().focus().setYoutubeVideo({
                                    src: url,
                                }).run();
                            }
                        }} title="Embed YouTube Video">
                            <Icon name="smart_display" style={{ fontSize: '20px' }} />
                        </MenuButton>

                        <Separator />
                    </>
                )}

                {/* Undo / Redo */}
                <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Icon name="undo" style={{ fontSize: '20px' }} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Icon name="redo" style={{ fontSize: '20px' }} />
                </MenuButton>
            </div>

            {/* ── Image Toolbar (contextual) ───────────────────────────────── */}
            {imageSelected && (
                <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b border-outline-variant bg-primary-container/30">
                    <Icon name="image" className="text-primary" style={{ fontSize: '18px' }} />
                    <span className="text-label-sm font-label-sm text-primary mr-1">Image Settings</span>

                    <span className="text-label-sm text-on-surface-variant mr-0.5">Size:</span>
                    {[['25%', 'S'], ['50%', 'M'], ['75%', 'L'], ['100%', 'Full']].map(([w, label]) => (
                        <button
                            key={w}
                            type="button"
                            onClick={() => setImageSize(w)}
                            className="px-2.5 py-1 text-label-sm font-label-sm bg-surface-container-lowest border border-outline-variant hover:bg-primary hover:text-on-primary hover:border-primary rounded-lg transition-colors"
                        >
                            {label}
                        </button>
                    ))}

                    <div className="w-px h-4 bg-outline-variant mx-1" />

                    <span className="text-label-sm text-on-surface-variant mr-0.5">Align:</span>
                    {[['left', 'Left'], ['block', 'Center'], ['right', 'Right']].map(([d, label]) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => setImageDisplay(d)}
                            className="px-2.5 py-1 text-label-sm font-label-sm bg-surface-container-lowest border border-outline-variant hover:bg-primary hover:text-on-primary hover:border-primary rounded-lg transition-colors"
                        >
                            {label}
                        </button>
                    ))}

                    <div className="w-px h-4 bg-outline-variant mx-1" />

                    <button
                        type="button"
                        onClick={() => {
                            const alt = window.prompt('Alt text:', editor.getAttributes('image').alt || '');
                            if (alt !== null) editor.chain().focus().updateAttributes('image', { alt }).run();
                        }}
                        className="px-2.5 py-1 text-label-sm font-label-sm bg-surface-container-lowest border border-outline-variant hover:bg-primary hover:text-on-primary hover:border-primary rounded-lg transition-colors"
                    >
                        Alt Text
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().deleteSelection().run()}
                        className="px-2.5 py-1 text-label-sm font-label-sm bg-error-container text-on-error-container border border-error/20 hover:bg-error hover:text-on-error rounded-lg transition-colors"
                    >
                        <Icon name="delete" style={{ fontSize: '14px' }} className="mr-0.5 align-middle" />
                        Remove
                    </button>
                </div>
            )}

            {/* ── Editor ───────────────────────────────────────────────────── */}
            <EditorContent editor={editor} />

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <div className="px-5 py-2 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
                <span className="text-label-sm font-label-sm text-on-surface-variant">
                    Use the toolbar to format text, insert images, and more.
                </span>
            </div>
        </div>
    );
}
