function parseTipTapContent(content: unknown): Array<Record<string, unknown>> | null {
  try {
    const doc = content as { type: string; content?: Array<Record<string, unknown>> }
    if (doc.type !== "doc" || !doc.content) return []
    return doc.content
  } catch {
    return null
  }
}

export function TipTapContent({ content }: { content: unknown }) {
  const nodes = parseTipTapContent(content)
  if (!nodes) {
    return <p className="text-muted-foreground">Could not render content.</p>
  }
  if (nodes.length === 0) {
    return <p className="text-muted-foreground">No content.</p>
  }
  return (
    <div className="space-y-4">
      {nodes.map((node, i) => (
        <RenderNode key={i} node={node} />
      ))}
    </div>
  )
}

function RenderNode({ node }: { node: Record<string, unknown> }) {
  const type = node.type as string
  const children = node.content as Array<Record<string, unknown>> | undefined

  switch (type) {
    case "heading": {
      const level = (node.attrs as Record<string, number> | undefined)?.["level"] || 1
      const headingClass = `font-semibold tracking-tight ${
        level === 1 ? "text-3xl mt-8" :
        level === 2 ? "text-2xl mt-6" :
        "text-xl mt-4"
      }`
      const headingContent = children?.map((c, i) => <RenderInline key={i} node={c} />)
      switch (level) {
        case 1: return <h1 className={headingClass}>{headingContent}</h1>
        case 2: return <h2 className={headingClass}>{headingContent}</h2>
        case 3: return <h3 className={headingClass}>{headingContent}</h3>
        case 4: return <h4 className={headingClass}>{headingContent}</h4>
        case 5: return <h5 className={headingClass}>{headingContent}</h5>
        default: return <h6 className={headingClass}>{headingContent}</h6>
      }
    }
    case "paragraph":
      return (
        <p className="leading-7 text-foreground/90">
          {children?.map((c, i) => <RenderInline key={i} node={c} />) || <br />}
        </p>
      )
    case "bulletList":
      return (
        <ul className="list-disc pl-6 space-y-1">
          {children?.map((c, i) => <RenderNode key={i} node={c} />)}
        </ul>
      )
    case "orderedList":
      return (
        <ol className="list-decimal pl-6 space-y-1">
          {children?.map((c, i) => <RenderNode key={i} node={c} />)}
        </ol>
      )
    case "listItem":
      return <li>{children?.map((c, i) => <RenderInline key={i} node={c} />)}</li>
    case "blockquote":
      return (
        <blockquote className="border-l-2 border-primary/30 pl-4 italic text-muted-foreground">
          {children?.map((c, i) => <RenderNode key={i} node={c} />)}
        </blockquote>
      )
    case "codeBlock":
      return (
        <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm font-mono">
          <code>
            {children?.flatMap((c) =>
              ((c.content as Array<{ text?: string }>) || []).map((t) => t.text || "")
            ).join("")}
          </code>
        </pre>
      )
    case "horizontalRule":
      return <hr className="my-8 border-t" />
    case "image": {
      const src = (node.attrs as Record<string, string> | undefined)?.["src"]
      const alt = (node.attrs as Record<string, string> | undefined)?.["alt"] || ""
      return src ? (
        <img src={src} alt={alt} className="rounded-lg my-4 max-w-full" />
      ) : null
    }
    case "tagLabel": {
      const tag = (node.attrs as Record<string, string> | undefined)?.["label"]
      return tag ? (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary align-middle">
          {tag}
        </span>
      ) : null
    }
    default:
      return children ? (
        <div>{children.map((c, i) => <RenderNode key={i} node={c} />)}</div>
      ) : null
  }
}

function RenderInline({ node }: { node: Record<string, unknown> }) {
  const type = node.type as string
  const text = (node.text as string) || ""

  switch (type) {
    case "text":
      return <>{text}</>
    case "hardBreak":
      return <br />
    case "bold":
      return (
        <strong className="font-semibold">
          {(node.content as Array<Record<string, unknown>>)?.map((c, i) => (
            <RenderInline key={i} node={c} />
          ))}
        </strong>
      )
    case "italic":
      return (
        <em>
          {(node.content as Array<Record<string, unknown>>)?.map((c, i) => (
            <RenderInline key={i} node={c} />
          ))}
        </em>
      )
    case "code":
      return (
        <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono">
          {text}
        </code>
      )
    case "link": {
      const href = (node.attrs as Record<string, string>)?.["href"] || "#"
      return (
        <a href={href} className="text-primary underline underline-offset-4 hover:no-underline">
          {(node.content as Array<Record<string, unknown>>)?.map((c, i) => (
            <RenderInline key={i} node={c} />
          )) || text}
        </a>
      )
    }
    case "strike":
      return (
        <s>
          {(node.content as Array<Record<string, unknown>>)?.map((c, i) => (
            <RenderInline key={i} node={c} />
          ))}
        </s>
      )
    default:
      return <>{text}</>
  }
}
