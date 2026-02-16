import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente de debug para verificar el estado de autenticación
 * Muestra información útil para diagnosticar problemas
 */
const AuthDebug = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#222',
      color: '#0f0',
      padding: '15px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      border: '2px solid #0f0',
      zIndex: 9999,
      lineHeight: '1.6'
    }}>
      <div><strong>🔐 AUTH DEBUG</strong></div>
      <hr style={{ margin: '5px 0', borderColor: '#0f0' }} />
      <div>Loading: {loading ? '⏳' : '✓'}</div>
      <div>Authenticated: {isAuthenticated() ? '✓ YES' : '✗ NO'}</div>
      <div>Is Admin: {isAdmin() ? '✓ YES' : '✗ NO'}</div>
      <hr style={{ margin: '5px 0', borderColor: '#0f0' }} />
      {user ? (
        <>
          <div>👤 {user.first_name} {user.last_name}</div>
          <div>📧 {user.email}</div>
          <div>🎯 Role: {user.role}</div>
        </>
      ) : (
        <div>❌ No user data</div>
      )}
      <hr style={{ margin: '5px 0', borderColor: '#0f0' }} />
      <div style={{ fontSize: '10px', color: '#888' }}>
        Token: {localStorage.getItem('token') ? '✓' : '✗'}
      </div>
    </div>
  );
};

export default AuthDebug;
