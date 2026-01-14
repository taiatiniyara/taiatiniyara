// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImagePlus,
  Code2,
  FileCode,
} from "lucide-react";
import { useCallback, useState } from "react";

const lowlight = createLowlight(common);

interface TiptapProps {
  content?: string;
  onChange?: (html: string) => void;
}

const Tiptap = ({ content = "<p>Start writing your content here...</p>", onChange }: TiptapProps) => {
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use CodeBlockLowlight
      }),
      Document,
      Paragraph,
      Text,
      Heading.configure({ levels: [1, 2, 3] }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    autofocus: true,
    editable: true,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[200px] p-6",
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const toggleHtmlSource = useCallback(() => {
    if (!showHtmlSource) {
      // Switching to HTML source view
      setHtmlContent(editor?.getHTML() || "");
    } else {
      // Switching back to editor view
      editor?.commands.setContent(htmlContent);
      if (onChange) {
        onChange(htmlContent);
      }
    }
    setShowHtmlSource(!showHtmlSource);
  }, [editor, showHtmlSource, htmlContent, onChange]);

  const handleHtmlContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(e.target.value);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="bg-card border-border ring-foreground/10 sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-2xl border-b p-2 ring-1">
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={cn(
              editor.isActive("bold") && "bg-muted text-foreground"
            )}
            title="Bold"
          >
            <Bold className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={cn(
              editor.isActive("italic") && "bg-muted text-foreground"
            )}
            title="Italic"
          >
            <Italic className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={cn(
              editor.isActive("strike") && "bg-muted text-foreground"
            )}
            title="Strikethrough"
          >
            <Strikethrough className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={cn(
              editor.isActive("code") && "bg-muted text-foreground"
            )}
            title="Code"
          >
            <Code className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cn(
              editor.isActive("heading", { level: 1 }) &&
                "bg-muted text-foreground"
            )}
            title="Heading 1"
          >
            <Heading1 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={cn(
              editor.isActive("heading", { level: 2 }) &&
                "bg-muted text-foreground"
            )}
            title="Heading 2"
          >
            <Heading2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={cn(
              editor.isActive("heading", { level: 3 }) &&
                "bg-muted text-foreground"
            )}
            title="Heading 3"
          >
            <Heading3 className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              editor.isActive("bulletList") && "bg-muted text-foreground"
            )}
            title="Bullet List"
          >
            <List className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              editor.isActive("orderedList") && "bg-muted text-foreground"
            )}
            title="Ordered List"
          >
            <ListOrdered className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              editor.isActive("blockquote") && "bg-muted text-foreground"
            )}
            title="Blockquote"
          >
            <Quote className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={addImage}
            title="Insert Image"
          >
            <ImagePlus className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn(
              editor.isActive("codeBlock") && "bg-muted text-foreground"
            )}
            title="Code Block"
          >
            <Code2 className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleHtmlSource}
            className={cn(
              showHtmlSource && "bg-muted text-foreground"
            )}
            title="HTML Source"
          >
            <FileCode className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="size-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content or HTML Source */}
      {showHtmlSource ? (
        <div className="bg-card text-card-foreground ring-foreground/10 rounded-b-2xl ring-1">
          <textarea
            value={htmlContent}
            onChange={handleHtmlContentChange}
            className="w-full min-h-50 max-h-125 p-6 bg-transparent border-none focus:outline-none font-mono text-sm resize-y"
            placeholder="Edit HTML source..."
          />
        </div>
      ) : (
        <div className="bg-card text-card-foreground ring-foreground/10 rounded-b-2xl ring-1 max-h-125 overflow-y-auto">
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      )}

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          className="bg-popover text-popover-foreground ring-foreground/10 flex items-center gap-1 rounded-2xl p-1 shadow-lg ring-1"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "size-7",
              editor.isActive("bold") && "bg-muted text-foreground"
            )}
          >
            <Bold className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "size-7",
              editor.isActive("italic") && "bg-muted text-foreground"
            )}
          >
            <Italic className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              "size-7",
              editor.isActive("strike") && "bg-muted text-foreground"
            )}
          >
            <Strikethrough className="size-3" />
          </Button>
        </BubbleMenu>
      )}

      {/* Floating Menu */}
      {editor && (
        <FloatingMenu
          editor={editor}
          className="bg-popover text-popover-foreground ring-foreground/10 flex items-center gap-1 rounded-2xl p-1 shadow-lg ring-1"
        >
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cn(
              editor.isActive("heading", { level: 1 }) && "bg-muted"
            )}
          >
            H1
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={cn(
              editor.isActive("heading", { level: 2 }) && "bg-muted"
            )}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(editor.isActive("bulletList") && "bg-muted")}
          >
            List
          </Button>
        </FloatingMenu>
      )}

      {/* Custom Styles for the Editor Content */}
      <style>{`
        .tiptap-editor .tiptap {
          padding: 1.5rem;
        }

        .tiptap-editor .tiptap:focus {
          outline: none;
        }

        .tiptap-editor .tiptap p {
          margin: 0.75rem 0;
        }

        .tiptap-editor .tiptap h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem;
          line-height: 1.2;
        }

        .tiptap-editor .tiptap h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem;
          line-height: 1.3;
        }

        .tiptap-editor .tiptap h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          line-height: 1.4;
        }

        .tiptap-editor .tiptap ul,
        .tiptap-editor .tiptap ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }

        .tiptap-editor .tiptap ul {
          list-style-type: disc;
        }

        .tiptap-editor .tiptap ol {
          list-style-type: decimal;
        }

        .tiptap-editor .tiptap li {
          margin: 0.25rem 0;
        }

        .tiptap-editor .tiptap blockquote {
          border-left: 3px solid hsl(var(--border));
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }

        .tiptap-editor .tiptap code {
          background-color: hsl(var(--muted));
          color: hsl(var(--foreground));
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
        }

        .tiptap-editor .tiptap pre {
          background-color: hsl(var(--muted));
          color: hsl(var(--foreground));
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
        }

        .tiptap-editor .tiptap pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }

        /* Code Block Syntax Highlighting */
        .tiptap-editor .tiptap .hljs-comment,
        .tiptap-editor .tiptap .hljs-quote {
          color: hsl(var(--muted-foreground));
        }

        .tiptap-editor .tiptap .hljs-variable,
        .tiptap-editor .tiptap .hljs-template-variable,
        .tiptap-editor .tiptap .hljs-attribute,
        .tiptap-editor .tiptap .hljs-tag,
        .tiptap-editor .tiptap .hljs-name,
        .tiptap-editor .tiptap .hljs-selector-id,
        .tiptap-editor .tiptap .hljs-selector-class {
          color: hsl(var(--primary));
        }

        .tiptap-editor .tiptap .hljs-number,
        .tiptap-editor .tiptap .hljs-literal,
        .tiptap-editor .tiptap .hljs-meta,
        .tiptap-editor .tiptap .hljs-link {
          color: hsl(var(--destructive));
        }

        .tiptap-editor .tiptap .hljs-string,
        .tiptap-editor .tiptap .hljs-symbol,
        .tiptap-editor .tiptap .hljs-bullet,
        .tiptap-editor .tiptap .hljs-addition {
          color: #22c55e;
        }

        .tiptap-editor .tiptap .hljs-title,
        .tiptap-editor .tiptap .hljs-section,
        .tiptap-editor .tiptap .hljs-keyword,
        .tiptap-editor .tiptap .hljs-selector-tag {
          color: #3b82f6;
        }

        .tiptap-editor .tiptap strong {
          fImages */
        .tiptap-editor .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
          display: block;
        }

        .tiptap-editor .tiptap img.ProseMirror-selectednode {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
        }

        /* ont-weight: 700;
        }

        .tiptap-editor .tiptap em {
          font-style: italic;
        }

        .tiptap-editor .tiptap s {
          text-decoration: line-through;
        }

        /* Placeholder */
        .tiptap-editor .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          float: left;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default Tiptap;
