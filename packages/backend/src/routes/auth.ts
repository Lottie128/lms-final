import { Elysia, t } from 'elysia';
import { supabase } from '../lib/supabase';
import { prisma } from '../lib/prisma';
import type { UserRole } from 'shared/types';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/signup',
    async ({ body, set }) => {
      const { email, password, name, role } = body;

      try {
        // Create Supabase auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role },
          },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('User creation failed');

        // Create user in database
        const user = await prisma.user.create({
          data: {
            id: authData.user.id,
            email,
            name,
            role: role as UserRole,
          },
        });

        return {
          success: true,
          data: {
            user,
            session: authData.session,
          },
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
        name: t.String({ minLength: 2 }),
        role: t.Enum({ STUDENT: 'STUDENT', TEACHER: 'TEACHER', ADMIN: 'ADMIN' }),
      }),
      tags: ['auth'],
    }
  )
  .post(
    '/login',
    async ({ body, set }) => {
      const { email, password } = body;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Login failed');

        const user = await prisma.user.findUnique({
          where: { id: data.user.id },
        });

        return {
          success: true,
          data: {
            user,
            session: data.session,
          },
        };
      } catch (error: any) {
        set.status = 401;
        return {
          success: false,
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
      tags: ['auth'],
    }
  )
  .post(
    '/logout',
    async ({ headers, set }) => {
      const token = headers.authorization?.substring(7);

      if (!token) {
        set.status = 401;
        return { success: false, error: 'No token provided' };
      }

      try {
        await supabase.auth.signOut();
        return { success: true, message: 'Logged out successfully' };
      } catch (error: any) {
        set.status = 500;
        return { success: false, error: error.message };
      }
    },
    { tags: ['auth'] }
  );
