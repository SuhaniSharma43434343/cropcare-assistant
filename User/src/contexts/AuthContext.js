import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = localStorage.getItem('cropcare_user');
      const authToken = localStorage.getItem('cropcare_token');
      
      if (userData && authToken) {
        // Validate token with backend
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            dispatch({
              type: 'LOGIN',
              payload: result.user
            });
            return;
          }
        }
        
        // Token is invalid, clear storage
        localStorage.removeItem('cropcare_user');
        localStorage.removeItem('cropcare_token');
        localStorage.removeItem('token');
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('cropcare_user');
      localStorage.removeItem('cropcare_token');
      localStorage.removeItem('token');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (phone, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, password })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      if (result.success && result.token && result.user) {
        localStorage.setItem('cropcare_user', JSON.stringify(result.user));
        localStorage.setItem('cropcare_token', result.token);
        localStorage.setItem('token', result.token); // Fallback for compatibility

        dispatch({
          type: 'LOGIN',
          payload: result.user
        });

        return { success: true };
      } else {
        throw new Error(result.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { 
        success: false, 
        error: error.message || 'Network error. Please check your connection and try again.' 
      };
    }
  };

  const signup = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: userData.phone,
          password: userData.password
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      if (result.success && result.token && result.user) {
        localStorage.setItem('cropcare_user', JSON.stringify(result.user));
        localStorage.setItem('cropcare_token', result.token);
        localStorage.setItem('token', result.token); // Fallback for compatibility

        dispatch({
          type: 'LOGIN',
          payload: result.user
        });

        return { success: true };
      } else {
        throw new Error(result.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { 
        success: false, 
        error: error.message || 'Network error. Please check your connection and try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('cropcare_user');
    localStorage.removeItem('cropcare_token');
    localStorage.removeItem('token'); // Remove fallback token
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (profileData) => {
    try {
      const updatedUser = { ...state.user, ...profileData };
      localStorage.setItem('cropcare_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('cropcare_users') || '[]');
      const userIndex = users.findIndex(u => u.id === state.user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...profileData };
        localStorage.setItem('cropcare_users', JSON.stringify(users));
      }

      dispatch({
        type: 'UPDATE_PROFILE',
        payload: profileData
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};