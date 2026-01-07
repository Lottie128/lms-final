import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Award, PlayCircle } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { data: enrolledCourses, isLoading } = useQuery({
    queryKey: ['enrolled-courses'],
    queryFn: async () => {
      const response = await api.get('/enrollments/my-courses');
      return response.data.data || [];
    },
  });

  const { data: progressData } = useQuery({
    queryKey: ['my-progress'],
    queryFn: async () => {
      const response = await api.get('/progress/overview');
      return response.data.data || { totalCourses: 0, completedLessons: 0, totalTimeSpent: 0, averageProgress: 0 };
    },
  });

  const stats = [
    {
      title: 'Enrolled Courses',
      value: enrolledCourses?.length || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Lessons Completed',
      value: progressData?.completedLessons || 0,
      icon: Award,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Hours Learned',
      value: Math.floor((progressData?.totalTimeSpent || 0) / 3600),
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Average Progress',
      value: `${Math.round(progressData?.averageProgress || 0)}%`,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
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
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">My Learning Dashboard</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Track your progress and continue learning
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
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

        {/* Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Continue Learning
            </h2>
            <Link
              to="/courses"
              className="text-accent dark:text-accent-dark hover:underline font-medium"
            >
              Browse All Courses
            </Link>
          </div>

          {!enrolledCourses || enrolledCourses.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
              <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                No courses enrolled yet
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Start your learning journey by enrolling in a course
              </p>
              <Link to="/courses" className="btn-primary inline-block">
                Browse Courses
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment: any, index: number) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/courses/${enrollment.course?.id}`}>
                    <Card hover className="overflow-hidden h-full">
                      <div className="aspect-video bg-gradient-primary relative">
                        {enrollment.course?.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg mb-2">{enrollment.course?.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {enrollment.course?.description}
                        </CardDescription>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-light-text-secondary dark:text-dark-text-secondary">
                              Progress
                            </span>
                            <span className="font-medium text-accent dark:text-accent-dark">
                              {Math.round(enrollment.progress || 0)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            />
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
