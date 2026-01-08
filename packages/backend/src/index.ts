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
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = new Elysia()
  .use(
    cors({
      origin: [FRONTEND_URL, 'http://localhost:5173', 'https://lms-final.vercel.app'],
      credentials: true,
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
          { name: 'teachers', description: 'Teacher statistics and management' },
        ],
      },
    })
  )
  .get('/', () => ({
    message: 'IQ Didactic LMS API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'lms-backend',
    version: '1.0.0',
  }))
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
  .onError(errorHandler)
  .listen({
    port: PORT,
    hostname: '0.0.0.0', // Important for Railway
  });

console.log(`\n🚀 IQ Didactic API running on port ${PORT}`);
console.log(`📚 API Docs: http://localhost:${PORT}/swagger`);
console.log(`🔗 Base URL: http://localhost:${PORT}/api`);
console.log(`✅ CORS enabled for: ${FRONTEND_URL}\n`);

// Log registered routes
console.log('📍 Registered routes:');
console.log('  ✓ GET  /');
console.log('  ✓ GET  /health');
console.log('  ✓ POST /api/auth/*');
console.log('  ✓ *    /api/courses/*');
console.log('  ✓ *    /api/lessons/*');
console.log('  ✓ *    /api/enrollments/*');
console.log('  ✓ *    /api/teachers/*');
console.log('  ✓ *    /api/progress/*');
console.log('  ✓ *    /api/assignments/*\n');

export type App = typeof app;
