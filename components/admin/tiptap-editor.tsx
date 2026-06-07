"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import { useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Image as ImageIcon,
} from "lucide-react"

interface TipTapEditorProps {
  value: string
  onChange: (json: string) => void
  readOnly?: boolean
}

export function TipTapEditor({ value, onChange, readOnly = false }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      ImageExtension.configure({
        allowBase64: false,
      }),
    ],
    content: parseContent(value),
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: readOnly
          ? "prose dark:prose-invert max-w-none"
          : "prose dark:prose-invert max-w-none focus:outline-none min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange(JSON.stringify(json))
    },
  })

  const addImage = useCallback(() => {
    if (!editor) return
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const formData = new FormData()
      formData.append("file", file)
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        if (!res.ok) return
        const data = await res.json()
        editor.chain().focus().setImage({ src: data.url }).run()
      } catch {
        // silently fail
      }
    }
    input.click()
  }, [editor])

  // Sync external value changes into the editor (e.g., when editing existing post)
  useEffect(() => {
    if (!editor) return
    const currentJSON = JSON.stringify(editor.getJSON())
    const parsed = parseContent(value)
    if (value && JSON.stringify(parsed) !== currentJSON && !editor.isFocused) {
      editor.commands.setContent(parsed)
    }
  }, [value, editor])

  if (!editor) {
    return (
      <div className="rounded-md border border-input bg-muted/30 p-4 text-sm text-muted-foreground">
        Loading editor...
      </div>
    )
  }

  if (readOnly) {
    return <EditorContent editor={editor} />
  }

  return (
    <div className="rounded-md border border-input">
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1">
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="size-3.5" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="size-3.5" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="size-3.5" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="size-3.5" />
        </ToolButton>
        <div className="w-px h-5 bg-border mx-0.5" />
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="size-3.5" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="size-3.5" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="size-3.5" />
        </ToolButton>
        <div className="w-px h-5 bg-border mx-0.5" />
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="size-3.5" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="size-3.5" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="size-3.5" />
        </ToolButton>
        <div className="w-px h-5 bg-border mx-0.5" />
        <ToolButton onClick={addImage} title="Insert Image">
          <ImageIcon className="size-3.5" />
        </ToolButton>
        <div className="w-px h-5 bg-border mx-0.5" />
        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="size-3.5" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="size-3.5" />
        </ToolButton>
      </div>
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

function ToolButton({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
        active && "bg-muted text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function parseContent(value: string): Record<string, unknown> | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    if (parsed && parsed.type === "doc") return parsed
    return null
  } catch {
    return null
  }
}
