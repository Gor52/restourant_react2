import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '/src/contexts/ThemeContext';
import { useAuth } from '/src/contexts/AuthContext';
import { login as loginAPI } from '/src/api/auth';
import '/src/pages/Login.css';

const Login = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLoading(true);
      const userData = await loginAPI(formData.email, formData.password);
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка при входе. Проверьте email и пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="login-container">
        <div className="login-header">
          <h2>Вход в Араратскую долину</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div style={{ 
              color: '#dc2626', 
              backgroundColor: '#fee2e2', 
              padding: '0.75rem', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите ваш пароль"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Нет аккаунта? <Link to="/register" className="register-link">Зарегистрироваться</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;