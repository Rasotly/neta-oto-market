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

  const customerLogin = (email, password, captchaToken) => {
    // Simulate reCAPTCHA Verification API call
    if (!captchaToken) {
      return { success: false, message: 'Google reCAPTCHA doğrulaması eksik. Lütfen robot olmadığınızı doğrulayın.' };
    }

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

  const customerRegister = (userData, captchaToken) => {
    // Simulate reCAPTCHA Verification API call
    if (!captchaToken) {
      return { success: false, message: 'Google reCAPTCHA doğrulaması eksik. Lütfen robot olmadığınızı doğrulayın.' };
    }

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

  const resendRegistrationOtp = (email) => {
    // Simulate re-sending OTP email via SMTP
    // In a real app, this would be a POST request to '/api/auth/resend-otp'
    console.log(`[SIMULATED SMTP] Yeni doğrulama kodu ${email} adresine gönderildi.`);
    return { success: true };
  };

  const finalizeRegistration = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.phone,
      password: userData.password, // In real app, don't store plain text
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const updateUser = (newData) => {
    if (!user) return { success: false, message: 'Kullanıcı bulunamadı.' };

    const updatedUser = { ...user, ...newData };

    // Update active user state and localStorage
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update in registeredUsers array if exists
    const userIndex = registeredUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      const updatedUsersList = [...registeredUsers];
      updatedUsersList[userIndex] = updatedUser;
      setRegisteredUsers(updatedUsersList);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsersList));
    }

    return { success: true, user: updatedUser };
  };

  const updateAnyUser = (userId, newData) => {
    const updatedUsersList = registeredUsers.map(u => 
      String(u.id) === String(userId) ? { ...u, ...newData } : u
    );
    setRegisteredUsers(updatedUsersList);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsersList));
    
    // If the updated user is currently logged in, update their local state too
    if (user && String(user.id) === String(userId)) {
       setUser({ ...user, ...newData });
       localStorage.setItem('user', JSON.stringify({ ...user, ...newData }));
    }
    
    return { success: true };
  };

  const socialLogin = async (provider, token) => {
    try {
      const response = await fetch(`http://localhost:5246/api/auth/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('jwtToken', data.token); // Store real JWT
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Sosyal ağ girişi başarısız oldu.' };
      }
    } catch (error) {
      console.error("Social login error:", error);
      return { success: false, message: 'Sunucuya bağlanılamadı.' };
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
  };

  return (
    <AuthContext.Provider value={{ 
      isAdmin, 
      user, 
      login, 
      customerLogin, 
      customerRegister, 
      finalizeRegistration,
      updateUser,
      updateAnyUser,
      socialLogin,
      resendRegistrationOtp,
      registeredUsers,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
