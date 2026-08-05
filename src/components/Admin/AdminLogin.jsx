import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

const AdminLogin = ({ setIsAdmin, setShowAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      setIsAdmin(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleBack = () => {
    setShowAdmin(false);
  };

  return (
    <section className="section" id="admin-login">
      <div className="panel admin-login-panel" style={{ 
        maxWidth: '420px', 
        margin: '0 auto', 
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        <button 
          onClick={handleBack}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1rem',
            cursor: 'pointer',
            color: '#666',
            marginBottom: '1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.target.style.background = 'rgba(0,0,0,0.05)'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
        >
          ← Back
        </button>
        
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🔐 Admin Login</h2>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Enter your credentials to access the admin panel
        </p>
        
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', fontSize: '0.9rem' }}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                background: '#f8f9fa'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1a1a1a'; e.target.style.background = '#ffffff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#f8f9fa'; }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                background: '#f8f9fa'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1a1a1a'; e.target.style.background = '#ffffff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#f8f9fa'; }}
            />
          </div>
          
          {error && (
            <p style={{ 
              color: '#dc3545', 
              marginBottom: '1rem', 
              textAlign: 'center',
              padding: '0.5rem',
              background: 'rgba(220,53,69,0.1)',
              borderRadius: '8px'
            }}>
              ❌ {error}
            </p>
          )}
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#333'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)'; }}
            onMouseLeave={(e) => { e.target.style.background = '#1a1a1a'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
          >
            🔑 Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;