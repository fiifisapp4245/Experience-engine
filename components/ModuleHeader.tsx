import type { ReactNode } from "react";

type ModuleHeaderProps = {
  number: number;
  title: string;
  description: string;
  right?: ReactNode;
};

export function ModuleHeader({ number, title, description, right }: ModuleHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 md:mb-8">
      <div>
        <div className="text-xs font-medium tracking-widest text-brand mb-1.5">
          MODULE {String(number).padStart(2, "0")}
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">{description}</p>
      </div>
      {right}
    </div>
  );
}
