"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { toast } from "sonner"
import { Send, Loader2 } from "lucide-react"

export function Contact() {
  const [sending, setSending] = useState(false)
  const [formKey, setFormKey] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Message sent! We'll get back to you soon.")
        setFormKey((k) => k + 1)
      } else {
        toast.error(data.error || "Failed to send message")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s Work Together
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tell us about your project and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Card className="mx-auto max-w-lg p-6">
            <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Project Type</label>
                  <Select name="projectType">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-app">Web App</SelectItem>
                      <SelectItem value="mobile-app">Mobile App</SelectItem>
                      <SelectItem value="api">API / Backend</SelectItem>
                      <SelectItem value="saas">SaaS Product</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Timeline</label>
                  <Select name="timeline">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1-3-months">1–3 months</SelectItem>
                      <SelectItem value="3-6-months">3–6 months</SelectItem>
                      <SelectItem value="exploring">Just exploring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Budget</label>
                  <Select name="budgetRange">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5k">Under $5k</SelectItem>
                      <SelectItem value="5k-25k">$5k – $25k</SelectItem>
                      <SelectItem value="25k-plus">$25k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium">
                  Message <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={sending} className="w-full">
                {sending ? (
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                ) : (
                  <Send className="size-4 mr-1.5" />
                )}
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  )
}
