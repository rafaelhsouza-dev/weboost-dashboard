import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helpText, className = '', id, ...props }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          block w-full rounded-lg border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          px-3 py-2.5 shadow-sm placeholder:text-gray-400
          focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
          transition-all sm:text-sm
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
  );
};