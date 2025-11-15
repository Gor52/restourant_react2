import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '/src/contexts/ThemeContext';
import { useAuth } from '/src/contexts/AuthContext';
import { register } from '/src/api/auth';
import '/src/pages/Login.css';

const Registration = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.last_name || !formData.first_name || !formData.login || 
        !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setLoading(true);
      const userData = await register({
        last_name: formData.last_name.trim(),
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim() || null,
        login: formData.login.trim(),
        email: formData.email.trim(),
        user_password: formData.password
      });
      
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="login-container">
        <div className="login-header">
          <h2>Регистрация</h2>
          <p>Создайте новый аккаунт</p>
        </div>
        
        <form onSubmit={handleRegister} className="login-form">
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
            <label htmlFor="last_name">Фамилия *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Введите фамилию"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="first_name">Имя *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Введите имя"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="middle_name">Отчество</label>
            <input
              type="text"
              id="middle_name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              placeholder="Введите отчество (необязательно)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login">Логин *</label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Введите логин"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
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
            <label htmlFor="password">Пароль *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль (минимум 6 символов)"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Уже есть аккаунт? <Link to="/login" className="register-link">Войти</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Registration;


