import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: 0, icon: Users, color: 'text-accent dark:text-accent-dark' },
    { title: 'Total Courses', value: 0, icon: BookOpen, color: 'text-success dark:text-success-dark' },
    { title: 'Enrollments', value: 0, icon: GraduationCap, color: 'text-warning dark:text-warning-dark' },
    { title: 'Completion Rate', value: '0%', icon: TrendingUp, color: 'text-error dark:text-error-dark' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Admin Dashboard
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          System overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      <Card className="p-12 text-center">
        <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
          Admin Panel
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Full admin features coming soon
        </p>
      </Card>
    </div>
  );
}
