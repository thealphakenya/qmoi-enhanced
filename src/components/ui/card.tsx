import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = "", ...props }) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`} {...props}>
      {title ? <div className="mb-2 text-lg font-semibold">{title}</div> : null}
      <div>{children}</div>
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`mb-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`text-sm ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
