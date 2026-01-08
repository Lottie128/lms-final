import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, GripVertical, Save, FileText, Video } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader } from '../components/ui/Loader';
import { api } from '../lib/api';

export default function LessonManagement() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    duration: 0,
  });

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}`);
      return response.data.data;
    },
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}/lessons`);
      return response.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Send courseId in body, not in URL
      const response = await api.post('/lessons', { ...data, courseId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      setIsCreating(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: any) => {
      const response = await api.put(`/lessons/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      setEditingLesson(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const response = await api.delete(`/lessons/${lessonId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      videoUrl: '',
      duration: 0,
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (editingLesson) {
      updateMutation.mutate({ id: editingLesson.id, data: formData });
    }
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || 0,
    });
    setIsCreating(false);
  };

  const handleDelete = (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      deleteMutation.mutate(lessonId);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingLesson(null);
    resetForm();
  };

  if (courseLoading || lessonsLoading) {
    return (
      <DashboardLayout>
        <Loader size="lg" text="Loading lessons..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Manage Lessons</h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              {course?.title}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(`/courses/${courseId}`)}>
              Back to Course
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => {
                setIsCreating(true);
                setEditingLesson(null);
                resetForm();
              }}
              disabled={isCreating || editingLesson}
            >
              Add Lesson
            </Button>
          </div>
        </div>

        {/* Create/Edit Form */}
        <AnimatePresence>
          {(isCreating || editingLesson) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <Input
                    label="Lesson Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Introduction to React"
                    icon={<FileText className="w-5 h-5" />}
                  />
                  <div>
                    <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:border-transparent transition-all"
                      placeholder="Write your lesson content here... You can add instructions, explanations, and resources."
                    />
                  </div>
                  <Input
                    label="Video URL (Optional)"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    icon={<Video className="w-5 h-5" />}
                  />
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    placeholder="30"
                  />
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={editingLesson ? handleUpdate : handleCreate}
                      loading={createMutation.isPending || updateMutation.isPending}
                      icon={<Save className="w-5 h-5" />}
                    >
                      {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lessons List */}
        <div>
          <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
            Course Lessons ({lessons?.length || 0})
          </h2>

          {!lessons || lessons.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
              <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                No lessons yet
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Create your first lesson to start building your course
              </p>
              <Button
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setIsCreating(true)}
              >
                Create First Lesson
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson: any, index: number) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card hover className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="cursor-move">
                        <GripVertical className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-1">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <span>Lesson {index + 1}</span>
                          {lesson.duration > 0 && <span>{lesson.duration} min</span>}
                          {lesson.videoUrl && (
                            <div className="flex items-center gap-1">
                              <Video className="w-4 h-4" />
                              <span>Video</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(lesson)}
                          icon={<Edit className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lesson.id)}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
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
