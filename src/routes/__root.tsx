import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
  <div className="flex flex-col min-h-screen">
    <header>
      <nav className="border-b bg-white" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold hover:text-blue-600" aria-label="Home">
              <img src="/circle.svg" alt="Taia Tiniyara Logo" className="h-8 w-8" />
            </Link>
            <div className="flex gap-6">
              <Link 
                to="/" 
                className="hover:text-blue-600 transition-colors"
                activeProps={{ className: 'text-blue-600 font-medium' }}
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className="hover:text-blue-600 transition-colors"
                activeProps={{ className: 'text-blue-600 font-medium' }}
              >
                Blog
              </Link>
            </div>
          </div>
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

export const Route = createRootRoute({ component: RootLayout })