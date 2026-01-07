import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export function Loader({ size = 'md', fullScreen = false, text, className }: LoaderProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', dot: 'w-2 h-2' },
    md: { container: 'w-12 h-12', dot: 'w-3 h-3' },
    lg: { container: 'w-16 h-16', dot: 'w-4 h-4' },
  };

  const containerVariants = {
    start: { rotate: 0 },
    end: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    start: { scale: 0.8, opacity: 0.5 },
    end: {
      scale: 1.2,
      opacity: 1,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  const loader = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={cn('relative', sizes[size].container)}
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute rounded-full',
              sizes[size].dot,
              'bg-gradient-to-br from-accent to-accent-dark dark:from-accent-dark dark:to-accent'
            )}
            style={{
              top: i === 0 || i === 1 ? '0%' : 'auto',
              bottom: i === 2 || i === 3 ? '0%' : 'auto',
              left: i === 0 || i === 2 ? '0%' : 'auto',
              right: i === 1 || i === 3 ? '0%' : 'auto',
            }}
            variants={dotVariants}
            initial="start"
            animate="end"
            transition={{ delay: i * 0.15 }}
          />
        ))}
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-light-bg dark:bg-dark-bg z-50">
        <div className="text-center">
          {loader}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gradient mb-2">IQ Didactic</h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Loading your experience...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return <div className={cn('flex justify-center p-4', className)}>{loader}</div>;
}
