import React, { useState } from 'react';
import { 
  HomeIcon, 
  CameraIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  UserGroupIcon,
  TruckIcon,
  HandshakeIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = ({ children, currentPage = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/dashboard', current: currentPage === 'Dashboard' },
    { name: 'Disease Detection', icon: CameraIcon, href: '/disease-detection', current: currentPage === 'Disease Detection' },
    { name: 'Treatment Library', icon: BookOpenIcon, href: '/treatments', current: currentPage === 'Treatment Library' },
    { name: 'Market Rates', icon: ChartBarIcon, href: '/market-rates', current: currentPage === 'Market Rates' },
    { name: 'Labour Hire', icon: UserGroupIcon, href: '/labour', current: currentPage === 'Labour Hire' },
    { name: 'Machinery', icon: TruckIcon, href: '/machinery', current: currentPage === 'Machinery' },
    { name: 'Investment', icon: HandshakeIcon, href: '/investment', current: currentPage === 'Investment' },
  ];

  const secondaryNavigation = [
    { name: 'Settings', icon: Cog6ToothIcon, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus-ring"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌱</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">CropCare AI</span>
                <span className="ml-2 text-sm text-gray-500 hidden sm:block">v2.1.0</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 status-online">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 hidden sm:block">All Services Online</span>
              </div>
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus-ring">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">Rajesh Kumar</div>
                  <div className="text-xs text-gray-500">Pune, MH</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-none border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full sidebar-scroll">
            <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Navigation</span>
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus-ring"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-md dashboard-transition focus-ring`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </a>
                );
              })}
            </nav>

            {/* Secondary Navigation */}
            <div className="border-t border-gray-200 p-4">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md dashboard-transition focus-ring"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-4 sm:p-6 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden dashboard-transition"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;