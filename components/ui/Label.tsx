import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

export function Label({ children, className = '', ...props }: LabelProps) {
    return (
        <label
            className={`block text-gray-700 dark:text-gray-300 font-medium mb-1 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
}
