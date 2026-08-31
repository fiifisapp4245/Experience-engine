import type { ReactNode } from "react";
import type { ModuleGroup } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type ModuleHeaderProps = {
  number: number;
  title: string;
  description: string;
  section?: ModuleGroup;
  align?: "left" | "center";
  right?: ReactNode;
};

// Module number/section used to be shown as an eyebrow line above the
// title — now that navigation context lives in the bottom nav instead of a
// sidebar, the eyebrow is dropped in favor of a cleaner title block.
export function ModuleHeader({ title, description, align = "left", right }: ModuleHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex items-start gap-4 mb-6 md:mb-8",
        centered ? "flex-col items-center text-center" : "justify-between"
      )}
    >
      <div className={centered ? "flex flex-col items-center" : undefined}>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className={cn("text-sm text-muted-foreground mt-1.5", centered ? "max-w-lg" : "max-w-xl")}>
          {description}
        </p>
      </div>
      {right}
    </div>
  );
}
