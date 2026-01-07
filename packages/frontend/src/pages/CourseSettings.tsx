import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings, Save, Trash2, Eye, EyeOff, Users, Lock, Globe } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader } from '../components/ui/Loader';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function CourseSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data.data;
    },
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    isPublished: false,
    maxStudents: 0,
    enrollmentType: 'OPEN',
  });

  // Set form data when course loads
  useState(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        thumbnail: course.thumbnail || '',
        isPublished: course.isPublished || false,
        maxStudents: course.maxStudents || 0,
        enrollmentType: course.enrollmentType || 'OPEN',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/courses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      alert('Course updated successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update course');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      alert('Course deleted successfully!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete course');
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const handlePublishToggle = () => {
    const newStatus = !formData.isPublished;
    setFormData({ ...formData, isPublished: newStatus });
    updateMutation.mutate({ ...formData, isPublished: newStatus });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader size="lg" text="Loading course settings..." />
      </DashboardLayout>
    );
  }

  // Check if user owns this course
  if (course?.teacherId !== user?.id && user?.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <Card className="p-12 text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
          <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Access Denied
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            You don't have permission to edit this course.
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Course Settings</h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Manage course details and publishing options
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/courses/${id}`)}
          >
            Back to Course
          </Button>
        </div>

        {/* Publishing Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {formData.isPublished ? (
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-500" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <EyeOff className="w-6 h-6 text-yellow-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {formData.isPublished
                      ? 'Students can enroll and access this course'
                      : 'Only you can see this course'}
                  </p>
                </div>
              </div>
              <Button
                variant={formData.isPublished ? 'outline' : 'primary'}
                onClick={handlePublishToggle}
                loading={updateMutation.isPending}
                icon={formData.isPublished ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              >
                {formData.isPublished ? 'Unpublish' : 'Publish Course'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Introduction to Web Development"
              />
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:border-transparent transition-all"
                  placeholder="Describe what students will learn in this course..."
                />
              </div>
              <Input
                label="Thumbnail URL"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </Card>
        </motion.div>

        {/* Enrollment Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent dark:text-accent-dark" />
                <CardTitle>Enrollment Settings</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Enrollment Type
                </label>
                <select
                  value={formData.enrollmentType}
                  onChange={(e) => setFormData({ ...formData, enrollmentType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:border-transparent transition-all"
                >
                  <option value="OPEN">Open - Anyone can enroll</option>
                  <option value="APPROVAL">Approval Required</option>
                  <option value="INVITE">Invite Only</option>
                  <option value="CLOSED">Closed - No enrollments</option>
                </select>
              </div>
              <Input
                label="Maximum Students (0 for unlimited)"
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <div className="p-4 bg-light-surface-secondary dark:bg-dark-surface-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Current Enrollments
                  </span>
                  <span className="text-sm font-semibold text-accent dark:text-accent-dark">
                    {course?._count?.enrollments || 0}
                    {formData.maxStudents > 0 && ` / ${formData.maxStudents}`}
                  </span>
                </div>
                {formData.maxStudents > 0 && (
                  <div className="w-full h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(((course?._count?.enrollments || 0) / formData.maxStudents) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
            icon={<Trash2 className="w-5 h-5" />}
          >
            Delete Course
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={updateMutation.isPending}
            icon={<Save className="w-5 h-5" />}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
