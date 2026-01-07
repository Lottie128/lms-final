import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export function Loader({ size = 'md', fullScreen = false, className }: LoaderProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const loader = (
    <Loader2 className={cn('animate-spin text-indigo-600', sizes[size], className)} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        {loader}
      </div>
    );
  }

  return <div className="flex justify-center p-4">{loader}</div>;
}
