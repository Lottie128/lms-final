import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Globe, Moon, Sun, Check } from 'lucide-react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    courseUpdates: true,
    newMessages: true,
  });

  const settingsSections = [
    {
      title: 'Appearance',
      description: 'Customize how IQ Didactic looks',
      icon: theme === 'dark' ? Moon : Sun,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                Theme
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Current: {theme === 'dark' ? 'Dark' : 'Light'} Mode
              </p>
            </div>
            <Button
              variant="outline"
              onClick={toggleTheme}
              icon={theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      content: (
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-light-text-primary dark:text-dark-text-primary capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value
                    ? 'bg-accent dark:bg-accent-dark'
                    : 'bg-light-border dark:bg-dark-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Security',
      description: 'Manage your account security',
      icon: Lock,
      content: (
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Active Sessions
          </Button>
        </div>
      ),
    },
    {
      title: 'Language & Region',
      description: 'Set your language and region preferences',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Language
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Timezone
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary">
              <option>UTC</option>
              <option>IST (India Standard Time)</option>
              <option>EST (Eastern Time)</option>
              <option>PST (Pacific Time)</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Settings</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 dark:bg-accent-dark/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent dark:text-accent-dark" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <div className="pt-4 border-t border-light-border dark:border-dark-border">
                    {section.content}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="primary" icon={<Check className="w-5 h-5" />}>
            Save All Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
