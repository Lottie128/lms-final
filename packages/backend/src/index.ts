import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from './routes/auth';
import { courseRoutes } from './routes/courses';
import { lessonRoutes } from './routes/lessons';
import { assignmentRoutes } from './routes/assignments';
import { enrollmentRoutes } from './routes/enrollments';
import { progressRoutes } from './routes/progress';
import { teacherRoutes } from './routes/teachers';
import { errorHandler } from './middleware/errorHandler';

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://lms-final.vercel.app';

// Ensure FRONTEND_URL has protocol
const normalizedFrontendUrl = FRONTEND_URL.startsWith('http')
  ? FRONTEND_URL
  : `https://${FRONTEND_URL}`;

console.log('\n🚀 IQ Didactic API Starting...');
console.log(`  PORT: ${PORT}`);
console.log(`  FRONTEND: ${normalizedFrontendUrl}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV}\n`);

const app = new Elysia()
  // Health check FIRST - before any other middleware
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'lms-backend',
    version: '1.0.0',
  }))
  // Root endpoint for Railway health checks
  .get('/', () => ({
    message: 'IQ Didactic LMS API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    docs: '/swagger',
  }))
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get('origin');
        
        // Allow requests with no origin (like health checks)
        if (!origin) return true;
        
        // List of allowed origins
        const allowedOrigins = [
          normalizedFrontendUrl,
          'http://localhost:5173',
          'http://localhost:3000',
          'https://lms-final.vercel.app',
          'https://lms-final-frontend-rho.vercel.app',
        ];
        
        // Check if origin is allowed
        if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
          return true;
        }
        
        // Allow any vercel.app subdomain
        if (origin.includes('.vercel.app')) {
          return true;
        }
        
        console.log(`CORS blocked origin: ${origin}`);
        return false;
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'IQ Didactic LMS API',
          version: '1.0.0',
          description: 'Enterprise Learning Management System API',
        },
        tags: [
          { name: 'auth', description: 'Authentication endpoints' },
          { name: 'courses', description: 'Course management' },
          { name: 'lessons', description: 'Lesson management' },
          { name: 'assignments', description: 'Assignment management' },
          { name: 'enrollments', description: 'Student enrollments' },
          { name: 'progress', description: 'Learning progress tracking' },
          { name: 'teachers', description: 'Teacher statistics' },
        ],
      },
    })
  )
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(courseRoutes)
      .use(lessonRoutes)
      .use(assignmentRoutes)
      .use(enrollmentRoutes)
      .use(progressRoutes)
      .use(teacherRoutes)
  )
  // Catch-all for unmatched routes
  .all('*', ({ request, set }) => {
    const url = new URL(request.url);
    console.log(`404 Not Found: ${request.method} ${url.pathname}`);
    set.status = 404;
    return {
      success: false,
      error: 'Not Found',
      message: `Route ${request.method} ${url.pathname} not found`,
      availableEndpoints: [
        'GET /',
        'GET /health',
        'GET /swagger',
        'POST /api/auth/signup',
        'POST /api/auth/login',
        'GET /api/courses',
        'GET /api/courses/my-courses',
        'GET /api/teachers/stats',
        'GET /api/enrollments/my-courses',
      ],
    };
  })
  .onError(errorHandler)
  .listen({ port: Number(PORT), hostname: '0.0.0.0' });

console.log('\n✅ Server running on port', PORT);
console.log('🔗 http://0.0.0.0:' + PORT);
console.log('📚 Docs: http://0.0.0.0:' + PORT + '/swagger');
console.log('\n📍 Registered API routes:');
console.log('  ✓ GET /');
console.log('  ✓ GET /health');
console.log('  ✓ POST /api/auth/signup');
console.log('  ✓ POST /api/auth/login');
console.log('  ✓ GET  /api/courses');
console.log('  ✓ POST /api/courses');
console.log('  ✓ GET  /api/courses/my-courses');
console.log('  ✓ GET  /api/teachers/stats');
console.log('  ✓ GET  /api/enrollments/my-courses');
console.log('  ✓ POST /api/lessons');
console.log('  ✓ And more...\n');

export type App = typeof app;
