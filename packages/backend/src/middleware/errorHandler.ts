import type { ErrorHandler } from 'elysia';

export const errorHandler: ErrorHandler = ({ code, error, set }) => {
  console.error('Error:', error);

  switch (code) {
    case 'VALIDATION':
      set.status = 400;
      return {
        success: false,
        error: 'Validation Error',
        message: error.message,
      };

    case 'NOT_FOUND':
      set.status = 404;
      return {
        success: false,
        error: 'Not Found',
        message: 'The requested resource was not found',
      };

    case 'PARSE':
      set.status = 400;
      return {
        success: false,
        error: 'Parse Error',
        message: 'Invalid request format',
      };

    case 'INTERNAL_SERVER_ERROR':
      set.status = 500;
      return {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      };

    case 'UNKNOWN':
      set.status = 500;
      return {
        success: false,
        error: 'Unknown Error',
        message: error.message || 'An unexpected error occurred',
      };

    default:
      set.status = 500;
      return {
        success: false,
        error: 'Server Error',
        message: error.message || 'Something went wrong',
      };
  }
};
