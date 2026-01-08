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

console.log('\n🚀 IQ Didactic API Starting...');
console.log(`  PORT: ${PORT}`);
console.log(`  FRONTEND: ${FRONTEND_URL}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV}\n`);

const app = new Elysia()
  .use(
    cors({
      origin: true, // Allow all origins for now to debug
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
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
  .listen({ port: PORT, hostname: '0.0.0.0' });

console.log('\n✅ Server running on port', PORT);
console.log('🔗 http://0.0.0.0:' + PORT);
console.log('📚 Docs: http://0.0.0.0:' + PORT + '/swagger');
console.log('\n📍 Registered API routes:');
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
