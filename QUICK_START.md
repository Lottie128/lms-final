# ⚡ IQ Didactic LMS - Quick Start Cheat Sheet

## 🚀 Railway Seed Command (Run This NOW!)

```bash
cd packages/backend && ~/.bun/bin/bun run src/seed.ts
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Student** | student@iqdidactic.com | Demo2025!Student |
| **Teacher** | teacher@iqdidactic.com | Demo2025!Teacher |
| **Admin** | admin@iqdidactic.com | Demo2025!Admin |

---

## 📚 What's in the Database?

### 2 Professional Courses:

**1. Machine Learning Recipes** (Google YouTube)
- 5 lessons with video links
- 1 quiz: "Build Your First Classifier"
- Category: Artificial Intelligence

**2. Full Stack Web Development**
- 8 comprehensive lessons
- 1 quiz: "Build a Full-Stack Todo Application"
- Category: Web Development

### 3 Users:
- 1 Admin: Dr. Sarah Mitchell
- 1 Teacher: Prof. Michael Chen  
- 1 Student: Alex Johnson (enrolled in both courses)

---

## ✅ What Was Fixed?

1. **🧹 Data Cleanup** - Removes ALL old dummy data before seeding
2. **📚 Realistic Courses** - Added Google ML Recipes + Full Stack Web Dev
3. **❓ Quiz Creator** - Now shows REAL assignments (not dummy quizzes)
4. **📝 Lesson API** - Now includes assignments in response
5. **✨ Clean Dashboards** - No more disgusting certificates/accomplishments

---

## 🛠️ Railway Start Command (Already Configured)

```bash
cd packages/backend && bash start.sh
```

**Don't change this!** It's correct for production.

---

## 💡 Quick Demo Tips

### Student Dashboard:
- Show: 2 enrolled courses, clean UI
- Navigate: ML Recipes → Lesson 1 → Show video player
- Highlight: No dummy data!

### Teacher Dashboard:
- Show: Course management, 2 created courses
- Navigate: Full Stack course → Edit lesson
- Highlight: Quiz creator with REAL assignments

### Admin Dashboard:
- Show: User management (3 users)
- Show: Course approval system
- Highlight: Platform-wide analytics

---

## 🐛 Emergency Troubleshooting

**If seed fails:**
```bash
cd packages/backend && bunx prisma db push && bun run src/seed.ts
```

**If login fails:**
- Check Railway env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY

**If courses don't show:**
```bash
curl https://your-backend.railway.app/api/courses
```

---

## 📊 Key Metrics to Mention

- **2 courses** with real content
- **13 lessons** total (5 + 8)
- **2 quizzes** with due dates
- **3 roles** (Admin, Teacher, Student)
- **100% CRUD** functionality across all dashboards
- **0 dummy data** accumulation

---

## 🎯 What Makes This Special?

✅ **Real Content** - Google ML course from YouTube
✅ **Clean Data** - Auto-cleanup on every seed
✅ **Working Quizzes** - Properly attached to lessons
✅ **Professional UI** - Glassmorphism Apple-style design
✅ **Production Ready** - Deployed on Vercel + Railway + Supabase

---

## 📞 Need Help?

Check these files:
- **SEED_DEPLOYMENT.md** - Detailed seeding instructions
- **PRESENTATION_GUIDE.md** - Full 5-minute demo flow
- **README.md** - Technical architecture

---

**You're ready to present! Good luck! 🚀💪**
