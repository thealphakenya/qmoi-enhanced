import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, className = "", children, ...props }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label ? <label className="mb-1 text-sm text-gray-700">{label}</label> : null}
      <select className="px-2 py-1 rounded border border-gray-300" {...props}>
        {children}
      </select>
    </div>
  );
};

export default Select;
