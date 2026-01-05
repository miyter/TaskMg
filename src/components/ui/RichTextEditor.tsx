import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import { useTranslation } from '../../core/translations';
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
    const extensions = React.useMemo(() => [
        StarterKit.configure({
            // Disable link extension in StarterKit to avoid duplication with the manual Link extension below
            link: false,
        }),
        Placeholder.configure({
            placeholder,
        }),
        Link.configure({
            openOnClick: false, // Prevent opening links when editing
            linkOnPaste: true,  // Auto-link URLs
        }),
    ], [placeholder]);

    const editor = useEditor({
        extensions,
        content: value,
        editable,
        onUpdate: React.useCallback(({ editor }: { editor: any }) => {
            // Return HTML content
            onChange(editor.getHTML());
        }, [onChange]),
        editorProps: React.useMemo(() => ({
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] px-3 py-2",
                    "prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0", // Compact density
                    !editable && "min-h-0"
                ),
            },
        }), [editable]),
    });

    // Sync external value changes
    useEffect(() => {
        if (!editor) return;

        const currentContent = editor.getHTML();
        // Provide a clearer update condition:
        // 1. If content is different
        // 2. AND (Editor is empty OR Editor is NOT focused)
        // This allows initial population and external updates (like switching tasks),
        // but prevents cursor jumping while the user is actively typing.
        if (value !== currentContent) {
            if (editor.isEmpty || !editor.isFocused) {
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
