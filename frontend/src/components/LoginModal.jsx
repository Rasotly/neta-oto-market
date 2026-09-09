import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(username, password);
    if (result.success) {
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>Yönetici Girişi</h2>
          <button className="icon-btn modal-close-btn" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required 
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label>Şifre</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && <div className="form-error global-error" style={{ textAlign: 'center', margin: '0.5rem 0' }}>{error}</div>}

          <div className="modal-footer" style={{ marginTop: '2rem', justifyContent: 'center' }}>
            <button type="submit" className="btn btn-primary w-full">Giriş Yap</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
