import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

export const progressRoutes = new Elysia({ prefix: '/progress' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, user, set }) => {
      if (user.role !== 'STUDENT') {
        set.status = 403;
        return { success: false, error: 'Only students can track progress' };
      }

      const { lessonId, completed, timeSpent } = body;

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true },
      });

      if (!lesson) {
        set.status = 404;
        return { success: false, error: 'Lesson not found' };
      }

      // Check enrollment
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: lesson.courseId,
          },
        },
      });

      if (!enrollment) {
        set.status = 403;
        return { success: false, error: 'Not enrolled in this course' };
      }

      const progress = await prisma.progress.upsert({
        where: {
          studentId_lessonId: {
            studentId: user.id,
            lessonId,
          },
        },
        create: {
          studentId: user.id,
          lessonId,
          completed,
          timeSpent,
        },
        update: {
          completed,
          timeSpent: { increment: timeSpent },
          lastAccessedAt: new Date(),
        },
      });

      // Update enrollment progress
      if (completed) {
        const totalLessons = await prisma.lesson.count({
          where: { courseId: lesson.courseId, isPublished: true },
        });

        const completedLessons = await prisma.progress.count({
          where: {
            studentId: user.id,
            completed: true,
            lesson: { courseId: lesson.courseId },
          },
        });

        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: {
            progress: progressPercentage,
            completedAt: progressPercentage === 100 ? new Date() : null,
          },
        });
      }

      return { success: true, data: progress };
    },
    {
      body: t.Object({
        lessonId: t.String(),
        completed: t.Boolean(),
        timeSpent: t.Number({ minimum: 0 }),
      }),
      tags: ['progress'],
    }
  )
  .get(
    '/course/:courseId',
    async ({ params: { courseId }, user }) => {
      const progressData = await prisma.progress.findMany({
        where: {
          studentId: user.id,
          lesson: { courseId },
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              order: true,
              duration: true,
            },
          },
        },
        orderBy: { lesson: { order: 'asc' } },
      });

      return { success: true, data: progressData };
    },
    {
      params: t.Object({ courseId: t.String() }),
      tags: ['progress'],
    }
  )
  .get(
    '/stats',
    async ({ user }) => {
      const [enrollments, completedCourses, totalTimeSpent, progressData] = await Promise.all([
        prisma.enrollment.count({ where: { studentId: user.id } }),
        prisma.enrollment.count({
          where: { studentId: user.id, progress: 100 },
        }),
        prisma.progress.aggregate({
          where: { studentId: user.id },
          _sum: { timeSpent: true },
        }),
        prisma.progress.findMany({
          where: { studentId: user.id },
          select: { completed: true },
        }),
      ]);

      const completedLessons = progressData.filter(p => p.completed).length;
      const totalLessons = progressData.length;

      return {
        success: true,
        data: {
          enrolledCourses: enrollments,
          completedCourses,
          completedLessons,
          totalLessons,
          totalTimeSpent: totalTimeSpent._sum.timeSpent || 0,
          averageProgress: enrollments > 0 ? Math.round((completedCourses / enrollments) * 100) : 0,
        },
      };
    },
    { tags: ['progress'] }
  );
