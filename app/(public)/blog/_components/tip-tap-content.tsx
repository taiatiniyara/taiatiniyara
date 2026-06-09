"use client"

import type { JSX } from "react"
import {
  type ReactNode,
  createElement,
  Fragment,
} from "react"
import { safeJsonParse } from "@/lib/utils"

type TipTapNode = {
  type?: string
  text?: string
  content?: TipTapNode[]
  marks?: { type: string; attrs?: Record<string, string> }[]
  attrs?: Record<string, string>
}

function renderNodes(nodes: TipTapNode[]): ReactNode {
  return nodes.map((node, i) => {
    switch (node.type) {
      case "doc":
        return (
          <Fragment key={i}>{node.content ? renderNodes(node.content) : null}</Fragment>
        )

      case "paragraph":
        return (
          <p key={i} className="mb-6 leading-relaxed">
            {node.content ? renderNodes(node.content) : <br />}
          </p>
        )

      case "heading": {
        const rawLevel = Number(node.attrs?.level) || 1
        const level = Math.min(rawLevel + 1, 3) as 2 | 3
        const Tag = `h${level}` as keyof JSX.IntrinsicElements
        const sizeClasses = {
          2: "text-3xl font-bold mt-12 mb-5",
          3: "text-xl font-semibold mt-8 mb-3",
        }
        return createElement(
          Tag,
          { key: i, className: sizeClasses[level] || sizeClasses[2] },
          node.content ? renderNodes(node.content) : null,
        )
      }

      case "bulletList":
        return (
          <ul key={i} className="list-disc pl-6 mb-6 space-y-2">
            {node.content ? renderNodes(node.content) : null}
          </ul>
        )

      case "orderedList":
        return (
          <ol key={i} className="list-decimal pl-6 mb-6 space-y-2">
            {node.content ? renderNodes(node.content) : null}
          </ol>
        )

      case "listItem":
        return (
          <li key={i}>
            {node.content ? renderNodes(node.content) : null}
          </li>
        )

      case "blockquote":
        return (
          <blockquote
            key={i}
            className="border-l-4 border-primary pl-6 italic text-muted-foreground my-8"
          >
            {node.content ? renderNodes(node.content) : null}
          </blockquote>
        )

      case "codeBlock":
        return (
          <pre key={i} className="bg-muted rounded-none p-5 overflow-x-auto text-sm my-6">
            <code>
              {node.content ? renderNodes(node.content) : null}
            </code>
          </pre>
        )

      case "image":
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={node.attrs?.src ?? ""}
            alt={node.attrs?.alt ?? ""}
            className="my-6 max-w-full"
          />
        )

      case "horizontalRule":
        return <hr key={i} className="my-10 border-border" />

      case "text": {
        let content: ReactNode = node.text ?? ""

        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case "bold":
                content = <strong key="bold">{content}</strong>
                break
              case "italic":
                content = <em key="italic">{content}</em>
                break
              case "strike":
                content = <s key="strike">{content}</s>
                break
              case "code":
                content = (
                  <code
                    key="code"
                    className="bg-muted rounded-none px-1.5 py-0.5 text-sm font-mono"
                  >
                    {content}
                  </code>
                )
                break
              case "link":
                content = (
                  <a
                    key="link"
                    href={mark.attrs?.href ?? "#"}
                    target={mark.attrs?.target ?? "_blank"}
                    rel="noopener noreferrer nofollow ugc"
                    className="text-primary underline underline-offset-4 hover:no-underline"
                  >
                    {content}
                  </a>
                )
                break
            }
          }
        }

        return <Fragment key={i}>{content}</Fragment>
      }

      default:
        return null
    }
  })
}

export function TipTapContent({ content }: { content: string }) {
  if (!content) return null

  const doc = safeJsonParse<TipTapNode | null>(content, null)
  if (!doc) return <p className="text-muted-foreground">Unable to render content.</p>

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {renderNodes(doc.content ?? [])}
    </div>
  )
}
