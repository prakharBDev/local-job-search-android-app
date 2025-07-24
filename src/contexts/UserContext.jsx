import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const { userRoles } = useAuth();

  // Determine current mode based on user roles from AuthContext
  const currentMode = useMemo(() => {
    if (userRoles?.isCompany) {
      return 'poster';
    }
    return 'seeker';
  }, [userRoles]);

  const contextValue = useMemo(() => ({
    currentMode,
    isSeekerMode: currentMode === 'seeker',
    isPosterMode: currentMode === 'poster',
  }), [currentMode]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export { UserContext };
