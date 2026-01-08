import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

export const lessonRoutes = new Elysia({ prefix: '/lessons' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, user, set }) => {
      const { courseId, ...lessonData } = body;

      const course = await prisma.course.findUnique({ where: { id: courseId } });

      if (!course) {
        set.status = 404;
        return { success: false, error: 'Course not found' };
      }

      if (course.teacherId !== user.id && user.role !== 'ADMIN') {
        set.status = 403;
        return { success: false, error: 'Unauthorized' };
      }

      // Get the next order number
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
      });

      const lesson = await prisma.lesson.create({
        data: {
          ...lessonData,
          courseId,
          order: lessonData.order ?? (lastLesson ? lastLesson.order + 1 : 0),
        },
      });

      return { success: true, data: lesson };
    },
    {
      body: t.Object({
        courseId: t.String(),
        title: t.String({ minLength: 3 }),
        description: t.Optional(t.String()),
        content: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        duration: t.Optional(t.Number()),
        isPublished: t.Optional(t.Boolean()),
      }),
      tags: ['lessons'],
    }
  )
  .get(
    '/:id',
    async ({ params: { id }, user, set }) => {
      const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              teacher: { select: { id: true, name: true } },
            },
          },
          assignments: {
            include: {
              submissions: {
                where: user.role === 'STUDENT' ? { studentId: user.id } : undefined,
                select: {
                  id: true,
                  grade: true,
                  submittedAt: true,
                  gradedAt: true,
                },
              },
              _count: {
                select: { submissions: true },
              },
            },
          },
        },
      });

      if (!lesson) {
        set.status = 404;
        return { success: false, error: 'Lesson not found' };
      }

      return { success: true, data: lesson };
    },
    {
      params: t.Object({ id: t.String() }),
      tags: ['lessons'],
    }
  )
  .put(
    '/:id',
    async ({ params: { id }, body, user, set }) => {
      const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: { course: true },
      });

      if (!lesson) {
        set.status = 404;
        return { success: false, error: 'Lesson not found' };
      }

      if (lesson.course.teacherId !== user.id && user.role !== 'ADMIN') {
        set.status = 403;
        return { success: false, error: 'Unauthorized' };
      }

      const updated = await prisma.lesson.update({
        where: { id },
        data: body,
      });

      return { success: true, data: updated };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3 })),
        description: t.Optional(t.String()),
        content: t.Optional(t.String()),
        videoUrl: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        duration: t.Optional(t.Number()),
        isPublished: t.Optional(t.Boolean()),
      }),
      tags: ['lessons'],
    }
  )
  .delete(
    '/:id',
    async ({ params: { id }, user, set }) => {
      const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: { course: true },
      });

      if (!lesson) {
        set.status = 404;
        return { success: false, error: 'Lesson not found' };
      }

      if (lesson.course.teacherId !== user.id && user.role !== 'ADMIN') {
        set.status = 403;
        return { success: false, error: 'Unauthorized' };
      }

      await prisma.lesson.delete({ where: { id } });
      return { success: true, message: 'Lesson deleted successfully' };
    },
    {
      params: t.Object({ id: t.String() }),
      tags: ['lessons'],
    }
  );
