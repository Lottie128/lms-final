import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyCourses() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';

  // For teachers: courses they created
  const { data: createdCourses, isLoading: loadingCreated } = useQuery({
    queryKey: ['my-created-courses'],
    queryFn: async () => {
      if (!isTeacher) return [];
      const response = await api.get('/courses/my-courses');
      return response.data.data || [];
    },
    enabled: isTeacher,
  });

  // For students: courses they enrolled in
  const { data: enrolledCourses, isLoading: loadingEnrolled } = useQuery({
    queryKey: ['my-enrolled-courses'],
    queryFn: async () => {
      const response = await api.get('/enrollments/my-courses');
      return response.data.data || [];
    },
  });

  const isLoading = isTeacher ? loadingCreated : loadingEnrolled;
  const courses = isTeacher ? createdCourses : enrolledCourses;

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
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {isTeacher ? 'My Created Courses' : 'My Learning'}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {isTeacher
              ? 'Courses you have created and are teaching'
              : 'Track your learning progress and continue where you left off'}
          </p>
        </div>

        {/* Course Grid */}
        {!courses || courses.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              {isTeacher ? 'No courses created yet' : 'No courses enrolled yet'}
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
              {isTeacher
                ? 'Create your first course to start teaching'
                : 'Browse available courses and start learning'}
            </p>
            <Link
              to={isTeacher ? '/courses/create' : '/courses'}
              className="btn-primary inline-block"
            >
              {isTeacher ? 'Create Course' : 'Browse Courses'}
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((item: any, index: number) => {
              const course = isTeacher ? item : item.course;
              const progress = isTeacher ? null : item.progress;

              return (
                <motion.div
                  key={course?.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/courses/${course?.id}`}>
                    <Card hover className="overflow-hidden h-full">
                      <div className="aspect-video bg-gradient-primary relative">
                        {course?.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        {isTeacher && !course?.isPublished && (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                            Draft
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg mb-2">{course?.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course?.description}
                        </CardDescription>

                        {/* Progress for students */}
                        {!isTeacher && progress !== null && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-light-text-secondary dark:text-dark-text-secondary">
                                Progress
                              </span>
                              <span className="font-medium text-accent dark:text-accent-dark">
                                {Math.round(progress || 0)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full transition-all duration-300"
                                style={{ width: `${progress || 0}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Stats for teachers */}
                        {isTeacher && (
                          <div className="flex items-center gap-4 mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              <span>{course?._count?.enrollments || 0} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{course?._count?.lessons || 0} lessons</span>
                            </div>
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
