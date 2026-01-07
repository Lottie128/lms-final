import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { supabase } from '../lib/supabase';

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token) {
          setStatus('error');
          setMessage('Invalid confirmation link');
          return;
        }

        // Supabase automatically handles email confirmation
        // Check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setStatus('error');
          setMessage(error.message);
          return;
        }

        if (session) {
          setStatus('success');
          setMessage('Your email has been confirmed successfully!');
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          setStatus('success');
          setMessage('Email confirmed! You can now sign in.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Failed to confirm email');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-light-bg via-light-surface-secondary to-light-bg dark:from-dark-bg dark:via-dark-surface-secondary dark:to-dark-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader size="lg" />
              <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                Confirming your email...
              </h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Please wait while we verify your email address
              </p>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-success/10 dark:bg-success-dark/10 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-success dark:text-success-dark" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Email Confirmed!
                </h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {message}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-error/10 dark:bg-error-dark/10 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-error dark:text-error-dark" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Confirmation Failed
                </h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {message}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Go to Login
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="w-full"
                >
                  Try Signing Up Again
                </Button>
              </div>
            </motion.div>
          )}
        </Card>

        <div className="mt-6 text-center">
          <a
            href="mailto:support@iqdidactic.com"
            className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-accent-dark inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Need help? Contact support
          </a>
        </div>
      </motion.div>
    </div>
  );
}
