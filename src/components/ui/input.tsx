import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label ? <label className="mb-1 text-sm text-gray-700">{label}</label> : null}
      <input className="px-2 py-1 rounded border border-gray-300" {...props} />
    </div>
  );
};

export default Input;
