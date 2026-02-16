import React from 'react';
import { useNavigate } from 'react-router-dom';

const Debug = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const token = localStorage.getItem('token');

  return (
    <div style={{ minHeight: '100vh', marginTop: '100px', padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1>🔍 Información de tu Usuario</h1>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Usuario en localStorage:</h2>
          {user ? (
            <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace' }}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nombre:</strong> {user.first_name} {user.last_name}</p>
              <p><strong>ROL:</strong> <span style={{ color: user.role === 'admin' ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>{user.role}</span></p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffcccc', padding: '1rem', borderRadius: '4px', color: 'red' }}>
              ❌ No hay usuario en localStorage. Necesitas hacer login primero.
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>Token JWT:</h2>
          {token ? (
            <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              <p>✅ Token presente (primeros 50 caracteres):</p>
              <p>{token.substring(0, 50)}...</p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffcccc', padding: '1rem', borderRadius: '4px', color: 'red' }}>
              ❌ No hay token. Necesitas hacer login.
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          {user && user.role === 'admin' ? (
            <div style={{ backgroundColor: '#ccffcc', padding: '1rem', borderRadius: '4px', color: 'green', fontSize: '1.1rem' }}>
              ✅ ¡SÍ ERES ADMIN! Deberías ver "Panel Admin" en la navbar
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffcccc', padding: '1rem', borderRadius: '4px', color: 'red', fontSize: '1.1rem' }}>
              ❌ No eres admin. Rol actual: {user?.role || 'ninguno'}
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/admin')}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Ir a Admin Panel
          </button>
          <button 
            onClick={() => navigate('/')}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Volver a inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Debug;
