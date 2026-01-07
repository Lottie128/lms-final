import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Award, UserCheck, GraduationCap } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { api } from '../lib/api';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data.data || {
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        totalLessons: 0,
      };
    },
  });

  const statsData = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Registered accounts',
    },
    {
      title: 'Students',
      value: stats?.totalStudents || 0,
      icon: GraduationCap,
      color: 'from-green-500 to-emerald-500',
      description: 'Active learners',
    },
    {
      title: 'Teachers',
      value: stats?.totalTeachers || 0,
      icon: UserCheck,
      color: 'from-purple-500 to-pink-500',
      description: 'Course instructors',
    },
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      description: 'Available courses',
    },
    {
      title: 'Enrollments',
      value: stats?.totalEnrollments || 0,
      icon: TrendingUp,
      color: 'from-pink-500 to-rose-500',
      description: 'Course enrollments',
    },
    {
      title: 'Total Lessons',
      value: stats?.totalLessons || 0,
      icon: Award,
      color: 'from-indigo-500 to-purple-500',
      description: 'Learning content',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader size="lg" text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Admin Dashboard</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Platform overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {stat.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover className="p-6 cursor-pointer hover:border-accent dark:hover:border-accent-dark transition-colors">
              <Users className="w-8 h-8 text-accent dark:text-accent-dark mb-3" />
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Manage Users
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                View and manage all platform users
              </p>
            </Card>

            <Card hover className="p-6 cursor-pointer hover:border-accent dark:hover:border-accent-dark transition-colors">
              <BookOpen className="w-8 h-8 text-accent dark:text-accent-dark mb-3" />
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Manage Courses
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Review and approve courses
              </p>
            </Card>

            <Card hover className="p-6 cursor-pointer hover:border-accent dark:hover:border-accent-dark transition-colors">
              <TrendingUp className="w-8 h-8 text-accent dark:text-accent-dark mb-3" />
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                View Analytics
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Platform performance metrics
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
