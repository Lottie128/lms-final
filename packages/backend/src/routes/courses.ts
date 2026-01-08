import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';

export const courseRoutes = new Elysia({ prefix: '/courses' })
  .get(
    '/',
    async ({ query }) => {
      const { page = 1, perPage = 20, category, search, teacherId } = query;

      const where: any = { isPublished: true };
      if (category) where.category = category;
      if (teacherId) where.teacherId = teacherId;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          skip: (Number(page) - 1) * Number(perPage),
          take: Number(perPage),
          include: {
            teacher: { select: { id: true, name: true, avatar: true } },
            _count: { select: { enrollments: true, lessons: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.course.count({ where }),
      ]);

      return {
        success: true,
        data: {
          courses,
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
        category: t.Optional(t.String()),
        search: t.Optional(t.String()),
        teacherId: t.Optional(t.String()),
      }),
      tags: ['courses'],
    }
  )
  .use(authMiddleware)
  // Get teacher's own courses
  .get(
    '/my-courses',
    async ({ user }) => {
      const courses = await prisma.course.findMany({
        where: { teacherId: user.id },
        include: {
          _count: { select: { enrollments: true, lessons: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return { success: true, data: courses };
    },
    {
      tags: ['courses'],
    }
  )
  .get(
    '/:id',
    async ({ params: { id }, set }) => {
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          teacher: { select: { id: true, name: true, avatar: true, email: true } },
          lessons: {
            where: { isPublished: true },
            orderBy: { order: 'asc' },
          },
          _count: { select: { enrollments: true } },
        },
      });

      if (!course) {
        set.status = 404;
        return { success: false, error: 'Course not found' };
      }

      return { success: true, data: course };
    },
    {
      params: t.Object({ id: t.String() }),
      tags: ['courses'],
    }
  )
  .get(
    '/:id/lessons',
    async ({ params: { id }, user, set }) => {
      // Check if course exists and user has access
      const course = await prisma.course.findUnique({
        where: { id },
        select: { teacherId: true },
      });

      if (!course) {
        set.status = 404;
        return { success: false, error: 'Course not found' };
      }

      // Teachers see all lessons, students only see published
      const where: any = { courseId: id };
      if (user.role === 'STUDENT') {
        where.isPublished = true;
      }

      const lessons = await prisma.lesson.findMany({
        where,
        orderBy: { order: 'asc' },
      });

      return { success: true, data: lessons };
    },
    {
      params: t.Object({ id: t.String() }),
      tags: ['courses'],
    }
  )
  .post(
    '/',
    async ({ body, user, set }) => {
      if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
        set.status = 403;
        return { success: false, error: 'Only teachers can create courses' };
      }

      const course = await prisma.course.create({
        data: {
          ...body,
          teacherId: user.id,
        },
        include: {
          teacher: { select: { id: true, name: true, avatar: true } },
        },
      });

      return { success: true, data: course };
    },
    {
      body: t.Object({
        title: t.String({ minLength: 3 }),
        description: t.String({ minLength: 10 }),
        category: t.String(),
        thumbnail: t.Optional(t.String()),
        isPublished: t.Optional(t.Boolean()),
      }),
      tags: ['courses'],
    }
  )
  .put(
    '/:id',
    async ({ params: { id }, body, user, set }) => {
      const course = await prisma.course.findUnique({ where: { id } });

      if (!course) {
        set.status = 404;
        return { success: false, error: 'Course not found' };
      }

      if (course.teacherId !== user.id && user.role !== 'ADMIN') {
        set.status = 403;
        return { success: false, error: 'Unauthorized' };
      }

      const updated = await prisma.course.update({
        where: { id },
        data: body,
        include: {
          teacher: { select: { id: true, name: true, avatar: true } },
        },
      });

      return { success: true, data: updated };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3 })),
        description: t.Optional(t.String({ minLength: 10 })),
        category: t.Optional(t.String()),
        thumbnail: t.Optional(t.String()),
        isPublished: t.Optional(t.Boolean()),
        maxStudents: t.Optional(t.Number()),
        enrollmentType: t.Optional(t.String()),
      }),
      tags: ['courses'],
    }
  )
  .delete(
    '/:id',
    async ({ params: { id }, user, set }) => {
      const course = await prisma.course.findUnique({ where: { id } });

      if (!course) {
        set.status = 404;
        return { success: false, error: 'Course not found' };
      }

      if (course.teacherId !== user.id && user.role !== 'ADMIN') {
        set.status = 403;
        return { success: false, error: 'Unauthorized' };
      }

      await prisma.course.delete({ where: { id } });
      return { success: true, message: 'Course deleted successfully' };
    },
    {
      params: t.Object({ id: t.String() }),
      tags: ['courses'],
    }
  );
