# 🌱 Database Seeding Instructions for Railway

## Quick Seed Command for Railway

To seed your database on Railway with the new realistic courses:

```bash
cd packages/backend && ~/.bun/bin/bun run src/seed.ts
```

## What This Seed Does

✅ **Clears all old dummy data** (no more disgusting leftover data!)
✅ **Creates 2 professional courses:**
   1. **Machine Learning Recipes** - Google's free ML course from YouTube (5 lessons + quiz)
   2. **Full Stack Web Development** - Complete web dev course (8 lessons + quiz)
✅ **Creates 3 users with professional credentials:**
   - Admin: admin@iqdidactic.com / Demo2025!Admin
   - Teacher: teacher@iqdidactic.com / Demo2025!Teacher  
   - Student: student@iqdidactic.com / Demo2025!Student
✅ **Enrolls student in both courses** (0% progress, fresh start)
✅ **Creates working quizzes/assignments** for each course
✅ **No dummy certificates or accomplishments**

## Railway Deployment Options

### Option 1: One-Time Seed (Recommended for Demo)

Run this command once after deployment in Railway's terminal:

```bash
cd packages/backend && ~/.bun/bin/bun run src/seed.ts
```

### Option 2: Auto-Seed on Every Deployment

Update your `railway.json` build command:

```json
{
  "build": {
    "buildCommand": "cd packages/backend && ~/.bun/bin/bun install && ~/.bun/bin/bun run ./node_modules/.bin/prisma generate && chmod +x start.sh && ~/.bun/bin/bun run src/seed.ts"
  }
}
```

⚠️ **Warning:** This will reset data on every deploy!

### Option 3: Seed Script (Best for Production)

Create a separate Railway service just for seeding:

1. Add to `package.json` in backend:
   ```json
   "scripts": {
     "seed:prod": "bun run src/seed.ts"
   }
   ```

2. Run manually when needed:
   ```bash
   cd packages/backend && bun run seed:prod
   ```

## Current Start Command

Your Railway start command is:
```bash
cd packages/backend && bash start.sh
```

This starts the server WITHOUT auto-seeding, which is correct for production.

## Database Migration

Before seeding, ensure your database is migrated:

```bash
cd packages/backend && ~/.bun/bin/bunx prisma migrate deploy
```

## Verification

After seeding, you should see:
- ✓ 2 courses in the courses table
- ✓ 13 lessons total (5 + 8)
- ✓ 2 assignments/quizzes (1 per course)
- ✓ 3 users (admin, teacher, student)
- ✓ 2 enrollments (student enrolled in both courses)
- ✓ 0 dummy certificates or accomplishments

## Troubleshooting

### If seed fails:

1. **Check DATABASE_URL** is set in Railway environment variables
2. **Check Supabase credentials** (SUPABASE_URL, SUPABASE_SERVICE_KEY)
3. **Run migrations first:** `bunx prisma migrate deploy`
4. **Check logs** for specific error messages

### If data looks wrong:

1. **Run seed again** - it clears old data first
2. **Check Prisma Studio:** `bunx prisma studio`
3. **Manually clear if needed:**
   ```sql
   TRUNCATE TABLE submissions, assignments, progress, enrollments, lessons, courses, users CASCADE;
   ```

## CRUD Function Notes

### Quiz/Assignment Creator Fixed

The seed now properly creates assignments attached to lessons, so the quiz creator will show real data instead of dummy quizzes.

### All CRUD Functions Working:

- ✅ **Admin Dashboard:** Create/edit/delete courses, manage users
- ✅ **Teacher Dashboard:** Create courses with lessons, add quizzes, grade assignments
- ✅ **Student Dashboard:** View enrolled courses, complete lessons, submit assignments

## For Your 5-Minute Presentation

**Login as Student:**
- Email: student@iqdidactic.com
- Password: Demo2025!Student
- Show: 2 enrolled courses, realistic content, clean dashboard

**Login as Teacher:**
- Email: teacher@iqdidactic.com  
- Password: Demo2025!Teacher
- Show: Created courses, quiz management, student submissions

**Login as Admin:**
- Email: admin@iqdidactic.com
- Password: Demo2025!Admin
- Show: User management, course oversight, platform analytics

## What's Different from Old Seed?

🚫 **Removed:**
- Generic "Web Development Fundamentals" course
- Dummy "Advanced React Patterns" course
- Dummy "UI/UX Design Principles" course  
- Random test data accumulation
- Broken quiz creator references

✅ **Added:**
- Real Google ML Recipes course from YouTube
- Comprehensive Full Stack Web Dev course
- Proper video URLs and detailed content
- Data cleanup on every seed run
- Professional demo credentials
- Working quiz/assignment system

---

**Last Updated:** January 8, 2026
**Status:** ✅ Production Ready for Demo
