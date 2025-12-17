# Taia Tiniyara - Portfolio & Blog

Personal portfolio and blogging website for Taia Colai Tiniyara, a Full-Stack Software Developer.

## About

This website serves as:
- **Portfolio**: Showcasing software engineering projects, skills, and professional experience
- **Blog**: Technical articles and insights on software development, architecture, and technology
- **Professional Profile**: Contact information and career highlights

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite 7** - Build tool and dev server
- **TanStack Router** - Type-safe routing with file-based routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Accessible component library built on Radix UI

### Backend & Database
- **Supabase** - Backend as a Service (PostgreSQL database)
- **Supabase Auth** - (Ready for future authentication needs)

### Rich Text Editing
- **Tiptap** - Headless rich text editor
- **Lowlight** - Syntax highlighting for code blocks

### Deployment
- **Firebase Hosting** - Production hosting
- **GitHub** - Version control and CI/CD

## Project Structure

```
taiatiniyara/
├── src/
│   ├── routes/              # File-based routing
│   │   ├── __root.tsx       # Root layout with navigation
│   │   ├── index.tsx        # Portfolio homepage
│   │   ├── blog.tsx         # Blog layout
│   │   ├── blog.index.tsx   # Blog listing page
│   │   ├── blog.$slug.tsx   # Individual blog post
│   │   └── blog.admin.tsx   # Blog admin dashboard
│   ├── components/
│   │   ├── RichTextEditor.tsx  # Tiptap-based editor
│   │   ├── SEO.tsx            # SEO and structured data
│   │   └── ui/                # Shadcn UI components
│   ├── hooks/
│   │   └── useBlogQueries.ts  # TanStack Query hooks
│   ├── lib/
│   │   ├── blog.ts           # Blog utilities
│   │   ├── supabase.ts       # Supabase client
│   │   └── utils.ts          # General utilities
│   └── types/
│       └── blog.ts           # TypeScript types
├── docs/                    # Documentation
├── public/                  # Static assets
└── firebase.json           # Firebase hosting config
```

## Features

### Portfolio Page (/)
- Professional introduction and biography
- Skills and competencies showcase
- Technology stack badges (C#, JavaScript, TypeScript, Python, GO, etc.)
- Project portfolio with links to:
  - Hakwa (ongoing)
  - Totolaw (ongoing)
  - Niucut (ongoing)
  - Pacific Power Association Performance Benchmarking
  - Samoa Tourism Product Database
- Contact information
- Animated UI with decorative background elements
- SEO optimized with structured data

### Blog System
- **Public Blog** (`/blog`):
  - Lists all published blog posts
  - Tag filtering system
  - Pagination support
  - Featured images
  - Post excerpts
  - Responsive card layout
  - SEO optimized with structured data

- **Blog Post Page** (`/blog/:slug`):
  - Full article view with rich text content
  - Featured image display
  - Published date
  - Tag display
  - SEO meta tags and structured data
  - Responsive typography with prose styling
  - Back to blog navigation

- **Admin Dashboard** (`/blog/admin`):
  - Create and edit blog posts
  - Rich text editor with formatting toolbar:
    - Text formatting (bold, italic, underline, strikethrough)
    - Headings (H1, H2, H3)
    - Lists (ordered and unordered)
    - Code blocks with syntax highlighting
    - Links
    - Text alignment
    - Blockquotes
  - Slug auto-generation from title
  - Tag management
  - Featured image URL support
  - Draft/publish toggle
  - Post preview
  - Delete posts with confirmation
  - Real-time updates with TanStack Query

### Technical Features
- **Type-Safe Routing**: TanStack Router with generated route tree
- **Data Fetching**: TanStack Query for efficient caching and state management
- **Rich Text Editing**: Tiptap editor with comprehensive formatting options
- **SEO**: Dynamic meta tags, Open Graph, Twitter Cards, structured data
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Code splitting, lazy loading, optimized builds

## Database Schema

The blog uses a `blog_posts` table in Supabase with the following structure:
- `id` (UUID, primary key)
- `title` (text)
- `slug` (text, unique)
- `content` (text, HTML format)
- `excerpt` (text, optional)
- `featured_image` (text URL, optional)
- `tags` (text array)
- `published` (boolean)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Firebase project (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taiatiniyara
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Development Commands

```bash
# Start development server
npm run dev

# Type check
npm run build  # This runs tsc -b before building

# Lint code
npm run lint

# Preview production build
npm run preview

# Deploy to Firebase
npm run deploy
```

## Deployment

The site is deployed to Firebase Hosting:

1. Build and deploy:
```bash
npm run deploy
```

This command:
- Runs TypeScript compilation
- Builds the production bundle with Vite
- Deploys to Firebase Hosting

2. Firebase configuration is in `firebase.json`:
   - Site: taiatiniyara
   - Public directory: dist
   - SPA routing enabled

## Configuration Files

- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration (v4, uses CSS imports)
- `components.json` - Shadcn UI components configuration
- `firebase.json` - Firebase hosting configuration
- `eslint.config.js` - ESLint configuration

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Supabase anonymous key

## Browser Support

Modern browsers with ES6+ support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features to implement:
- User authentication for blog admin
- Comment system
- Search functionality
- RSS feed
- Newsletter subscription
- Dark mode toggle
- Blog categories
- Related posts
- Social media sharing
- Analytics integration

## Contact

**Taia Colai Tiniyara**
- Email: taiatiniyara@gmail.com
- Phone: +679 986 0831
- GitHub: [@taiatiniyara](https://github.com/taiatiniyara)

For inquiries or collaboration opportunities, please reach out through the contact information above.

## License

© 2025 Taia Colai Tiniyara. All rights reserved.
