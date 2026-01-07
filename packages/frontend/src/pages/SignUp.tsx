import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Card } from '../components/ui/Card';
import { UserRole } from 'shared/types';

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name, formData.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-light-bg via-light-surface-secondary to-light-bg dark:from-dark-bg dark:via-dark-surface-secondary dark:to-dark-bg">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-gradient mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            IQ Didactic
          </motion.h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Join thousands of learners worldwide
          </p>
        </div>

        {/* Signup Card */}
        <Card hover={false} className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
              Create Account
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Start your learning journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-error/10 dark:bg-error-dark/10 border border-error dark:border-error-dark text-error dark:text-error-dark text-sm"
              >
                {error}
              </motion.div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="w-5 h-5" />}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['STUDENT', 'TEACHER'] as const).map(role => (
                  <motion.button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === role
                        ? 'border-accent dark:border-accent-dark bg-accent/10 dark:bg-accent-dark/10'
                        : 'border-light-border dark:border-dark-border hover:border-accent/50 dark:hover:border-accent-dark/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserCircle className="w-8 h-8 mx-auto mb-2 text-accent dark:text-accent-dark" />
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {role.charAt(0) + role.slice(1).toLowerCase()}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent dark:text-accent-dark hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
