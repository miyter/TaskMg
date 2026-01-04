import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import {
    IconBold,
    IconCheckSquare,
    IconCode,
    IconHeading,
    IconItalic,
    IconLink,
    IconList,
    IconListOrdered,
    IconQuote
} from '../common/Icons';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    editable?: boolean;
}

const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}> = ({ onClick, isActive, disabled, children, title }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300",
            isActive && "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Write something...',
    className,
    editable = true
}) => {
    const { t } = useTranslation();
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false, // Prevent opening links when editing
                linkOnPaste: true,  // Auto-link URLs
            }),
        ],
        content: value,
        editable,
        onUpdate: ({ editor }) => {
            // Return HTML content
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] px-3 py-2",
                    "prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0", // Compact density
                    !editable && "min-h-0"
                ),
            },
        },
    });

    // Sync external value changes (only if editor is not focused/being edited to avoid cursor jumps)
    // NOTE: This is tricky. If we sync on every render, cursor jumps.
    // Usually we only initial load. But for Optimistic Updates, we might need sync.
    // For now, assume value is controlled by editor state mostly.
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if content is significantly different to avoid loops
            // Simple check: if empty and value is empty, do nothing.
            if (editor.getText() === '' && value === '') return;
            // editor.commands.setContent(value); 
            // Warning: setContent moves cursor to end.
            // If the user is typing, 'value' updates via onChange, coming back here triggers setContent -> Jump.
            // So we should NOT setContent if the change originated from editor.
            // But we don't know that here.
            // Common pattern: Only set content if it differs and editor is NOT focused?
            // Or just trust initial value.
            // For now, let's only set content on mount or if value changes externally (hard to detect).
            // A safer approach for "controlled" editor:
            // Compare current content with new value. If different, update.
            // But getting HTML varies.
            // Let's rely on standard Tiptap controlled pattern:
            // Only update if *really* needed.
            // For a task description, concurrent edits are rare.
            // We'll update only if the editor is completely empty (initial load).
            if (editor.isEmpty && value) {
                editor.commands.setContent(value);
            }
        }
    }, [editor, value]);

    if (!editor) {
        return null; // Or skeleton
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className={cn(
            "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors focus-within:ring-2 focus-within:ring-blue-500/50",
            className
        )}>
            {/* Toolbar */}
            {editable && (
                <div className="flex flex-wrap items-center gap-1 p-1 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title={t('rich_text.bold')}
                    >
                        <IconBold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title={t('rich_text.italic')}
                    >
                        <IconItalic className="w-4 h-4" />
                    </ToolbarButton>

                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title={t('rich_text.heading')}
                    >
                        <IconHeading className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title={t('rich_text.bullet_list')}
                    >
                        <IconList className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title={t('rich_text.ordered_list')}
                    >
                        <IconListOrdered className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        isActive={editor.isActive('taskList')}
                        title={t('rich_text.task_list')}
                        disabled={true} // StarterKit doesn't include TaskList by default? It does... Check.
                    // StarterKit has BulletList, OrderedList. To use TaskList we need @tiptap/extension-task-list
                    // I didn't install it. So disable for now.
                    >
                        <IconCheckSquare className="w-4 h-4 opacity-50" />
                    </ToolbarButton>

                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

                    <ToolbarButton
                        onClick={setLink}
                        isActive={editor.isActive('link')}
                        title={t('rich_text.link')}
                    >
                        <IconLink className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title={t('rich_text.code_block')}
                    >
                        <IconCode className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title={t('rich_text.blockquote')}
                    >
                        <IconQuote className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            )}

            {/* Editor Content */}
            <EditorContent editor={editor} className="min-h-[150px]" />
        </div>
    );
};
