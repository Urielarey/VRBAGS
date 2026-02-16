import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  // Verificar sesión al montar el componente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Verificar token con servidor
        const response = await axios.get(`${API_URL}/auth/current`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.status === 'success') {
          setUser(response.data.payload);
          localStorage.setItem('user', JSON.stringify(response.data.payload));
        } else {
          // Token inválido o respuesta inesperada
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        // Error al verificar sesión - limpiar y continuar sin autenticación
        console.error('Error al verificar sesión:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(null); // No mostrar error en verificación inicial
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [API_URL]);

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data && response.data.status === 'success') {
        const { token, user } = response.data.payload;
        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          
          // Asociar tickets pendientes al usuario
          try {
            await axios.put(`${API_URL}/tickets/associate`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (associateError) {
            // No es crítico si falla, solo loguear
            console.log('No se pudieron asociar tickets pendientes:', associateError);
          }
          
          return { success: true, user };
        } else {
          const message = 'Respuesta inválida del servidor';
          setError(message);
          return { success: false, error: message };
        }
      } else {
        const message = response.data?.message || 'Error al iniciar sesión';
        setError(message);
        return { success: false, error: message };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Register
  const register = async (firstName, lastName, email, age, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        age,
        password
      });

      if (response.data && response.data.status === 'success') {
        const { token, user } = response.data.payload;
        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          
          // Asociar tickets pendientes al usuario recién registrado
          try {
            await axios.put(`${API_URL}/tickets/associate`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (associateError) {
            // No es crítico si falla, solo loguear
            console.log('No se pudieron asociar tickets pendientes:', associateError);
          }
          
          return { success: true, user };
        } else {
          const message = 'Respuesta inválida del servidor';
          setError(message);
          return { success: false, error: message };
        }
      } else {
        const message = response.data?.message || 'Error al registrar';
        setError(message);
        return { success: false, error: message };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error al registrar';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        hasRole,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
