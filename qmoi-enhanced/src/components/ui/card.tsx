import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={
      "rounded-lg border bg-card text-card-foreground shadow-sm" +
      (className ? ` ${className}` : "")
    }
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={
      "flex flex-col space-y-1.5 p-6" +
      (className ? ` ${className}` : "")
    }
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3
    ref={ref as any}
    className={
      "text-2xl font-semibold leading-none tracking-tight" +
      (className ? ` ${className}` : "")
    }
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={
      "p-6 pt-0" +
      (className ? ` ${className}` : "")
    }
    {...props}
  />
));
CardContent.displayName = "CardContent";
