import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useState } from 'react'

interface MenuListItem {
  name: string
  to: string
}

const menuItems: MenuListItem[] = [
  { name: 'Home', to: '/' },
  { name: 'Blog', to: '/blog' },
  { name: 'About', to: '/about' },
  { name: 'Projects', to: '/projects' },
]

const RootLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <nav className="border-b bg-white shadow-sm" role="navigation" aria-label="Main navigation">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-xl font-bold hover:text-blue-600" aria-label="Home">
                <img src="/circle.svg" alt="Taia Tiniyara Logo" className="h-8 w-8" />
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-6">
                {
                  menuItems.map((item) => (
                    <Link 
                      key={item.to}
                      to={item.to}
                      className="hover:text-blue-600 transition-colors"
                      activeProps={{ className: 'text-blue-600 font-medium' }}
                    >
                      {item.name}
                    </Link>
                  ))
                }
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t pt-4">
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/" 
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: 'text-blue-600 font-medium' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/blog" 
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: 'text-blue-600 font-medium' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/about" 
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: 'text-blue-600 font-medium' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/projects" 
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: 'text-blue-600 font-medium' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main role="main" className="grow">
      <Outlet />
    </main>
    <footer className="border-t bg-gray-50 mt-16" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} Taia Colai Tiniyara. All rights reserved.</p>
        </div>
      </div>
    </footer>
    <TanStackRouterDevtools />
  </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })