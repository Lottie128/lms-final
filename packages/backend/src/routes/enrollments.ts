import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

export const enrollmentRoutes = new Elysia({ prefix: '/enrollments' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, user, set }) => {
      if (user.role !== 'STUDENT') {
        set.status = 403;
        return { success: false, error: 'Only students can enroll in courses' };
      }

      const { courseId } = body;

      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        set.status = 404;
        return { success: false, error: 'Course not found' };
      }

      if (!course.isPublished) {
        set.status = 400;
        return { success: false, error: 'Course is not published' };
      }

      // Check if already enrolled
      const existing = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId,
          },
        },
      });

      if (existing) {
        return { success: true, data: existing, message: 'Already enrolled' };
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: user.id,
          courseId,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
            },
          },
        },
      });

      return { success: true, data: enrollment };
    },
    {
      body: t.Object({
        courseId: t.String(),
      }),
      tags: ['enrollments'],
    }
  )
  .get(
    '/',
    async ({ user, query }) => {
      const { page = 1, perPage = 20 } = query;

      const [enrollments, total] = await Promise.all([
        prisma.enrollment.findMany({
          where: { studentId: user.id },
          skip: (Number(page) - 1) * Number(perPage),
          take: Number(perPage),
          include: {
            course: {
              include: {
                teacher: { select: { id: true, name: true, avatar: true } },
                _count: { select: { lessons: true } },
              },
            },
          },
          orderBy: { enrolledAt: 'desc' },
        }),
        prisma.enrollment.count({ where: { studentId: user.id } }),
      ]);

      return {
        success: true,
        data: {
          enrollments,
          pagination: {
            page: Number(page),
            perPage: Number(perPage),
            total,
            totalPages: Math.ceil(total / Number(perPage)),
          },
        },
      };
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        perPage: t.Optional(t.Numeric()),
      }),
      tags: ['enrollments'],
    }
  )
  // Get student's enrolled courses
  .get(
    '/my-courses',
    async ({ user }) => {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: user.id },
        include: {
          course: {
            include: {
              teacher: { select: { id: true, name: true, avatar: true } },
              _count: { select: { lessons: true } },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      });

      return {
        success: true,
        data: enrollments.map((e) => e.course),
      };
    },
    {
      tags: ['enrollments'],
    }
  )
  .get(
    '/course/:courseId',
    async ({ params: { courseId }, user, set }) => {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId,
          },
        },
        include: {
          course: {
            include: {
              lessons: {
                where: { isPublished: true },
                orderBy: { order: 'asc' },
              },
              teacher: { select: { id: true, name: true, avatar: true } },
            },
          },
        },
      });

      if (!enrollment) {
        set.status = 404;
        return { success: false, error: 'Enrollment not found' };
      }

      return { success: true, data: enrollment };
    },
    {
      params: t.Object({ courseId: t.String() }),
      tags: ['enrollments'],
    }
  );
