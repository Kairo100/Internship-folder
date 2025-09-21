import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar = ({ progress, className }: ProgressBarProps) => {
  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-primary">Progress</span>
        <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="h-full journey-progress rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-secondary animate-shimmer"></div>
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Processing</span>
        <span>Transcribing</span>
        <span>Enhancing</span>
        <span>Translating</span>
        <span>Complete</span>
      </div>
    </div>
  );
};