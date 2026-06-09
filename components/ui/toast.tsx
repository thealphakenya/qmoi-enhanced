"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from '@/lib/utils';


type ToastProps = React.ComponentPropsWithoutRef<"div"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed inset-0 z-[100] pointer-events-none">{children}</div>
);

export const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { className?: string }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "pointer-events-none fixed top-4 right-4 z-[1000] flex max-w-sm flex-col gap-3",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

export const Toast = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { variant?: "default" | "destructive" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "pointer-events-auto relative rounded-lg border bg-white p-4 shadow-lg transition-all",
      variant === "destructive"
        ? "border-red-300 bg-red-50 text-red-900"
        : "border-slate-200 bg-slate-950 text-slate-50",
      className,
    )}
    {...props}
  />
));
Toast.displayName = "Toast";

export const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h3"> & { className?: string }
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p"> & { className?: string }
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("mt-1 text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

export const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { className?: string }
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "ml-4 rounded-md border px-3 py-1 text-sm font-medium transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

export const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { className?: string }
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Close"
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-slate-400 transition hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400",
      className,
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

export type { ToastProps, ToastActionElement };
