import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Users, PlayCircle, CheckCircle, Settings, FileText } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { Course, Lesson } from 'shared/types';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    retry: 1,
  });

  const { data: enrollmentData } = useQuery({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/enrollments/course/${id}`);
        return response.data.data;
      } catch {
        return null;
      }
    },
    enabled: !!id && user?.role === 'STUDENT',
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/enrollments', { courseId: id });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', id] });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader size="lg" text="Loading course..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !courseData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mb-4" />
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            Course Not Found
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            This course doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/courses')} icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const course: Course = courseData;
  const isEnrolled = !!enrollmentData;
  const isOwner = (user?.role === 'TEACHER' || user?.role === 'ADMIN') && (course.teacherId === user?.id || user?.role === 'ADMIN');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Link to="/courses">
          <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Courses
          </Button>
        </Link>

        {/* Course Header */}
        <Card className="overflow-hidden">
          <div className="aspect-video bg-gradient-primary relative">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="w-24 h-24 text-white/50" />
              </div>
            )}
          </div>

          <CardHeader className="p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="inline-block px-3 py-1 rounded-full bg-accent/10 dark:bg-accent-dark/10 text-accent dark:text-accent-dark text-sm font-medium mb-4">
                  {course.category || 'General'}
                </div>
                <CardTitle className="text-3xl mb-3">{course.title}</CardTitle>
                <CardDescription className="text-base">{course.description}</CardDescription>

                {/* Course Meta */}
                <div className="flex flex-wrap gap-6 mt-6 text-light-text-secondary dark:text-dark-text-secondary">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.teacher?.name || 'Instructor'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{course.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{(course as any)._count?.enrollments || 0} students</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Student Actions */}
                {user?.role === 'STUDENT' && (
                  isEnrolled ? (
                    <Button variant="secondary" disabled icon={<CheckCircle className="w-5 h-5" />}>
                      Enrolled
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => enrollMutation.mutate()}
                      loading={enrollMutation.isPending}
                    >
                      Enroll Now
                    </Button>
                  )
                )}

                {/* Teacher/Admin Actions */}
                {isOwner && (
                  <>
                    <Link to={`/courses/${id}/lessons`}>
                      <Button variant="outline" icon={<FileText className="w-5 h-5" />}>
                        Manage Lessons
                      </Button>
                    </Link>
                    <Link to={`/courses/${id}/settings`}>
                      <Button variant="primary" icon={<Settings className="w-5 h-5" />}>
                        Settings
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Teacher Info Banner */}
        {isOwner && (
          <Card className="p-4 bg-accent/5 dark:bg-accent-dark/5 border-accent/20 dark:border-accent-dark/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 dark:bg-accent-dark/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-accent dark:text-accent-dark" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                  You are viewing your course as an instructor
                </p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Use the buttons above to manage lessons and course settings
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Lessons */}
        <div>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
            Course Content
          </h2>

          {!course.lessons || course.lessons.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
              <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                No lessons yet
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                {isOwner ? 'Start adding lessons to your course' : 'The instructor is working on adding content'}
              </p>
              {isOwner && (
                <Link to={`/courses/${id}/lessons`}>
                  <Button variant="primary" icon={<FileText className="w-5 h-5" />}>
                    Add Lessons
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className="space-y-3">
              {course.lessons.map((lesson: Lesson, index: number) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    hover={isEnrolled || isOwner}
                    className="p-4 cursor-pointer"
                    onClick={() => (isEnrolled || isOwner) && console.log('Open lesson', lesson.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 dark:bg-accent-dark/10 flex items-center justify-center flex-shrink-0">
                        {lesson.videoUrl ? (
                          <PlayCircle className="w-6 h-6 text-accent dark:text-accent-dark" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-accent dark:text-accent-dark" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
                          {index + 1}. {lesson.title}
                        </h4>
                        {lesson.content && (
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-1">
                            {lesson.content.substring(0, 100)}...
                          </p>
                        )}
                      </div>

                      {lesson.duration && (lesson.duration as any) > 0 && (
                        <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                      )}

                      {!isEnrolled && !isOwner && (
                        <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          🔒
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
