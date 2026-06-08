"use client"

import { useEffect, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { safeJsonParse } from "@/lib/utils"
import { toast } from "sonner"
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
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react"

type Props = {
  value: string
  onChange: (json: string) => void
  placeholder?: string
}

export function TipTapEditor({
  value,
  onChange,
  placeholder = "Write something...",
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value ? safeJsonParse(value, undefined) : undefined,
    onUpdate({ editor }) {
      onChange(JSON.stringify(editor.getJSON()))
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-3 border rounded-none focus:outline-none focus:ring-2 focus:ring-ring",
      },
    },
    immediatelyRender: false,
  })

  const addImage = useCallback(() => {
    const url = window.prompt("Image URL")
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    const url = window.prompt("Link URL")
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  useEffect(() => {
    if (!editor) return
    const ed = editor

    function handlePaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items
      if (!items) return

      const files: File[] = []
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile()
          if (file) files.push(file)
        }
      }

      if (files.length === 0) return

      event.preventDefault()

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        fetch("/api/upload", { method: "POST", body: formData })
          .then((res) => (res.ok ? res.json() : Promise.reject()))
          .then((data: { url: string }) => {
            ed.chain().focus().setImage({ src: data.url }).run()
          })
          .catch(() => {
            toast.error("Image upload failed")
          })
      }
    }

    const dom = ed.view.dom
    dom.addEventListener("paste", handlePaste as EventListener)
    return () => dom.removeEventListener("paste", handlePaste as EventListener)
  }, [editor])

  // Sync external value changes
  useEffect(() => {
    if (editor && value) {
      const currentJson = JSON.stringify(editor.getJSON())
      if (currentJson !== value) {
        try {
          editor.commands.setContent(JSON.parse(value))
        } catch {
          // invalid JSON, skip
        }
      }
    }
  }, [editor, value])

  if (!editor) return null

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-0.5 border-b pb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive("bold") || undefined}
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive("italic") || undefined}
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-active={editor.isActive("strike") || undefined}
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          data-active={editor.isActive("code") || undefined}
        >
          <Code className="size-4" />
        </Button>

        <div className="mx-1 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          data-active={editor.isActive("heading", { level: 1 }) || undefined}
        >
          <Heading1 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          data-active={editor.isActive("heading", { level: 2 }) || undefined}
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          data-active={editor.isActive("heading", { level: 3 }) || undefined}
        >
          <Heading3 className="size-4" />
        </Button>

        <div className="mx-1 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive("bulletList") || undefined}
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive("orderedList") || undefined}
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive("blockquote") || undefined}
        >
          <Quote className="size-4" />
        </Button>

        <div className="mx-1 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={addImage}
        >
          <ImageIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={addLink}
          data-active={editor.isActive("link") || undefined}
        >
          <LinkIcon className="size-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
