# IQ Didactic LMS - Final Edition

**Enterprise-Grade Learning Management System | Built with Bun, Vercel, Railway & Serverless NoSQL**

---

## 🎯 Project Overview

IQ Didactic LMS Final is a modern, scalable learning management system designed for educational institutions, corporate training, and student communities. Built with cutting-edge 2026 technologies and best practices, featuring glassmorphism design, theme switching, and modular architecture.

**Live Demo:** [Coming Soon]

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript + Tailwind CSS | Vercel deployment, SPA with glass design |
| **Backend** | Bun + Elysia | Railway deployment, serverless API |
| **Database** | Supabase (PostgreSQL) + Prisma | Serverless-friendly with edge functions |
| **Real-time** | Supabase Realtime | WebSocket-based live features |
| **File Storage** | Supabase Storage | Course materials, assignments |
| **Authentication** | Supabase Auth + JWT | Role-based access control (RBAC) |
| **Package Manager** | Bun | Fast, all-in-one solution |
| **Deployment** | Vercel (Frontend) + Railway (Backend) | Serverless, auto-scaling |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│  (Web Browsers - Light/Dark Mode Theme Support)             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼─────────────┐      ┌─────────▼──────────┐
    │    VERCEL        │      │   RAILWAY          │
    │  (Frontend)      │      │  (Backend API)     │
    │  ┌────────────┐  │      │  ┌──────────────┐  │
    │  │ React SPA  │  │      │  │ Bun + Elysia │  │
    │  │ Glass UI   │  │      │  │ REST API     │  │
    │  │ Theme Mgmt │  │      │  │ Edge Logic   │  │
    │  └────────────┘  │      │  └──────┬───────┘  │
    └────┬─────────────┘      └─────────┬──────────┘
         │ API Calls                   │ Queries
         │                             │
         └──────────────┬──────────────┘
                        │
         ┌──────────────▼──────────────┐
         │      SUPABASE               │
         │  (Serverless Backend)       │
         │  ┌─────────────────────┐    │
         │  │  PostgreSQL DB      │    │
         │  │  (Prisma ORM)       │    │
         │  ├─────────────────────┤    │
         │  │  Auth & JWT         │    │
         │  ├─────────────────────┤    │
         │  │  Real-time Events   │    │
         │  ├─────────────────────┤    │
         │  │  File Storage       │    │
         │  └─────────────────────┘    │
         └──────────────────────────────┘
```

---

## 📋 Build Phases (Sequential)

### Phase 1: Foundation & Infrastructure ⚙️
**Duration:** 1-2 hours | **Priority:** CRITICAL

#### Deliverables:
- [ ] Project structure setup (Bun workspace)
- [ ] Frontend: Next.js/React app scaffolding
- [ ] Backend: Bun + Elysia project setup
- [ ] Environment configuration (.env files)
- [ ] Supabase project configuration
- [ ] Database schema with Prisma

#### Key Files:
- `packages/frontend/` - React app root
- `packages/backend/` - Bun API root
- `packages/shared/` - TypeScript types (shared)
- `prisma/schema.prisma` - Database schema
- `.env.example` - Environment template

**Output:** Fully configured, dev servers running locally

---

### Phase 2: Design System & UI Foundation 🎨
**Duration:** 2-3 hours | **Priority:** HIGH

#### Deliverables:
- [ ] Tailwind configuration (dark/light modes)
- [ ] Color palette (dark grays + accent colors)
- [ ] Glassmorphism component library
- [ ] Theme toggle button (Light/Dark)
- [ ] Responsive grid system
- [ ] Component directory structure

#### Components to Build:
```
components/
├── ui/
│   ├── Button (with variants)
│   ├── Card (glass effect)
│   ├── Input (text, email, password)
│   ├── Select
│   ├── Modal
│   ├── Sidebar
│   ├── Navbar
│   └── LoadingSpinner (kickass loader)
├── layouts/
│   ├── AuthLayout
│   ├── DashboardLayout
│   └── CourseLayout
└── theme/
    ├── ThemeProvider
    └── useTheme hook
```

**Output:** Reusable component library with perfect light/dark contrast

---

### Phase 3: Authentication & Authorization 🔐
**Duration:** 1.5-2 hours | **Priority:** CRITICAL

#### Deliverables:
- [ ] Supabase Auth setup (Email + Social)
- [ ] Login page (glass design)
- [ ] Sign-up page with role selection
- [ ] Password reset flow
- [ ] JWT token management
- [ ] Role-based access control (RBAC)
- [ ] Protected routes & middleware

#### Roles Implemented:
- **Admin** - Full system control
- **Teacher** - Course creation, student management
- **Student** - Course enrollment, assignments
- **Moderator** - Content moderation

**Output:** Secure auth system with role-based access

---

### Phase 4: Core Data Models & API 🗄️
**Duration:** 2-3 hours | **Priority:** CRITICAL

#### Database Schema:
```sql
-- Users (managed by Supabase Auth)
-- Profile (extends Supabase Auth)
-- Courses (teacher-owned)
-- Lessons (within courses)
-- Assignments (lesson-based)
-- Submissions (student work)
-- Enrollments (student-course relationship)
-- Progress (learning analytics)
-- Files (storage references)
```

#### Backend API Endpoints:
```
COURSES
  POST   /api/courses              (create)
  GET    /api/courses              (list with filters)
  GET    /api/courses/:id          (detail)
  PUT    /api/courses/:id          (update)
  DELETE /api/courses/:id          (delete)

LESSONS
  POST   /api/courses/:id/lessons  (create)
  GET    /api/courses/:id/lessons  (list)
  PUT    /api/lessons/:id          (update)

ASSIGNMENTS
  POST   /api/lessons/:id/assignments
  GET    /api/assignments/:id
  POST   /api/assignments/:id/submit

ENROLLMENTS
  POST   /api/courses/:id/enroll   (student self-enroll)
  GET    /api/enrollments          (list my enrollments)
  GET    /api/courses/:id/students (teacher view)

PROGRESS
  GET    /api/progress/:userId     (personal analytics)
  GET    /api/courses/:id/analytics (teacher dashboard stats)

FILES
  POST   /api/upload               (file upload)
  GET    /api/files/:id            (file detail)
```

**Output:** Fully functional REST API with Bun + Elysia

---

### Phase 5: Frontend Dashboards 📊
**Duration:** 3-4 hours | **Priority:** HIGH

#### Student Dashboard:
- [ ] Course cards (enrolled courses)
- [ ] Progress visualization (completion %, grade)
- [ ] Upcoming assignments widget
- [ ] Learning statistics
- [ ] Quick access to active courses

#### Teacher Dashboard:
- [ ] Course management grid
- [ ] Student enrollment stats
- [ ] Recent submissions queue
- [ ] Course performance analytics
- [ ] Quick create course button

#### Admin Dashboard:
- [ ] System statistics (users, courses, enrollments)
- [ ] User management interface
- [ ] Course moderation queue
- [ ] System health metrics
- [ ] Activity logs

#### Common Features:
- [ ] Search functionality
- [ ] Filter & sort options
- [ ] Responsive grid layouts
- [ ] Glass morphism cards
- [ ] Loading skeletons

**Output:** Three polished dashboards with real data

---

### Phase 6: Course Management System 📚
**Duration:** 2-3 hours | **Priority:** HIGH

#### Features:
- [ ] Course creation wizard (multi-step)
- [ ] Lesson editor with rich text
- [ ] Lesson reordering (drag & drop)
- [ ] Lesson media upload (video, images)
- [ ] Course settings (visibility, enrollment)
- [ ] Course preview for students
- [ ] Batch course import/export

#### Course View (Student):
- [ ] Lesson navigation sidebar
- [ ] Video player integration
- [ ] Lesson notes editor
- [ ] Mark complete functionality
- [ ] Progress bar
- [ ] Discussion section (if time)

**Output:** Complete course CRUD with beautiful UX

---

### Phase 7: Assignments & Submissions 📝
**Duration:** 2-3 hours | **Priority:** MEDIUM

#### Features:
- [ ] Assignment creation (with due dates)
- [ ] Assignment templates
- [ ] File upload for submissions
- [ ] Submission deadline enforcement
- [ ] Teacher grading interface
- [ ] Feedback comments
- [ ] Grade history & revision tracking

#### Student View:
- [ ] Assignment detail page
- [ ] File upload interface
- [ ] Submission preview
- [ ] Grade & feedback display

#### Teacher View:
- [ ] Submissions queue
- [ ] Bulk grading interface
- [ ] Comment templates
- [ ] Grade distribution analytics

**Output:** Full assignment workflow

---

### Phase 8: Real-time Features & Notifications 🔔
**Duration:** 1.5-2 hours | **Priority:** MEDIUM

#### Features:
- [ ] Real-time notifications (Supabase Realtime)
- [ ] Notification center UI
- [ ] Notification preferences
- [ ] Live course activity feed
- [ ] Real-time submission alerts (teacher)
- [ ] Presence indicators (who's online)

**Output:** Engaging real-time features

---

### Phase 9: Analytics & Reporting 📈
**Duration:** 1.5-2 hours | **Priority:** MEDIUM

#### Metrics:
- [ ] Student performance analytics
- [ ] Course completion rates
- [ ] Engagement metrics
- [ ] Assignment statistics
- [ ] Time spent tracking
- [ ] Grade distribution

#### Visualizations:
- [ ] Line charts (progress over time)
- [ ] Pie charts (completion status)
- [ ] Bar charts (performance comparison)
- [ ] Heatmaps (activity patterns)

**Output:** Insightful analytics dashboard

---

### Phase 10: Polish & Optimization ✨
**Duration:** 2-3 hours | **Priority:** HIGH

#### Quality Assurance:
- [ ] Performance optimization (Lighthouse 90+)
- [ ] SEO optimization
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] Error handling & logging

#### UX Polish:
- [ ] Smooth animations & transitions
- [ ] Loading states & skeletons
- [ ] Error boundaries & fallbacks
- [ ] Toast notifications
- [ ] Keyboard shortcuts
- [ ] Accessibility labels

#### Code Quality:
- [ ] ESLint + Prettier configuration
- [ ] Component documentation
- [ ] Type safety audit
- [ ] Code comments (complex logic)
- [ ] Remove console logs & debugging
- [ ] Remove dummy data

**Output:** Production-ready application

---

## 🎨 Design System Details

### Color Palette

#### Light Mode
```css
--primary: #1F2937 (Dark Gray)
--primary-light: #374151
--background: #F9FAFB (Near White)
--surface: #FFFFFF
--surface-secondary: #F3F4F6
--text-primary: #111827
--text-secondary: #6B7280
--accent: #3B82F6 (Blue)
--accent-hover: #2563EB
--success: #10B981
--warning: #F59E0B
--error: #EF4444
```

#### Dark Mode
```css
--primary: #E5E7EB (Light Gray)
--primary-light: #D1D5DB
--background: #111827 (Nearly Black)
--surface: #1F2937
--surface-secondary: #374151
--text-primary: #F9FAFB
--text-secondary: #D1D5DB
--accent: #60A5FA
--accent-hover: #93C5FD
--success: #34D399
--warning: #FBBF24
--error: #F87171
```

### Glassmorphism Guide
```css
/* Glass Effect Recipe */
.glass {
  background: rgba(255, 255, 255, 0.7); /* Light mode */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}

/* Dark Mode Glass */
[data-theme="dark"] .glass {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(107, 114, 128, 0.2);
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun 1.x
- Git
- GitHub account
- Supabase account (free tier works)
- Vercel account
- Railway account

### Local Development

```bash
# Clone repository
git clone https://github.com/Lottie128/lms-final.git
cd lms-final

# Install dependencies using Bun
bun install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your Supabase credentials
# SUPABASE_URL=your_url
# SUPABASE_KEY=your_key
# DATABASE_URL=your_database_url

# Run database migrations
bun run db:migrate

# Start development servers (both frontend & backend)
bun run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

## 📁 Project Structure

```
lms-final/
├── README.md (this file)
├── package.json
├── bun.lockb
├── .env.example
├── .env.local (git-ignored)
│
├── packages/
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   ├── layouts/
│   │   │   │   ├── dashboards/
│   │   │   │   ├── courses/
│   │   │   │   ├── assignments/
│   │   │   │   └── theme/
│   │   │   ├── pages/
│   │   │   │   ├── auth/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── courses/
│   │   │   │   ├── profile/
│   │   │   │   └── admin/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── types/
│   │   │   ├── context/
│   │   │   ├── styles/
│   │   │   │   └── globals.css
│   │   │   └── App.tsx
│   │   ├── tailwind.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── courses.ts
│   │   │   │   ├── lessons.ts
│   │   │   │   ├── assignments.ts
│   │   │   │   ├── enrollments.ts
│   │   │   │   ├── progress.ts
│   │   │   │   └── files.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── services/
│   │   │   │   ├── courseService.ts
│   │   │   │   ├── userService.ts
│   │   │   │   └── fileService.ts
│   │   │   ├── lib/
│   │   │   │   └── prisma.ts
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/
│       ├── types.ts
│       ├── constants.ts
│       ├── utils.ts
│       └── package.json
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
└── .github/
    └── workflows/
        ├── frontend-deploy.yml
        └── backend-deploy.yml
```

---

## 🔧 Development Workflow

### Phase-by-Phase Development

Each phase has clear deliverables. Before moving to the next:

1. ✅ All features implemented
2. ✅ Code follows modular patterns
3. ✅ No console errors
4. ✅ Tested in both themes
5. ✅ Committed to Git

### Useful Commands

```bash
# Database
bun run db:migrate       # Run Prisma migrations
bun run db:generate    # Generate Prisma client
bun run db:seed        # Seed test data
bun run db:studio      # Open Prisma Studio

# Development
bun run dev            # Start both frontend & backend
bun run dev:frontend   # Frontend only
bun run dev:backend    # Backend only

# Code Quality
bun run lint           # ESLint check
bun run format         # Prettier format
bun run type-check     # TypeScript check

# Build & Deploy
bun run build          # Build for production
bun run build:frontend # Frontend build
bun run build:backend  # Backend build
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Automatic deployment on git push to main
# Configure in Vercel:
# - Build Command: bun run build:frontend
# - Install Command: bun install
# - Output Directory: packages/frontend/dist
```

### Backend (Railway)

```bash
# Automatic deployment on git push to main
# Configure in Railway:
# - Build Command: bun install && bun run build:backend
# - Start Command: bun run start:backend
# - Environment Variables: .env.production
```

### Database Migrations

```bash
# Before deploying, run migrations in production
bun run db:migrate --prod
```

---

## 📊 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Score | 90+ | Google Lighthouse |
| Core Web Vitals | All Green | Web.dev |
| Time to Interactive | < 3s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Build Time | < 30s | Vercel/Railway |
| API Response Time | < 200ms | Custom monitoring |
| Database Query Time | < 100ms | Prisma logging |

---

## 🧪 Testing Strategy

### Unit Tests
```bash
bun run test:unit
```

### Integration Tests
```bash
bun run test:integration
```

### E2E Tests
```bash
bun run test:e2e
```

### Coverage Target
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

---

## 📚 API Documentation

Full API docs will be available at: `/api/docs` (Swagger/OpenAPI)

### Example Endpoints

```bash
# Create Course
curl -X POST http://localhost:3001/api/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web Development 101",
    "description": "Learn web development",
    "category": "programming"
  }'

# Get Courses
curl http://localhost:3001/api/courses

# Enroll in Course
curl -X POST http://localhost:3001/api/courses/123/enroll \
  -H "Authorization: Bearer <token>"
```

---

## 🐛 Debugging & Logging

### Environment Variables for Debugging

```bash
DEBUG=* bun run dev           # Verbose logging
LOG_LEVEL=debug bun run dev   # Custom log level
DATABASE_LOG=true bun run dev # Prisma query logs
```

### Browser DevTools

- Use React DevTools for component inspection
- Use Network tab to monitor API calls
- Use Application tab for localStorage/theme storage
- Use Console for errors and warnings

---

## 📝 Modular Architecture Principles

### Component Modularity
- **Single Responsibility**: Each component does one thing
- **Props-based Configuration**: Flexible through props
- **Composition over Inheritance**: Build complex UIs from simple components
- **Isolation**: Components work independently

### Service Modularity
- **Separation of Concerns**: API layer, business logic, data access
- **Reusability**: Services shared across components
- **Testability**: Services can be tested independently
- **Scalability**: Easy to add new services

### Example Modular Pattern

```typescript
// ❌ Monolithic
function CourseCard({ courseId }) {
  // fetches data
  // renders UI
  // handles enrollment
  // ALL IN ONE FILE
}

// ✅ Modular
// courseService.ts - handles data fetching
export const courseService = {
  getCourse: (id) => api.get(`/courses/${id}`),
  enrollCourse: (id) => api.post(`/courses/${id}/enroll`)
};

// useCourse.ts - React hook for reuse
export const useCourse = (id) => {
  const [course, setCourse] = useState(null);
  useEffect(() => {
    courseService.getCourse(id).then(setCourse);
  }, [id]);
  return { course };
};

// CourseCard.tsx - focused on presentation
export function CourseCard({ courseId }) {
  const { course } = useCourse(courseId);
  return <div>{course?.title}</div>;
}
```

---

## 🎯 Next Steps

1. **Review this README** - Understand full scope
2. **Start Phase 1** - Foundation & infrastructure
3. **Track progress** - Check off deliverables as you go
4. **Commit frequently** - After each sub-phase
5. **Test continuously** - Both light and dark modes
6. **Deploy early** - Get feedback from day one

---

## 📞 Support & Questions

For questions or issues:
1. Check existing GitHub issues
2. Review code comments
3. Consult Supabase docs: https://supabase.com/docs
4. Review Bun docs: https://bun.sh/docs
5. Check Elysia docs: https://elysiajs.com

---

## 📄 License

MIT License - Use freely for personal and commercial projects

---

**Built with ❤️ for IQ Didactic | 2026**

*Last Updated: January 8, 2026*
