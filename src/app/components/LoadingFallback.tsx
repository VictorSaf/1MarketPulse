import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
}

export function LoadingFallback({ message = 'Loading...' }: LoadingFallbackProps) {
  return (
    <Card className="p-8 bg-gray-800/50 border-white/10">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
        <span className="text-gray-400">{message}</span>
      </div>
    </Card>
  );
}

export function TabLoadingFallback() {
  return (
    <div className="space-y-6">
      <LoadingFallback message="Loading tab content..." />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <Card className="p-6 bg-gray-800/50 border-white/10 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/3 mb-4" />
      <div className="h-8 bg-gray-700 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-700 rounded w-2/3" />
    </Card>
  );
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default LoadingFallback;
