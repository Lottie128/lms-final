import { Elysia } from 'elysia';
import { supabase } from '../lib/supabase';
import type { UserRole } from 'shared/types';

export const authMiddleware = new Elysia()
  .derive(async ({ headers, set }) => {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Unauthorized: No token provided');
    }

    const token = authHeader.substring(7);

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        set.status = 401;
        throw new Error('Unauthorized: Invalid token');
      }

      return {
        user: {
          id: user.id,
          email: user.email!,
          role: (user.user_metadata?.role as UserRole) || 'STUDENT',
        },
      };
    } catch (error) {
      set.status = 401;
      throw new Error('Unauthorized: Token validation failed');
    }
  })
  .as('plugin');

export const requireRole = (roles: UserRole[]) =>
  new Elysia().derive(({ user, set }) => {
    if (!user) {
      set.status = 401;
      throw new Error('Unauthorized');
    }

    if (!roles.includes(user.role)) {
      set.status = 403;
      throw new Error('Forbidden: Insufficient permissions');
    }

    return { user };
  });
