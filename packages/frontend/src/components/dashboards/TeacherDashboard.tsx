import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export function TeacherDashboard() {
  const stats = [
    { title: 'My Courses', value: 0, icon: BookOpen, color: 'text-accent dark:text-accent-dark' },
    { title: 'Total Students', value: 0, icon: Users, color: 'text-success dark:text-success-dark' },
    { title: 'Assignments', value: 0, icon: FileText, color: 'text-warning dark:text-warning-dark' },
    { title: 'Avg Rating', value: '0.0', icon: TrendingUp, color: 'text-error dark:text-error-dark' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Manage your courses and students
          </p>
        </div>
        <Link to="/courses/create">
          <Button variant="primary">Create Course</Button>
        </Link>
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
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
        <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
          No courses yet
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
          Create your first course to start teaching
        </p>
        <Link to="/courses/create">
          <Button variant="primary">Create Your First Course</Button>
        </Link>
      </Card>
    </div>
  );
}
