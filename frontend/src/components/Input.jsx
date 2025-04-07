import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green-500 ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-700 placeholder-gray-400 font-poppins`}
          required={required}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600 font-poppins">{error}</p>}
    </div>
  );
};

export default Input; 