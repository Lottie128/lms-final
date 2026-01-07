import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { api } from '../../lib/api';

export function StudentDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['student-stats'],
    queryFn: async () => {
      const response = await api.get('/progress/stats');
      return response.data.data;
    },
  });

  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const response = await api.get('/enrollments?perPage=5');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Enrolled Courses',
      value: stats?.enrolledCourses || 0,
      icon: BookOpen,
      color: 'text-accent dark:text-accent-dark',
    },
    {
      title: 'Completed Courses',
      value: stats?.completedCourses || 0,
      icon: Award,
      color: 'text-success dark:text-success-dark',
    },
    {
      title: 'Completed Lessons',
      value: stats?.completedLessons || 0,
      icon: TrendingUp,
      color: 'text-warning dark:text-warning-dark',
    },
    {
      title: 'Learning Hours',
      value: Math.round((stats?.totalTimeSpent || 0) / 3600),
      icon: Clock,
      color: 'text-error dark:text-error-dark',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          My Learning Dashboard
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Track your progress and continue learning
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Courses */}
      <div>
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
          Continue Learning
        </h2>
        {enrollmentsData?.enrollments?.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              No courses yet
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
              Start your learning journey by enrolling in a course
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollmentsData?.enrollments?.slice(0, 3).map((enrollment: any) => (
              <Card key={enrollment.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{enrollment.course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">
                          Progress
                        </span>
                        <span className="font-medium">{enrollment.progress}%</span>
                      </div>
                      <div className="h-2 bg-light-surface-secondary dark:bg-dark-surface-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent dark:bg-accent-dark"
                          initial={{ width: 0 }}
                          animate={{ width: `${enrollment.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
