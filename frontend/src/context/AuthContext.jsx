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

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : [];
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
    
    // Validate required fields
    if (!email || !password) {
      return { success: false, message: 'Lütfen e-posta ve şifrenizi girin.' };
    }

    // Check if user is registered
    const existingUser = registeredUsers.find(u => u.email === email);
    if (!existingUser) {
      return { success: false, message: 'Bu e-posta adresine ait bir hesap bulunamadı.' };
    }

    // Check password
    if (existingUser.password !== password) {
      return { success: false, message: 'Hatalı şifre girdiniz.' };
    }

    // Login successful
    setUser(existingUser);
    localStorage.setItem('user', JSON.stringify(existingUser));
    return { success: true, user: existingUser };
  };

  const customerRegister = (userData) => {
    // Basic validation
    if (!userData.email || !userData.password || !userData.firstName) {
      return { success: false, message: 'Lütfen tüm zorunlu alanları doldurun.' };
    }

    // Check if email already registered
    if (registeredUsers.some(u => u.email === userData.email)) {
      return { success: false, message: 'Bu e-posta adresi zaten kullanılıyor.' };
    }

    // Return success to proceed to OTP
    return { success: true };
  };

  const finalizeRegistration = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.phone,
      password: userData.password // In real app, don't store plain text
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      isAdmin, 
      user, 
      login, 
      customerLogin, 
      customerRegister, 
      finalizeRegistration,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
