import React, { createContext, useContext, useState, useEffect } from 'react';

const InvestorAuthContext = createContext();

export const useInvestorAuth = () => {
  const context = useContext(InvestorAuthContext);
  if (!context) {
    throw new Error('useInvestorAuth must be used within an InvestorAuthProvider');
  }
  return context;
};

export const InvestorAuthProvider = ({ children }) => {
  const [investor, setInvestor] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('investorToken');
    const storedInvestor = localStorage.getItem('investorData');
    
    if (storedToken && storedInvestor) {
      setToken(storedToken);
      setInvestor(JSON.parse(storedInvestor));
    }
    setLoading(false);
  }, []);

  const login = (investorData, authToken) => {
    setInvestor(investorData);
    setToken(authToken);
    localStorage.setItem('investorToken', authToken);
    localStorage.setItem('investorData', JSON.stringify(investorData));
  };

  const logout = () => {
    setInvestor(null);
    setToken(null);
    localStorage.removeItem('investorToken');
    localStorage.removeItem('investorData');
  };

  const value = {
    investor,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!investor
  };

  return (
    <InvestorAuthContext.Provider value={value}>
      {children}
    </InvestorAuthContext.Provider>
  );
};