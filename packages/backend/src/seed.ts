import { prisma } from './lib/prisma';
import { supabase } from './lib/supabase';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing dummy data to prevent accumulation
  console.log('🧹 Cleaning up old data...');
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.progress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✓ Old data cleared');

  // Create demo users via Supabase Auth
  const demoUsers = [
    {
      email: 'admin@iqdidactic.com',
      password: 'Demo2025!Admin',
      name: 'Dr. Sarah Mitchell',
      role: 'ADMIN',
    },
    {
      email: 'teacher@iqdidactic.com',
      password: 'Demo2025!Teacher',
      name: 'Prof. Michael Chen',
      role: 'TEACHER',
    },
    {
      email: 'student@iqdidactic.com',
      password: 'Demo2025!Student',
      name: 'Alex Johnson',
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

  // Create TWO realistic courses
  const courses = [
    {
      title: 'Machine Learning Recipes',
      description:
        'Learn machine learning fundamentals with Google\'s practical recipe-style tutorials. This free course from YouTube covers essential ML concepts through hands-on examples, perfect for beginners looking to understand AI and machine learning basics. Build your first ML models with TensorFlow and understand how machines learn from data.',
      category: 'Artificial Intelligence',
      isPublished: true,
      lessons: [
        {
          title: 'Hello World - Machine Learning Recipes #1',
          description: 'Introduction to machine learning with a simple classifier',
          content:
            'Welcome to Machine Learning Recipes! In this first episode, we\'ll write our first machine learning program using scikit-learn. We\'ll start with a simple "Hello World" example that classifies fruits based on their features like weight and texture. You\'ll learn what supervised learning is and how to train your first classifier in just 6 lines of code. By the end, you\'ll understand the basic workflow: import dataset → train classifier → make predictions. This foundational lesson sets the stage for everything else in machine learning.',
          videoUrl: 'https://www.youtube.com/watch?v=cKxRvEZd3Mw',
          order: 1,
          duration: 360,
        },
        {
          title: 'Visualizing a Decision Tree - ML Recipes #2',
          description: 'Learn how to visualize and understand decision trees',
          content:
            'In this lesson, we dive deeper into decision trees - one of the most intuitive machine learning algorithms. You\'ll learn how to visualize your decision tree to understand exactly how it makes predictions. We\'ll explore how the tree asks questions about your data and follows different branches to reach conclusions. Understanding decision trees is crucial because they form the foundation for more advanced algorithms like random forests. We\'ll use graphviz to create beautiful visualizations that make the \'black box\' of ML transparent and understandable.',
          videoUrl: 'https://www.youtube.com/watch?v=tNa99PG8hR8',
          order: 2,
          duration: 420,
        },
        {
          title: 'What Makes a Good Feature? - ML Recipes #3',
          description: 'Understand feature engineering and selection',
          content:
            'Features are the fuel of machine learning. In this essential lesson, you\'ll learn what makes a good feature and how to think about your data like a data scientist. We\'ll explore the concept of feature engineering - transforming raw data into meaningful inputs that help your model learn better. You\'ll discover how to avoid redundant features, handle missing data, and choose features that are informative and independent. Good features can make the difference between a mediocre model and an excellent one. We\'ll use practical examples to show how feature quality directly impacts your model\'s accuracy.',
          videoUrl: 'https://www.youtube.com/watch?v=N9fDIAflCMY',
          order: 3,
          duration: 390,
        },
        {
          title: 'Let\'s Write a Pipeline - ML Recipes #4',
          description: 'Build production-ready ML pipelines',
          content:
            'Real-world machine learning isn\'t just about training models - it\'s about building robust pipelines. In this lesson, you\'ll learn how to replace one classifier with another using scikit-learn\'s powerful pipeline feature. We\'ll compare different algorithms (Decision Trees, K-Nearest Neighbors, etc.) using the same training and testing framework. You\'ll understand the importance of separating training and test data, and why you should never test on data you trained on. This lesson teaches you professional ML engineering practices that will help you build production-ready systems.',
          videoUrl: 'https://www.youtube.com/watch?v=84gqSbLcBFE',
          order: 4,
          duration: 450,
        },
        {
          title: 'Writing Our First Classifier - ML Recipes #5',
          description: 'Implement your own machine learning algorithm from scratch',
          content:
            'Time to get your hands dirty! In this advanced lesson, we\'ll write our own image classifier from scratch using just Python and NumPy. You\'ll implement the k-Nearest Neighbors algorithm yourself to truly understand how machine learning works under the hood. We\'ll classify handwritten digits from the MNIST dataset, one of the most famous datasets in ML history. By building your own classifier, you\'ll gain deep insights into how distance metrics work, how training data is stored, and how predictions are made. This is where you transition from ML user to ML practitioner.',
          videoUrl: 'https://www.youtube.com/watch?v=AoeEHqVSNOw',
          order: 5,
          duration: 480,
        },
      ],
      assignments: [
        {
          title: 'Build Your First Classifier',
          description:
            'Create a simple classifier using scikit-learn to classify a dataset of your choice. Submit your Python code and a brief explanation of your approach.',
          maxPoints: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      ],
    },
    {
      title: 'Full Stack Web Development',
      description:
        'Master modern web development from frontend to backend. Learn HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Build real-world applications and understand the complete development lifecycle. This comprehensive course covers everything you need to become a professional full-stack developer, including responsive design, API development, authentication, and cloud deployment.',
      category: 'Web Development',
      isPublished: true,
      lessons: [
        {
          title: 'Web Development Fundamentals',
          description: 'Understanding how the web works',
          content:
            'Welcome to Full Stack Web Development! In this foundational lesson, we\'ll explore how the internet and web actually work. You\'ll learn about clients and servers, HTTP/HTTPS protocols, DNS, and how browsers render web pages. We\'ll cover the request-response cycle and understand what happens when you type a URL into your browser. You\'ll also get an overview of the full-stack architecture - frontend (what users see), backend (business logic and data), and databases (data storage). Understanding these fundamentals is crucial before diving into specific technologies.',
          order: 1,
          duration: 540,
        },
        {
          title: 'HTML5 & Semantic Markup',
          description: 'Building the structure of web pages',
          content:
            'HTML is the backbone of every website. In this lesson, you\'ll master HTML5 and semantic markup principles. Learn how to structure content using proper tags like header, nav, main, article, section, and footer. We\'ll explore forms, tables, lists, and multimedia elements. You\'ll understand the importance of semantic HTML for SEO, accessibility, and maintainability. We\'ll also cover HTML5 APIs like localStorage, geolocation, and canvas. By the end, you\'ll be able to create well-structured, accessible web pages that follow modern best practices.',
          order: 2,
          duration: 600,
        },
        {
          title: 'CSS3 & Modern Layouts',
          description: 'Styling and responsive design with CSS',
          content:
            'Transform your plain HTML into beautiful, responsive designs! This lesson covers CSS3 fundamentals including selectors, the box model, positioning, and layout techniques. You\'ll master Flexbox and CSS Grid for modern, responsive layouts that work on any device. Learn about CSS variables, transitions, animations, and transforms to create engaging user experiences. We\'ll explore mobile-first design principles and media queries. You\'ll also discover CSS preprocessors like Sass and modern CSS-in-JS approaches. By the end, you\'ll have the skills to create stunning, professional-looking websites.',
          order: 3,
          duration: 720,
        },
        {
          title: 'JavaScript ES6+ Essentials',
          description: 'Modern JavaScript programming',
          content:
            'JavaScript is the programming language of the web. In this comprehensive lesson, you\'ll learn modern JavaScript (ES6+) from the ground up. Master variables (let, const), arrow functions, template literals, destructuring, spread/rest operators, and modules. Understand asynchronous JavaScript with Promises and async/await. Learn about the DOM API and how to manipulate web pages dynamically. We\'ll cover event handling, form validation, and local storage. You\'ll also explore functional programming concepts like map, filter, and reduce. This lesson gives you the JavaScript foundation needed for any frontend framework.',
          order: 4,
          duration: 900,
        },
        {
          title: 'React Fundamentals & Hooks',
          description: 'Building interactive UIs with React',
          content:
            'React is the most popular JavaScript library for building user interfaces. Learn React fundamentals including JSX, components, props, and state. Master React Hooks like useState, useEffect, useContext, and useReducer. Understand component lifecycle and how to manage side effects. We\'ll build several projects including a todo app, weather dashboard, and shopping cart. Learn about conditional rendering, lists and keys, forms, and lifting state up. You\'ll also explore React Router for navigation and best practices for component design. By the end, you\'ll be confident building production-ready React applications.',
          order: 5,
          duration: 1080,
        },
        {
          title: 'Backend with Node.js & Express',
          description: 'Server-side JavaScript development',
          content:
            'Take your JavaScript skills to the server! Learn Node.js and Express to build powerful backend APIs. Understand the event loop, modules, and npm ecosystem. Master Express routing, middleware, error handling, and authentication. We\'ll build RESTful APIs with proper HTTP methods, status codes, and JSON responses. Learn about JWT authentication, password hashing with bcrypt, and securing your APIs. You\'ll also explore environment variables, CORS, rate limiting, and API documentation with Swagger. This lesson prepares you to build scalable, secure backend services.',
          order: 6,
          duration: 960,
        },
        {
          title: 'Database Design & PostgreSQL',
          description: 'Working with relational databases',
          content:
            'Data is at the heart of every application. Learn database design principles and PostgreSQL, the world\'s most advanced open-source database. Master SQL queries (SELECT, JOIN, GROUP BY, etc.), table design, relationships (one-to-many, many-to-many), and normalization. Understand indexes, transactions, and constraints. We\'ll use Prisma ORM to interact with databases from Node.js in a type-safe way. Learn about migrations, seeding, and database backups. You\'ll also explore query optimization and when to use SQL vs NoSQL databases. By the end, you\'ll confidently design and query databases for real applications.',
          order: 7,
          duration: 840,
        },
        {
          title: 'Full Stack Integration & Deployment',
          description: 'Connecting frontend, backend, and deploying to production',
          content:
            'Bring it all together! In this final lesson, you\'ll integrate React frontend with Express backend, handle CORS, manage authentication flows, and deploy your full-stack application to production. Learn about environment management (dev, staging, prod), CI/CD pipelines, and monitoring. We\'ll deploy the frontend to Vercel, backend to Railway, and database to Supabase. Understand domain configuration, HTTPS, and CDN usage. Learn debugging techniques, logging, and error tracking with tools like Sentry. You\'ll also explore Docker basics and scaling strategies. This lesson transforms you into a deployment-ready full-stack developer!',
          order: 8,
          duration: 1020,
        },
      ],
      assignments: [
        {
          title: 'Build a Full-Stack Todo Application',
          description:
            'Create a complete todo application with React frontend, Express backend, and PostgreSQL database. Include user authentication, CRUD operations, and deploy to production. Submit your GitHub repository link and live application URL.',
          maxPoints: 100,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        },
      ],
    },
  ];

  for (const courseData of courses) {
    const { lessons: lessonsData, assignments: assignmentsData, ...courseInfo } = courseData;

    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        teacherId: teacher.id,
      },
    });

    console.log(`✓ Created course: ${course.title}`);

    // Create lessons for this course
    const createdLessons = [];
    for (const lessonData of lessonsData) {
      const lesson = await prisma.lesson.create({
        data: {
          ...lessonData,
          courseId: course.id,
          isPublished: true,
        },
      });
      createdLessons.push(lesson);
    }
    console.log(`  ✓ Created ${lessonsData.length} lessons`);

    // Create assignments (quizzes) for this course
    for (const assignmentData of assignmentsData) {
      // Attach assignment to first lesson of the course
      await prisma.assignment.create({
        data: {
          ...assignmentData,
          lessonId: createdLessons[0].id,
        },
      });
    }
    console.log(`  ✓ Created ${assignmentsData.length} assignments`);

    // Enroll student in both courses
    if (student) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          progress: 0, // Fresh start
        },
      });
      console.log(`  ✓ Enrolled ${student.name} in ${course.title}`);
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n🔐 Demo Credentials:');
  console.log('   Admin:   admin@iqdidactic.com / Demo2025!Admin');
  console.log('   Teacher: teacher@iqdidactic.com / Demo2025!Teacher');
  console.log('   Student: student@iqdidactic.com / Demo2025!Student');
  console.log('\n📚 Courses Created:');
  console.log('   1. Machine Learning Recipes (5 lessons + 1 quiz)');
  console.log('   2. Full Stack Web Development (8 lessons + 1 quiz)');
  console.log('\n✨ All dummy data cleared - fresh realistic data loaded!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
