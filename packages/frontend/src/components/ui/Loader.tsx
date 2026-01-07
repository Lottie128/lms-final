import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function Loader({ fullScreen = false, size = 'md', text }: LoaderProps) {
  const loader = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer spinning ring */}
        <motion.div
          className={cn(
            sizeClasses[size],
            'rounded-full border-4 border-light-surface-secondary dark:border-dark-surface-secondary border-t-accent dark:border-t-accent-dark'
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner pulsing circle */}
        <motion.div
          className={cn(
            'absolute inset-0 m-auto',
            size === 'sm' && 'w-4 h-4',
            size === 'md' && 'w-6 h-6',
            size === 'lg' && 'w-8 h-8',
            'rounded-full bg-accent dark:bg-accent-dark'
          )}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {text && (
        <motion.p
          className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return loader;
}

// Spinner component for inline use
export function Spinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <motion.div
      className={cn(
        sizeClasses[size],
        'rounded-full border-4 border-current border-t-transparent',
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}
