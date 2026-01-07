import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Card } from '../components/ui/Card';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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
            Enterprise Learning Management System
          </p>
        </div>

        {/* Login Card */}
        <Card hover={false} className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
              Welcome Back
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Sign in to continue your learning journey
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
              label="Email"
              type="email"
              placeholder="your@email.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-light-border dark:border-dark-border text-accent focus:ring-accent"
                />
                <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-accent dark:text-accent-dark hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              icon={<LogIn className="w-5 h-5" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-accent dark:text-accent-dark hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 glass rounded-lg text-center text-sm text-light-text-secondary dark:text-dark-text-secondary"
        >
          <p className="font-medium mb-1">Demo Credentials:</p>
          <p>Teacher: teacher@demo.com / password123</p>
          <p>Student: student@demo.com / password123</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
