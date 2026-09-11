import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password) => {
    if (username === 'admin' || username === 'admin@admin.com') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return { success: true };
    }
    return { success: false, message: 'Hatalı yönetici bilgileri' };
  };

  const customerLogin = (email, password) => {
    if (email === 'admin' || email === 'admin@admin.com') {
      return login(email, password);
    }
    
    // Mock customer login
    if (email && password) {
      const mockUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        phone: '5551234567'
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    }
    
    return { success: false, message: 'Lütfen e-posta ve şifrenizi girin.' };
  };

  const customerRegister = (userData) => {
    // Mock customer registration
    if (userData.email && userData.password && userData.firstName) {
      const newUser = {
        id: Date.now().toString(),
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
    return { success: false, message: 'Lütfen tüm zorunlu alanları doldurun.' };
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, user, login, customerLogin, customerRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
