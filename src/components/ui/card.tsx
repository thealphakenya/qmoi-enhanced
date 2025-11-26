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

export default Card;
