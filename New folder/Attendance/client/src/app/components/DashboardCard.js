import React from 'react';

const DashboardCard = ({ title, value, icon, bgColor, textColor }) => {
  return (
    
    <div className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 ${bgColor}`}>
      <div className={`p-3 rounded-full text-3xl ${textColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
        <p className={`text-4xl font-extrabold ${textColor}`}>{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;