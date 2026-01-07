import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { authRoutes } from './routes/auth';
import { courseRoutes } from './routes/courses';
import { lessonRoutes } from './routes/lessons';
import { assignmentRoutes } from './routes/assignments';
import { enrollmentRoutes } from './routes/enrollments';
import { progressRoutes } from './routes/progress';
import { errorHandler } from './middleware/errorHandler';

const PORT = process.env.PORT || 3001;

const app = new Elysia()
  .use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
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
        ],
      },
    })
  )
  .get('/', () => ({
    message: 'IQ Didactic LMS API',
    version: '1.0.0',
    status: 'healthy',
  }))
  .group('/api', app =>
    app
      .use(authRoutes)
      .use(courseRoutes)
      .use(lessonRoutes)
      .use(assignmentRoutes)
      .use(enrollmentRoutes)
      .use(progressRoutes)
  )
  .onError(errorHandler)
  .listen(PORT);

console.log(`🚀 IQ Didactic API running at http://localhost:${PORT}`);
console.log(`📚 API Docs available at http://localhost:${PORT}/swagger`);

export type App = typeof app;
