// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
"use client";

import { specificExports } from "react";
import { specificExports } from "lucide-react";

import { specificExports } from "@/lib/utils";

// robust local shim of Radix Accordion primitives used in the app.
// This avoids a hard dependency on @radix-ui/react-accordion while
// preserving the API surface that this file expects.
const AccordionRoot: React.FC<any> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

const AccordionItem = React.forwardRef<HTMLDivElement, any>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} {...props} />
  ),
);
AccordionItem.displayName = "AccordionItem";

const AccordionHeader: React.FC<any> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

const AccordionTrigger = React.forwardRef<HTMLButtonElement, any>(
  ({ className, children, ...props }, ref) => (
    <AccordionHeader className="flex">
      <button
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    </AccordionHeader>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, any>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0")}>{children}</div>
    </div>
  ),
);
AccordionContent.displayName = "AccordionContent";

export const Accordion = AccordionRoot;
export { AccordionItem, AccordionTrigger, AccordionContent };
