import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AlertBell from '../alerts/AlertBell';
import AlertCenter from '../alerts/AlertCenter';

const Header = ({ title, showBell = true, className = '' }) => {
  const [isAlertCenterOpen, setIsAlertCenterOpen] = useState(false);

  return (
    <>
      <header className={`bg-white border-b border-gray-200 ${className}`}>
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex-1">
            {title && (
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            )}
          </div>
          
          {showBell && (
            <div className="flex items-center space-x-2">
              <AlertBell 
                onClick={() => setIsAlertCenterOpen(true)}
                className="hover:bg-gray-100"
              />
            </div>
          )}
        </div>
      </header>

      <AlertCenter 
        isOpen={isAlertCenterOpen}
        onClose={() => setIsAlertCenterOpen(false)}
      />
    </>
  );
};

export default Header;