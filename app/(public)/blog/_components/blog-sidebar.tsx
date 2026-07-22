"use client"

import { useActionState, useCallback } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { subscribe } from "@/app/(public)/blog/_actions/subscribe"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useRef } from "react"

type RandomPost = {
  id: number
  title: string
  slug: string
  publishedAt: string
}

export function BlogSidebar({ randomPosts }: { randomPosts: RandomPost[] }) {
  const subscribeAction = useCallback(
    async (_state: unknown, formData: FormData) => {
      return subscribe(formData)
    },
    []
  )
  const [state, action, isPending] = useActionState(subscribeAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state && "success" in state && state.success) {
      toast.success(state.message)
      formRef.current?.reset()
    } else if (state && "error" in state && typeof state.error === "string") {
      toast.error(state.error)
    } else if (state && "error" in state && typeof state.error === "object") {
      const firstError = Object.values(state.error).flat()[0]
      if (firstError) toast.error(firstError)
    }
  }, [state])

  return (
    <aside className="space-y-8">
      <Card className="p-6">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Subscribe
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Get new posts delivered to your inbox. No spam, unsubscribe anytime.
        </p>
        <form ref={formRef} action={action} className="flex gap-2">
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="text-sm"
          />
          <Button type="submit" size="sm" disabled={isPending}>
            <Send className="size-3.5" />
            <span className="sr-only">Subscribe</span>
          </Button>
        </form>
      </Card>

      {randomPosts.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Other Posts
          </h3>
          <ul className="space-y-3">
            {randomPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block text-sm hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs text-muted-foreground"
                  >
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </aside>
  )
}
