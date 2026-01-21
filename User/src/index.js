import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import DataCleanupService from './services/dataCleanupService';

// Initialize data cleanup on app start
DataCleanupService.initialize();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);