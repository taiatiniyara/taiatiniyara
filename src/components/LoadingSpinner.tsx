import { ClipLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 50, 
  color = '#3b82f6',
  className = 'container mx-auto px-4 py-16'
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="flex justify-center items-center min-h-100">
        <ClipLoader color={color} size={size} />
      </div>
    </div>
  );
}
