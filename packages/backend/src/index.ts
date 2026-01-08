import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const PORT = process.env.PORT || 3001;

console.log('\n🚀 IQ Didactic API Starting...');
console.log(`  PORT: ${PORT}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV}\n`);

const app = new Elysia()
  .use(cors({ origin: true, credentials: true }))
  .get('/', () => ({
    message: 'IQ Didactic LMS API',
    version: '1.0.0',
    status: 'healthy',
  }))
  .get('/health', () => ({ status: 'ok', service: 'lms-backend' }))
  .get('/test', () => ({ message: 'Test route working!' }))
  .listen({ port: PORT, hostname: '0.0.0.0' });

console.log(`\n✅ Server running on port ${PORT}`);
console.log(`🔗 http://0.0.0.0:${PORT}\n`);

export type App = typeof app;
