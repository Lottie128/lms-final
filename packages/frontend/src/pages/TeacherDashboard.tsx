import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Users, TrendingUp, PlusCircle } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const { data: myCourses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const response = await api.get('/courses/my-courses');
      return response.data.data || [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['teacher-stats'],
    queryFn: async () => {
      const response = await api.get('/teachers/stats');
      return response.data.data || { totalCourses: 0, totalStudents: 0, totalLessons: 0 };
    },
  });

  const statsData = [
    {
      title: 'My Courses',
      value: myCourses?.length || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Total Lessons',
      value: stats?.totalLessons || 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader size="lg" text="Loading your courses..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Teacher Dashboard</h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Manage your courses and track student progress
            </p>
          </div>
          <Link to="/courses/create">
            <Button variant="primary" icon={<PlusCircle className="w-5 h-5" />}>
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* My Courses */}
        <div>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
            My Courses
          </h2>

          {!myCourses || myCourses.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
              <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                No courses created yet
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Create your first course to start teaching
              </p>
              <Link to="/courses/create">
                <Button variant="primary" icon={<PlusCircle className="w-5 h-5" />}>
                  Create Your First Course
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course: any, index: number) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/courses/${course.id}`}>
                    <Card hover className="overflow-hidden h-full">
                      <div className="aspect-video bg-gradient-primary relative">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        {!course.isPublished && (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                            Draft
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                        <div className="flex items-center gap-4 mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course._count?.enrollments || 0} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{course._count?.lessons || 0} lessons</span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
