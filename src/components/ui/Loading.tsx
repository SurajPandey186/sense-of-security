import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  variant?: 'spinner' | 'dots';
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const dotSizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const LoadingDots = () => (
    <div className="flex items-center gap-1">
      <div className={`${dotSizeClasses[size]} bg-primary rounded-full animate-pulse`} style={{ animationDelay: '0ms' }} />
      <div className={`${dotSizeClasses[size]} bg-primary rounded-full animate-pulse`} style={{ animationDelay: '200ms' }} />
      <div className={`${dotSizeClasses[size]} bg-primary rounded-full animate-pulse`} style={{ animationDelay: '400ms' }} />
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {variant === 'spinner' ? (
        <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
      ) : (
        <LoadingDots />
      )}
      {text && (
        <p className={`${textSizeClasses[size]} text-muted-foreground font-cyber`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
