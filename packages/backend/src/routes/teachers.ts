import { Elysia } from 'elysia';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

export const teacherRoutes = new Elysia({ prefix: '/teachers' })
  .use(authMiddleware)
  .get(
    '/stats',
    async ({ user, set }) => {
      if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
        set.status = 403;
        return { success: false, error: 'Only teachers can access stats' };
      }

      // Get teacher's courses
      const courses = await prisma.course.findMany({
        where: { teacherId: user.id },
        include: {
          _count: {
            select: {
              enrollments: true,
              lessons: true,
            },
          },
        },
      });

      // Calculate stats
      const totalCourses = courses.length;
      const publishedCourses = courses.filter((c) => c.isPublished).length;
      const totalEnrollments = courses.reduce((sum, c) => sum + c._count.enrollments, 0);
      const totalLessons = courses.reduce((sum, c) => sum + c._count.lessons, 0);

      // Get recent enrollments
      const recentEnrollments = await prisma.enrollment.findMany({
        where: {
          course: {
            teacherId: user.id,
          },
        },
        take: 5,
        orderBy: { enrolledAt: 'desc' },
        include: {
          student: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          course: {
            select: { id: true, title: true },
          },
        },
      });

      return {
        success: true,
        data: {
          totalCourses,
          publishedCourses,
          totalEnrollments,
          totalLessons,
          recentEnrollments,
        },
      };
    },
    {
      tags: ['teachers'],
    }
  );
