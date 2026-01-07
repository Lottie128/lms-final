# IQ Didactic LMS - Deployment Guide

Complete guide to deploy your LMS to production (Vercel + Railway + Supabase).

---

## Prerequisites

- [ ] GitHub account
- [ ] Supabase account (free tier works)
- [ ] Vercel account (free tier works)
- [ ] Railway account (free $5 credit)
- [ ] Bun installed locally (`curl -fsSL https://bun.sh/install | bash`)

---

## Step 1: Supabase Setup (Database + Auth)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Name**: `iq-didactic-lms`
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
4. Wait 2-3 minutes for project creation

### Get Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
3. Go to **Project Settings** → **Database**
4. Copy `Connection string` → `DATABASE_URL`
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Configure Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://your-vercel-app.vercel.app` (update after Vercel deployment)
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://your-vercel-app.vercel.app/**`
4. Go to **Authentication** → **Providers**
5. Enable **Email** provider
6. (Optional) Configure Google, GitHub, etc.

---

## Step 2: Local Development & Database Setup

### Clone & Install

```bash
git clone https://github.com/Lottie128/lms-final.git
cd lms-final
bun install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# Backend
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:3000

# Frontend
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3001/api
```

### Run Database Migrations

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Seed with demo data
bun run db:seed
```

### Test Locally

```bash
# Terminal 1: Start backend
bun run dev:backend

# Terminal 2: Start frontend
bun run dev:frontend

# Or run both together
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) and test with demo credentials.

---

## Step 3: Deploy Backend to Railway

### Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `lms-final` repository
4. Railway will auto-detect the project

### Configure Environment Variables

1. Go to **Variables** tab
2. Add these variables:

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Deploy

1. Railway will automatically deploy on git push
2. Wait for build to complete (2-3 minutes)
3. Go to **Settings** → **Generate Domain**
4. Copy the domain: `https://your-app.railway.app`
5. This is your `VITE_API_URL` for frontend

### Run Migrations on Railway

1. Go to Railway project
2. Click **Settings** → **Service**
3. Under **Build Command**, ensure migrations run:
   ```bash
   cd packages/backend && bun install && bun run db:generate && bun run db:push
   ```

---

## Step 4: Deploy Frontend to Vercel

### Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import `lms-final` from GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/frontend`
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist`
   - **Install Command**: `bun install`

### Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add these for all environments (Production, Preview, Development):

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://your-app.railway.app/api
```

### Deploy

1. Click **Deploy**
2. Wait for build (1-2 minutes)
3. Your app will be live at `https://your-app.vercel.app`

### Update Supabase Redirect URLs

1. Go back to Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Update **Site URL**: `https://your-app.vercel.app`
4. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Step 5: Final Configuration

### Update Railway Backend URL

1. Go to Railway project
2. Update `FRONTEND_URL` environment variable:
   ```bash
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy (Railway will auto-redeploy)

### Test Production

1. Visit `https://your-app.vercel.app`
2. Test sign up/login
3. Create a course (as teacher)
4. Enroll in a course (as student)
5. Check all dashboards

---

## Step 6: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project **Settings** → **Domains**
2. Add your domain (e.g., `lms.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs with new domain

### Railway Custom Domain

1. Go to Railway **Settings** → **Networking**
2. Add custom domain for API (e.g., `api.yourdomain.com`)
3. Update Vercel `VITE_API_URL` environment variable
4. Redeploy Vercel

---

## Troubleshooting

### Backend Issues

```bash
# Check Railway logs
railway logs

# Test API endpoint
curl https://your-app.railway.app/
# Should return: {"message":"IQ Didactic LMS API",...}

# Check database connection
# In Railway, run command:
cd packages/backend && bun run db:studio
```

### Frontend Issues

```bash
# Check Vercel logs
vercel logs

# Test locally with production API
VITE_API_URL=https://your-app.railway.app/api bun run dev:frontend

# Check environment variables
vercel env ls
```

### Database Issues

```bash
# Reset database (DANGER: deletes all data)
bun run db:push --force-reset
bun run db:seed

# View database
bun run db:studio

# Check Prisma client
bun run db:generate
```

### Auth Issues

1. Check Supabase **Authentication** → **Users**
2. Verify redirect URLs match exactly (no trailing slash issues)
3. Check browser console for CORS errors
4. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

---

## Performance Optimization

### Enable Vercel Analytics

1. Go to Vercel project
2. **Analytics** → **Enable**
3. Add `@vercel/analytics` to frontend:
   ```bash
   cd packages/frontend && bun add @vercel/analytics
   ```

### Railway Scaling

1. Go to Railway **Settings**
2. Adjust **Resources**:
   - Memory: 512MB (free) → 1GB+
   - Replicas: 1 → 2+ (for high availability)

### Database Optimization

1. Add indexes in `prisma/schema.prisma` (already done)
2. Enable Supabase **Database → Performance Insights**
3. Monitor slow queries

---

## Monitoring & Maintenance

### Check Health

```bash
# Backend health
curl https://your-app.railway.app/

# Frontend health
curl https://your-app.vercel.app/
```

### Supabase Dashboard

- Monitor **Database → Logs**
- Check **Authentication → Users**
- View **Storage** usage

### Set Up Alerts

1. Vercel: **Settings** → **Notifications**
2. Railway: **Settings** → **Webhooks**
3. Supabase: **Project Settings** → **Integrations**

---

## Backup Strategy

### Database Backups

1. Supabase automatically backs up daily (free tier: 7 days)
2. Manual backup:
   ```bash
   # Export database
   pg_dump $DATABASE_URL > backup.sql
   ```

### Code Backups

- All code is in GitHub (automatic backup)
- Tag releases:
  ```bash
  git tag -a v1.0.0 -m "Production release"
  git push origin v1.0.0
  ```

---

## Next Steps

- [ ] Add custom domain
- [ ] Set up monitoring/alerts
- [ ] Configure email templates in Supabase
- [ ] Add Google/GitHub OAuth
- [ ] Implement file upload for course thumbnails
- [ ] Add video hosting integration
- [ ] Set up CI/CD for automated testing
- [ ] Add Sentry for error tracking

---

## Support

If you encounter issues:

1. Check this guide
2. Review error logs (Railway/Vercel/Supabase)
3. Check GitHub issues
4. Open a new issue with:
   - Error message
   - Steps to reproduce
   - Environment (local/production)
   - Screenshots

---

**🎉 Congratulations! Your IQ Didactic LMS is now live!**
