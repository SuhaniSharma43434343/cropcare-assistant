import React from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  UserGroupIcon, 
  TruckIcon,
  MapPinIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const SmartRemindersCard = ({ reminders }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Smart Reminders</h3>
        <ClockIcon className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {reminders.map((reminder, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md dashboard-transition">
            <input 
              type="checkbox" 
              className="h-4 w-4 text-emerald-600 rounded focus-ring" 
              defaultChecked={reminder.completed}
            />
            <div className="flex-1">
              <span className={`text-sm ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {reminder.task}
              </span>
              <div className="text-xs text-gray-500">{reminder.timing}</div>
            </div>
            {reminder.priority === 'high' && (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium focus-ring rounded-md py-2">
        + Add New Reminder
      </button>
    </div>
  );
};

const LabourAvailabilityCard = ({ labourData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Labour Availability</h3>
        <UserGroupIcon className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <UserGroupIcon className="h-8 w-8 text-emerald-600" />
        </div>
        
        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-900">{labourData.available}</p>
          <p className="text-sm text-gray-600">Available Workers</p>
        </div>
        
        <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>Within {labourData.radius}km radius</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Daily Rate:</span>
            <span className="font-medium">₹{labourData.dailyRate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Avg Rating:</span>
            <span className="font-medium">⭐ {labourData.rating}/5</span>
          </div>
        </div>
        
        <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 dashboard-transition focus-ring">
          Hire Workers
        </button>
      </div>
    </div>
  );
};

const MachineryRentalCard = ({ machineryData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Machinery Rental</h3>
        <TruckIcon className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <TruckIcon className="h-8 w-8 text-blue-600" />
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Featured Equipment</p>
          <p className="text-lg font-semibold text-gray-900">{machineryData.featured.name}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-center text-lg font-bold text-gray-900 mb-1">
            <CurrencyRupeeIcon className="h-5 w-5" />
            {machineryData.featured.rate}/hr
          </div>
          <div className="text-xs text-gray-600">
            {machineryData.dealers} dealers nearby
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-4">
          Includes operator • Fuel extra
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dashboard-transition focus-ring">
          View All Equipment
        </button>
      </div>
    </div>
  );
};

const OperationalCards = () => {
  const reminders = [
    { task: 'Apply Neem Oil (Tomato)', timing: 'Today, 6:00 AM', completed: false, priority: 'high' },
    { task: 'Harvest Wheat Field A', timing: 'Tomorrow, 7:00 AM', completed: false, priority: 'medium' },
    { task: 'Fertilizer Application', timing: 'In 3 days', completed: false, priority: 'low' },
    { task: 'Irrigation Check', timing: 'Completed', completed: true, priority: 'medium' }
  ];

  const labourData = {
    available: 5,
    radius: 2,
    dailyRate: 350,
    rating: 4.2
  };

  const machineryData = {
    featured: {
      name: 'Combine Harvester',
      rate: 800
    },
    dealers: 3
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SmartRemindersCard reminders={reminders} />
      <LabourAvailabilityCard labourData={labourData} />
      <MachineryRentalCard machineryData={machineryData} />
    </div>
  );
};

export default OperationalCards;