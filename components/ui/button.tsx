import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'destructive' | 'default';
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', className, children, ...props }) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500': variant === 'primary',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'destructive',
          'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500': variant === 'default',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };