import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const login = (username, password) => {
    if (username === 'admin' && password === '123456') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return { success: true };
    }
    return { success: false, message: 'Hatalı kullanıcı adı veya şifre' };
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
