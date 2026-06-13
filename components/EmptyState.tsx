"use client";

import { Search } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = <Search size={32} />, title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-bg-elevated text-[32px]">
        {icon}
      </div>
      <div>
        <h3 className="mb-1.5 text-lg font-bold text-text-primary">
          {title}
        </h3>
        {description && (
          <p className="m-0 max-w-[320px] text-sm text-text-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
