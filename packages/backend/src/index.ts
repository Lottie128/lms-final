import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('\n🔧 Starting IQ Didactic API...');
console.log('📦 Loading environment variables...');
console.log(`  ✓ PORT: ${PORT}`);
console.log(`  ✓ FRONTEND_URL: ${FRONTEND_URL}`);
console.log(`  ✓ NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Import dependencies with error handling
let authRoutes, courseRoutes, lessonRoutes, assignmentRoutes, enrollmentRoutes, progressRoutes, teacherRoutes;
let errorHandler;

try {
  console.log('\n📚 Loading route modules...');
  
  ({ authRoutes } = await import('./routes/auth'));
  console.log('  ✓ Auth routes loaded');
  
  ({ courseRoutes } = await import('./routes/courses'));
  console.log('  ✓ Course routes loaded');
  
  ({ lessonRoutes } = await import('./routes/lessons'));
  console.log('  ✓ Lesson routes loaded');
  
  ({ assignmentRoutes } = await import('./routes/assignments'));
  console.log('  ✓ Assignment routes loaded');
  
  ({ enrollmentRoutes } = await import('./routes/enrollments'));
  console.log('  ✓ Enrollment routes loaded');
  
  ({ progressRoutes } = await import('./routes/progress'));
  console.log('  ✓ Progress routes loaded');
  
  ({ teacherRoutes } = await import('./routes/teachers'));
  console.log('  ✓ Teacher routes loaded');
  
  ({ errorHandler } = await import('./middleware/errorHandler'));
  console.log('  ✓ Error handler loaded');
  
  console.log('\n✅ All modules loaded successfully!');
} catch (error) {
  console.error('\n❌ Failed to load route modules:', error);
  process.exit(1);
}

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
