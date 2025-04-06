import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  buttonLink, 
  bgColor = 'bg-green-50', 
  borderColor = 'border-green-200',
  textColor = 'text-green-800',
  descriptionColor = 'text-green-700',
  buttonColor = 'bg-green-600 hover:bg-green-700'
}) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg border ${borderColor} shadow-sm transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center mb-3">
        {icon && <span className="mr-3 text-2xl">{icon}</span>}
        <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
      </div>
      <p className={`${descriptionColor} mb-4`}>{description}</p>
      {buttonLink && (
        <Link 
          to={buttonLink} 
          className={`${buttonColor} text-white px-4 py-2 rounded-md inline-block transition-colors duration-200`}
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default DashboardCard; 