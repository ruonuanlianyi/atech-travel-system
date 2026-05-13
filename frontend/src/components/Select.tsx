import React from 'react';
import './Select.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  fullWidth = false,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className={`select-wrapper ${fullWidth ? 'select-full' : ''}`}>
      {label && <label className="select-label">{label}</label>}
      <select
        className={`select ${error ? 'select-error' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error-text">{error}</span>}
    </div>
  );
};

export default Select;
