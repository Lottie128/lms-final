import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('\n🚀 Starting IQ Didactic API...');
console.log(`  PORT: ${PORT}`);
console.log(`  FRONTEND_URL: ${FRONTEND_URL}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV}\n`);

const app = new Elysia()
  .use(
    cors({
      origin: true, // Allow all origins for now
      credentials: true,
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
  .listen({
    port: PORT,
    hostname: '0.0.0.0',
  });

console.log('✅ API Server started successfully!');
console.log(`🔗 http://0.0.0.0:${PORT}\n`);

// Now load routes after server starts
try {
  console.log('Loading route modules...');
  
  const { authRoutes } = await import('./routes/auth.js');
  const { courseRoutes } = await import('./routes/courses.js');
  const { lessonRoutes } = await import('./routes/lessons.js');
  const { assignmentRoutes } = await import('./routes/assignments.js');
  const { enrollmentRoutes } = await import('./routes/enrollments.js');
  const { progressRoutes } = await import('./routes/progress.js');
  const { teacherRoutes } = await import('./routes/teachers.js');
  const { errorHandler } = await import('./middleware/errorHandler.js');
  
  // Register routes
  app
    .use(
      swagger({
        documentation: {
          info: {
            title: 'IQ Didactic LMS API',
            version: '1.0.0',
            description: 'Enterprise Learning Management System API',
          },
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
    .onError(errorHandler);
  
  console.log('✅ All routes registered successfully!');
} catch (error) {
  console.error('❌ Failed to load routes:', error);
  console.error('Stack:', error.stack);
}

export type App = typeof app;
