"use client"

import type { LucideIcon } from "lucide-react"
import {
  BrainCircuit,
  Code2,
  SearchCheck,
  Bug,
  Rocket,
  ChartNetwork,
  PenTool,
  FilePen,
} from "lucide-react"

type Agent = {
  label: string
  icon: LucideIcon
  color: string
}

const agents: Agent[] = [
  { label: "Architect", icon: BrainCircuit, color: "#8b5cf6" },
  { label: "Builder", icon: Code2, color: "#3b82f6" },
  { label: "Reviewer", icon: SearchCheck, color: "#10b981" },
  { label: "Tester", icon: Bug, color: "#f59e0b" },
  { label: "DevOps", icon: Rocket, color: "#ef4444" },
  { label: "Analyst", icon: ChartNetwork, color: "#06b6d4" },
  { label: "Designer", icon: PenTool, color: "#ec4899" },
  { label: "Scribe", icon: FilePen, color: "#6366f1" },
]

function AgentTile({ agent, index }: { agent: Agent; index: number }) {
  const Icon = agent.icon

  return (
    <div
      className="flex flex-col items-center gap-2 opacity-0 animate-[agent-enter_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div
        className="group relative flex size-14 items-center justify-center
          bg-card border border-border/80
          shadow-sm transition-all duration-300
          hover:-translate-y-1 hover:shadow-md hover:border-primary/30
          hover:shadow-primary/5"
      >
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300
            group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${agent.color}15, transparent 70%)`,
          }}
        />

        <div
          className="absolute inset-x-1.5 top-0 h-px opacity-0 transition-all duration-500
            group-hover:opacity-100 group-hover:inset-x-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${agent.color}60, ${agent.color}60, transparent)`,
          }}
        />

        <Icon
          className="relative size-5 text-muted-foreground transition-all duration-300
            group-hover:scale-110 group-hover:-translate-y-0.5"
          style={{ color: `color-mix(in srgb, var(--muted-foreground) 70%, ${agent.color})` }}
        />

        <span
          className="absolute right-1.5 top-1.5 size-1.5 rounded-full animate-[agent-active_2s_ease-in-out_infinite]"
          style={{ backgroundColor: agent.color, animationDelay: `${index * 0.3}s` }}
        />
      </div>

      <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
        {agent.label}
      </span>
    </div>
  )
}

export function AiTeamGrid() {
  return (
    <div className="grid flex-1 grid-cols-4 content-center gap-y-5 gap-x-2">
      {agents.map((agent, i) => (
        <AgentTile key={agent.label} agent={agent} index={i} />
      ))}
    </div>
  )
}
