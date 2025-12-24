import { createFileRoute } from '@tanstack/react-router'
import { SEO, StructuredData } from '@/components/SEO'
import { BookOpen, FolderGit2, User } from 'lucide-react'
import { DecorativeBackground } from '@/components/DecorativeBackground'
import { NavigationCard } from '@/components/NavigationCard'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {

  return (
    <>
      <SEO
        title="Taia Tiniyara - Full-Stack Developer"
        description="Welcome to my digital space. Full-stack software developer specializing in systems architecture, database design, and SaaS development."
      />
      <StructuredData
        type="Person"
        data={{
          name: "Taia Tiniyara",
          jobTitle: "Full-Stack Software Developer",
          url: window.location.origin,
        }}
      />
      <div className="min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <DecorativeBackground />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Greeting badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6 md:mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300">Available for opportunities</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 md:mb-6 animate-fade-in">
              <span className="text-slate-800 dark:text-slate-100">Hi, I'm</span>
              <br />
              <span className="text-blue-600 dark:text-blue-400">
                Taia Tiniyara
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Full-Stack Software Developer crafting elegant solutions through clean code, innovative design, and scalable architecture
            </p>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <NavigationCard
                to="/blog"
                icon={BookOpen}
                title="Blog"
                description="Insights on software development and technology"
                actionText="Explore articles"
                colorTheme="blue"
              />

              <NavigationCard
                to="/projects"
                icon={FolderGit2}
                title="Projects"
                description="Portfolio of work and creative implementations"
                actionText="View portfolio"
                colorTheme="purple"
              />

              <NavigationCard
                to="/about"
                icon={User}
                title="About"
                description="Learn more about my background and skills"
                actionText="Get to know me"
                colorTheme="cyan"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
