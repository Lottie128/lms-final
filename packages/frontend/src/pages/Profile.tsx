import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Award, Edit2, Save } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  const stats = [
    { label: 'Role', value: user?.role || 'N/A', icon: Award },
    { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString(), icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">My Profile</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                    {user?.name}
                  </h2>
                  <span className="px-3 py-1 bg-accent/10 dark:bg-accent-dark/10 text-accent dark:text-accent-dark text-sm font-medium rounded-full">
                    {user?.role}
                  </span>
                </div>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {user?.email}
                </p>
              </div>
              <Button
                variant={isEditing ? 'primary' : 'outline'}
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                icon={isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-accent dark:text-accent-dark" />
                      <div>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {stat.label}
                        </p>
                        <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit Form */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-6 border-t border-light-border dark:border-dark-border"
              >
                <Input
                  label="Full Name"
                  icon={<User className="w-5 h-5" />}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  icon={<Mail className="w-5 h-5" />}
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  disabled
                />
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Note: Email cannot be changed. Contact support if you need to update your email.
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
