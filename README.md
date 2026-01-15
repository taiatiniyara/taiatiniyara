# Taia Tiniyara - Portfolio & Learning Platform

🚀 A modern, full-stack web application featuring a personal portfolio, blog, and course management system built with cutting-edge technologies.

## 🌟 Features

### 🎨 Core Features
- **Portfolio Showcase** - Display projects with rich content and media
- **Blog System** - Full-featured blog with markdown support and TipTap editor
- **Course Management** - Complete learning management system with lessons and progress tracking
- **Rich Text Editor** - Enhanced TipTap editor with code blocks, syntax highlighting, and HTML source editing
- **Authentication** - Secure user authentication with Supabase (email/password, password reset)
- **Admin Dashboard** - Full CRUD operations for content management
- **Student Dashboard** - Track course progress and manage enrollments
- **Dark/Light Mode** - Beautiful theme switching with system preference support
- **SEO Optimized** - Meta tags, Open Graph, structured data, and dynamic sitemap
- **Responsive Design** - Mobile-first design that works on all devices

### 🎓 Learning Platform Features
- Course categories with difficulty levels
- Lesson management with duration tracking
- Student enrollment system
- Progress tracking per lesson
- Course reviews and ratings
- Technology and tag filtering
- Rich text editor for lesson content
- Comments on lessons and blog posts

### 📊 User Experience Features
- Reusable search and filter components
- Real-time data synchronization with TanStack Query
- Loading states and error handling
- Toast notifications for user feedback
- Empty state placeholders
- Responsive statistics cards

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **TanStack Router** - Type-safe routing with file-based routing
- **TanStack Query** - Powerful data synchronization
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **TipTap** - Rich text editor with code blocks, syntax highlighting (Lowlight), and HTML source editing
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend as a Service (Authentication, Database, Real-time)
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe database queries

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **pnpm/npm** - Package management

## 📁 Project Structure

```
├── src/
│   ├── components/       # Reusable components
│   │   ├── auth/        # Authentication components
│   │   ├── blog/        # Blog-related components
│   │   ├── courses/     # Course management components
│   │   ├── projects/    # Project components
│   │   └── ui/          # Shared UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries and configuration
│   │   └── drizzle/     # Database schema and migrations
│   └── routes/          # File-based routing pages
│       ├── blog/        # Blog pages
│       ├── courses/     # Course pages
│       ├── projects/    # Project pages
│       └── student/     # Student dashboard
├── docs/                # Documentation
├── public/              # Static assets
└── scripts/             # Build and utility scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd taiatiniyara
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

4. **Set up the database**
```bash
npm run db-push
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see your application!

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run postbuild` - Generate static blog pages after build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run db-push` - Push Drizzle ORM schema changes to database
- `npm run generate-sitemap` - Generate XML sitemap for SEO
- `npm run deploy` - Full deployment pipeline (db-push → sitemap → build → firebase deploy)

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- [Authentication System](./docs/AUTH_README.md) - Complete auth setup and usage
- [Courses System](./docs/COURSES_README.md) - Course management documentation  
- [Courses Quick Reference](./docs/COURSES_QUICK_REFERENCE.md) - Quick course feature guide
- [SEO Guide](./docs/SEO_GUIDE.md) - SEO optimization strategies
- [SEO Quick Reference](./docs/SEO_QUICK_REFERENCE.md) - Quick SEO tips
- [SEO Optimization Summary](./docs/SEO_OPTIMIZATION_SUMMARY.md) - SEO implementation details
- [Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md) - Feature implementation timeline
- [Documentation Update Log](./docs/DOCUMENTATION_UPDATE_LOG.md) - Documentation change history

## 🗃️ Database Schema

The application uses PostgreSQL via Supabase with the following main tables:

### Core Tables
- `user_profiles` - Extended user information and preferences
- `projects` - Portfolio projects showcase
- `blog_posts` - Blog articles and content
- `blog_comments` - Comments on blog posts

### Learning Management System
- `courses` - Course information and metadata
- `course_categories` - Course categorization and difficulty levels
- `lessons` - Individual course lessons with content
- `lesson_comments` - Comments on lessons
- `enrollments` - Student course enrollments with timestamps
- `progress_tracking` - Lesson completion tracking per student

See [schema.ts](./src/lib/drizzle/schema.ts) for complete type-safe schema definitions.

## 🔐 Authentication

The application uses Supabase Authentication with:
- Email/password authentication
- Email verification
- Password reset via email
- Protected routes
- Role-based access (admin/user)

See [AUTH_README.md](./docs/AUTH_README.md) for detailed setup.

## 🎨 Styling

Utilizes Tailwind CSS 4 with:
- Custom color schemes
- Dark/light mode support
- Responsive design utilities
- Animation utilities
- Custom components via Radix UI

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌐 SEO Features

- Dynamic meta tags
- Open Graph protocol
- Twitter Card support
- Structured data (JSON-LD)
- XML sitemap generation
- Robots.txt configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 👤 Author

**Taia Tiniyara**
- Portfolio: [Your Portfolio URL]
- GitHub: [@taiatiniyara]
- LinkedIn: [Your LinkedIn]

## 🙏 Acknowledgments

- React and the React team
- Vercel for Vite
- Supabase team
- Tailwind CSS team
- All open-source contributors

---

**Last Updated:** January 15, 2026

**Build Status:** ✅ Successfully Built (Zero Errors)

**Status:** Production-ready and actively maintained

## 🔧 Recent Updates

### Build Fixes (January 15, 2026)
- ✅ Resolved all TypeScript compilation errors
- ✅ Removed unused imports for cleaner code
- ✅ Fixed component prop type mismatches
- ✅ Optimized bundle size (484.43 kB main bundle, 145.28 kB gzipped)
- ✅ Successfully generated 26 static blog pages
- ✅ Production build ready for deployment
