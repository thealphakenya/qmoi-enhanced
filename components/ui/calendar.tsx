"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Local minimal calendar shim to avoid react-day-picker dependency
export type CalendarProps = React.ComponentProps<"div"> & {
  showOutsideDays?: boolean;
  classNames?: Record<string, string>;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="text-sm font-medium">Calendar Component</div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
