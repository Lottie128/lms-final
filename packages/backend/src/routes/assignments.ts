import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

export const assignmentRoutes = new Elysia({ prefix: '/assignments' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, user, set }) => {
      const { lessonId, ...assignmentData } = body;

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
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

      const assignment = await prisma.assignment.create({
        data: {
          ...assignmentData,
          lessonId,
          dueDate: assignmentData.dueDate ? new Date(assignmentData.dueDate) : undefined,
        },
      });

      return { success: true, data: assignment };
    },
    {
      body: t.Object({
        lessonId: t.String(),
        title: t.String({ minLength: 3 }),
        description: t.String({ minLength: 10 }),
        dueDate: t.Optional(t.String()),
        maxPoints: t.Number({ minimum: 1, default: 100 }),
      }),
      tags: ['assignments'],
    }
  )
  .get(
    '/:id',
    async ({ params: { id }, user, set }) => {
      const assignment = await prisma.assignment.findUnique({
        where: { id },
        include: {
          lesson: {
            include: {
              course: {
                select: { id: true, title: true, teacherId: true },
              },
            },
          },
          submissions: {
            where: user.role === 'STUDENT' ? { studentId: user.id } : undefined,
            include: {
              student: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });

      if (!assignment) {
        set.status = 404;
        return { success: false, error: 'Assignment not found' };
      }

      return { success: true, data: assignment };
    },
    {
      params: t.Object({ id: t.String() }),
      tags: ['assignments'],
    }
  )
  .post(
    '/:id/submit',
    async ({ params: { id }, body, user, set }) => {
      if (user.role !== 'STUDENT') {
        set.status = 403;
        return { success: false, error: 'Only students can submit assignments' };
      }

      const assignment = await prisma.assignment.findUnique({ where: { id } });

      if (!assignment) {
        set.status = 404;
        return { success: false, error: 'Assignment not found' };
      }

      // Check if already submitted
      const existing = await prisma.submission.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId: id,
            studentId: user.id,
          },
        },
      });

      if (existing) {
        // Update existing submission
        const updated = await prisma.submission.update({
          where: { id: existing.id },
          data: {
            content: body.content,
            fileUrls: body.fileUrls || [],
            submittedAt: new Date(),
          },
        });
        return { success: true, data: updated };
      }

      // Create new submission
      const submission = await prisma.submission.create({
        data: {
          assignmentId: id,
          studentId: user.id,
          content: body.content,
          fileUrls: body.fileUrls || [],
        },
      });

      return { success: true, data: submission };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        content: t.String({ minLength: 10 }),
        fileUrls: t.Optional(t.Array(t.String())),
      }),
      tags: ['assignments'],
    }
  )
  .post(
    '/submissions/:id/grade',
    async ({ params: { id }, body, user, set }) => {
      const submission = await prisma.submission.findUnique({
        where: { id },
        include: {
          assignment: {
            include: {
              lesson: { include: { course: true } },
            },
          },
        },
      });

      if (!submission) {
        set.status = 404;
        return { success: false, error: 'Submission not found' };
      }

      const teacherId = submission.assignment.lesson.course.teacherId;
      if (teacherId !== user.id && user.role !== 'ADMIN') {
        set.status = 403;
        return { success: false, error: 'Unauthorized' };
      }

      const graded = await prisma.submission.update({
        where: { id },
        data: {
          grade: body.grade,
          feedback: body.feedback,
          gradedAt: new Date(),
        },
      });

      return { success: true, data: graded };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        grade: t.Number({ minimum: 0 }),
        feedback: t.Optional(t.String()),
      }),
      tags: ['assignments'],
    }
  );
