import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, error: authError, setError } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [isLogin, setIsLogin] = useState(searchParams.get('tab') !== 'register');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    age: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setSuccess('✅ Bienvenido ' + result.user.first_name);
          setTimeout(() => {
            if (result.user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/catalog');
            }
          }, 800);
        } else {
          setLocalError(result.error || 'Error al iniciar sesión');
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setLocalError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        const result = await register(
          formData.first_name,
          formData.last_name,
          formData.email,
          parseInt(formData.age) || null,
          formData.password
        );

        if (result.success) {
          setSuccess('✅ Registro exitoso, bienvenido ' + result.user.first_name);
          setTimeout(() => {
            navigate('/catalog');
          }, 800);
        } else {
          setLocalError(result.error || 'Error al registrar');
        }
      }
    } catch (err) {
      setLocalError('Error inesperado. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      age: '',
      confirmPassword: ''
    });
    setLocalError('');
    setSuccess('');
    setError(null);
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-box">
          <div className="login-header">
            <h1>VRBAGS</h1>
            <p>{isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}</p>
          </div>

          {(error || authError) && (
            <div className="alert alert-danger">
              {error || authError}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Juan"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido *</label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Pérez"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Edad</label>
                    <input
                      type="number"
                      name="age"
                      placeholder="30"
                      value={formData.age}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Contraseña *</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Confirmar Contraseña *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Cargando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              {' '}
              <button 
                type="button"
                className="toggle-btn"
                onClick={toggleMode}
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
