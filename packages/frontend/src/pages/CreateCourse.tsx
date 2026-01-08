import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Upload } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../lib/api';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Only include thumbnail if it's not empty
      const payload: any = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category.trim(),
      };
      
      if (data.thumbnail && data.thumbnail.trim()) {
        payload.thumbnail = data.thumbnail.trim();
      }
      
      const response = await api.post('/courses', payload);
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/courses/${data.data.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend validation
    if (formData.title.trim().length < 3) {
      alert('Course title must be at least 3 characters long');
      return;
    }
    
    if (formData.description.trim().length < 10) {
      alert('Course description must be at least 10 characters long');
      return;
    }
    
    if (!formData.category.trim()) {
      alert('Please select a category');
      return;
    }
    
    createMutation.mutate(formData);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/courses')}
            className="mb-6"
          >
            Back to Courses
          </Button>

          <Card className="p-8">
            <CardHeader className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Create New Course</CardTitle>
                  <CardDescription>Fill in the details to create your course</CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {createMutation.isError && (
                <div className="p-4 rounded-lg bg-error/10 dark:bg-error-dark/10 border border-error dark:border-error-dark text-error dark:text-error-dark">
                  {(createMutation.error as any)?.response?.data?.error || 'Failed to create course. Please try again.'}
                </div>
              )}

              <Input
                label="Course Title"
                placeholder="e.g., Introduction to Web Development"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                minLength={3}
              />

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Description *
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:border-transparent transition-all resize-none"
                  rows={5}
                  placeholder="Describe what students will learn in this course... (minimum 10 characters)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  minLength={10}
                />
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                  {formData.description.length}/10 characters minimum
                </p>
              </div>

              <Input
                label="Category"
                placeholder="e.g., Programming, Design, Business"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />

              <Input
                label="Thumbnail URL (Optional)"
                placeholder="https://example.com/image.jpg"
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                icon={<Upload className="w-5 h-5" />}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/courses')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={createMutation.isPending}
                  className="flex-1"
                  icon={<BookOpen className="w-5 h-5" />}
                >
                  Create Course
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
