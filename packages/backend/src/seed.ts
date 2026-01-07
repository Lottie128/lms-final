import { prisma } from './lib/prisma';
import { supabase } from './lib/supabase';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users via Supabase Auth
  const demoUsers = [
    {
      email: 'admin@demo.com',
      password: 'password123',
      name: 'Admin User',
      role: 'ADMIN',
    },
    {
      email: 'teacher@demo.com',
      password: 'password123',
      name: 'John Teacher',
      role: 'TEACHER',
    },
    {
      email: 'student@demo.com',
      password: 'password123',
      name: 'Jane Student',
      role: 'STUDENT',
    },
  ];

  const createdUsers = [];

  for (const userData of demoUsers) {
    // Check if user exists in Supabase
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users.find(u => u.email === userData.email);

    if (!userExists) {
      // Create in Supabase Auth
      const { data: authData, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role,
        },
      });

      if (error) {
        console.error(`Failed to create ${userData.email}:`, error);
        continue;
      }

      if (authData.user) {
        // Create in database
        const user = await prisma.user.upsert({
          where: { id: authData.user.id },
          update: {},
          create: {
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role as any,
          },
        });

        createdUsers.push(user);
        console.log(`✓ Created user: ${userData.email}`);
      }
    } else {
      console.log(`- User already exists: ${userData.email}`);
      const dbUser = await prisma.user.findUnique({ where: { email: userData.email } });
      if (dbUser) createdUsers.push(dbUser);
    }
  }

  // Find teacher for courses
  const teacher = createdUsers.find(u => u.role === 'TEACHER');
  const student = createdUsers.find(u => u.role === 'STUDENT');

  if (!teacher) {
    console.log('⚠ No teacher found, skipping course creation');
    return;
  }

  // Create demo courses
  const courses = [
    {
      title: 'Web Development Fundamentals',
      description:
        'Learn the basics of web development including HTML, CSS, and JavaScript. Perfect for beginners.',
      category: 'Programming',
      isPublished: true,
    },
    {
      title: 'Advanced React Patterns',
      description:
        'Master advanced React concepts including hooks, context, and performance optimization.',
      category: 'Programming',
      isPublished: true,
    },
    {
      title: 'UI/UX Design Principles',
      description: 'Learn the fundamentals of user interface and user experience design.',
      category: 'Design',
      isPublished: true,
    },
  ];

  for (const courseData of courses) {
    const course = await prisma.course.create({
      data: {
        ...courseData,
        teacherId: teacher.id,
      },
    });

    console.log(`✓ Created course: ${course.title}`);

    // Create lessons for each course
    const lessons = [
      {
        title: 'Introduction',
        description: 'Get started with the course basics',
        content: 'Welcome to the course! In this lesson, we will cover the fundamentals.',
        order: 1,
        duration: 600,
        isPublished: true,
      },
      {
        title: 'Core Concepts',
        description: 'Deep dive into the main topics',
        content: 'Let\'s explore the core concepts in detail.',
        order: 2,
        duration: 1200,
        isPublished: true,
      },
      {
        title: 'Practical Examples',
        description: 'Hands-on practice',
        content: 'Apply what you\'ve learned with real-world examples.',
        order: 3,
        duration: 1800,
        isPublished: true,
      },
    ];

    for (const lessonData of lessons) {
      await prisma.lesson.create({
        data: {
          ...lessonData,
          courseId: course.id,
        },
      });
    }

    console.log(`  ✓ Created ${lessons.length} lessons for ${course.title}`);

    // Enroll student in first course
    if (student && courses.indexOf(courseData) === 0) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          progress: 33,
        },
      });
      console.log(`  ✓ Enrolled ${student.name} in ${course.title}`);
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n🔐 Demo Credentials:');
  console.log('   Admin:   admin@demo.com / password123');
  console.log('   Teacher: teacher@demo.com / password123');
  console.log('   Student: student@demo.com / password123');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
