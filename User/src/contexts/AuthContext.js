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

  const checkAuthStatus = () => {
    try {
      const userData = localStorage.getItem('cropcare_user');
      const authToken = localStorage.getItem('cropcare_token');
      
      if (userData && authToken) {
        dispatch({
          type: 'LOGIN',
          payload: JSON.parse(userData)
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check stored users
      const users = JSON.parse(localStorage.getItem('cropcare_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const authToken = `token_${Date.now()}_${Math.random()}`;
      const userData = { ...user };
      delete userData.password; // Don't store password in user object

      localStorage.setItem('cropcare_user', JSON.stringify(userData));
      localStorage.setItem('cropcare_token', authToken);

      dispatch({
        type: 'LOGIN',
        payload: userData
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('cropcare_users') || '[]');
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        selectedCrops: userData.selectedCrops || [],
        farmDetails: userData.farmDetails || {},
        createdAt: new Date().toISOString(),
        profileComplete: true
      };

      users.push(newUser);
      localStorage.setItem('cropcare_users', JSON.stringify(users));

      // Auto login after signup
      const authToken = `token_${Date.now()}_${Math.random()}`;
      const userDataForStorage = { ...newUser };
      delete userDataForStorage.password;

      localStorage.setItem('cropcare_user', JSON.stringify(userDataForStorage));
      localStorage.setItem('cropcare_token', authToken);

      dispatch({
        type: 'LOGIN',
        payload: userDataForStorage
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('cropcare_user');
    localStorage.removeItem('cropcare_token');
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