import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SEO, StructuredData } from '@/components/SEO'
import { DecorativeBackground } from '@/components/DecorativeBackground'

export const Route = createFileRoute('/about/')({
  component: RouteComponent,
})

function RouteComponent() {
  const skills = [
    'C#', 'JavaScript', 'TypeScript', 'Python', 'GO',
    'Express', 'Next.js', 'React', 'Django', '.NET Core'
  ]

  const howIHelp = [
    'Scale Your Business with Robust Architecture',
    'Optimize Your Data for Performance',
    'Build Custom Software Solutions',
    'Connect Your Systems with Powerful APIs',
    'Create Intuitive User Experiences',
    'Launch Multi-tenant SaaS Platforms',
    'Modernize Legacy Applications'
  ]

  return (
    <>
      <SEO
        title="How I Can Help - Taia Tiniyara"
        description="Need scalable software solutions? I help businesses build robust SaaS applications, design efficient systems, and develop APIs that power growth."
        ogImageAlt="Taia Tiniyara - Full-Stack Software Developer"
      />
      <StructuredData
        type="Person"
        data={{
          name: 'Taia Tiniyara',
          jobTitle: 'Full-Stack Software Developer',
          url: window.location.origin,
          email: 'taiatiniyara@gmail.com',
          telephone: '+679 986 0831',
          knowsAbout: skills,
          sameAs: [
            'https://github.com/taiatiniyara',
          ],
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: window.location.origin,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'About',
              item: `${window.location.origin}/about`,
            },
          ],
        }}
      />
      <StructuredData
        type="Organization"
        data={{
          name: 'Taia Tiniyara',
          url: window.location.origin,
          logo: `${window.location.origin}/circle.svg`,
          sameAs: [
            'https://github.com/taiatiniyara',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+679 986 0831',
            contactType: 'Professional',
            email: 'taiatiniyara@gmail.com',
          },
        }}
      />
      <div className="min-h-screen">
        <DecorativeBackground />

        {/* Hero Section */}
        <section className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Profile Image */}
              <div className="shrink-0 animate-fade-in">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                  <img 
                    src="/taia.jpg" 
                    alt="Taia Tiniyara" 
                    className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-2xl ring-4 ring-blue-500/20 dark:ring-blue-400/20 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="space-y-2">
                  <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight animate-fade-in">
                    <span className="text-blue-600 dark:text-blue-400">
                      Taia Tiniyara
                    </span>
                  </h1>
                  <div className="h-1 w-24 bg-blue-600 mx-auto lg:mx-0 rounded-full"></div>
                </div>
                <p className="text-2xl lg:text-3xl text-slate-700 dark:text-slate-300 font-medium animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Full-Stack Software Developer
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  Helping businesses grow with elegant, scalable software solutions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                How I Can Help You
              </h2>
              <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full mb-6"></div>
            </div>
            <Card className="p-8 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                Whether you're launching a new product or scaling an existing one, I'll help you build software that grows with your business. 
                My expertise in multi-tenant systems and SaaS architecture means you'll get solutions that are not only powerful and scalable, 
                but also cost-effective and maintainable.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                You deserve software that works seamlessly. I combine strong technical architecture with user-centered design to create 
                applications your customers will love to use. From API development to full-stack applications, I'll turn your vision into 
                clean, reliable code that stands the test of time.
              </p>
            </Card>
          </div>
        </section>

        {/* Core Competencies */}
        <section className="relative container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Solutions I Provide
              </h2>
              <p className="text-slate-600 dark:text-slate-400">Ways I can help your business succeed</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {howIHelp.map((competency, index) => (
                <Card key={competency} className={`group relative p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden ${index % 2 === 0 ? `bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/50` : `bg-slate-100/80 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-700/50`} backdrop-blur-sm`}>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full"></div>
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
                  <p className="relative text-center font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {competency}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="relative container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Technology Stack
              </h2>
              <p className="text-slate-600 dark:text-slate-400">The right tools to bring your project to life</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <Badge 
                  key={skill} 
                  className={`px-5 py-2.5 text-base hover:scale-110 transition-all duration-200 cursor-default shadow-md hover:shadow-lg ${index % 2 === 0 ? `bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-500/20` : `bg-slate-600 hover:bg-slate-700 text-white ring-2 ring-slate-600/20`}`}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Let's Work Together
              </h2>
              <p className="text-slate-600 dark:text-slate-400">Ready to bring your project to life? Get in touch</p>
            </div>
            <Card className="relative overflow-hidden p-8 bg-blue-50/80 dark:bg-blue-950/20 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32"></div>
              <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                <a 
                  href="mailto:taiatiniyara@gmail.com" 
                  className="group flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">taiatiniyara@gmail.com</span>
                </a>
                <a 
                  href="tel:+6799860831" 
                  className="group flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">+679 986 0831</span>
                </a>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA to Projects */}
        <section className="relative container mx-auto px-4 py-16 pb-24">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden p-12 bg-blue-600 dark:bg-blue-700 border-none shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48"></div>
              <div className="relative text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  See What's Possible
                </h2>
                <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                  Explore real-world examples of how I've helped businesses solve complex challenges with elegant software solutions.
                </p>
                <a 
                  href="/projects" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:gap-4"
                >
                  <span>View Projects</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}
