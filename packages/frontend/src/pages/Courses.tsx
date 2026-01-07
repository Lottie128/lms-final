import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Users, Clock } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { api } from '../lib/api';
import { COURSE_CATEGORIES } from 'shared/constants';
import type { Course } from 'shared/types';

export default function Courses() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['courses', search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const response = await api.get(`/courses?${params}`);
      return response.data.data;
    },
  });

  const courses = data?.courses || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            Explore Courses
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Discover your next learning adventure
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses..."
                icon={<Search className="w-5 h-5" />}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="input"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {COURSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" text="Loading courses..." />
          </div>
        ) : courses.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              No courses found
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Try adjusting your search or filters
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: Course, index: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/courses/${course.id}`}>
                  <Card className="h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-primary rounded-t-xl relative overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-light-surface dark:bg-dark-surface text-xs font-medium">
                        {course.category}
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <Users className="w-4 h-4" />
                        <span>{course.teacher?.name || 'Unknown'}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>{(course as any)._count?.lessons || 0} lessons</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Course
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
