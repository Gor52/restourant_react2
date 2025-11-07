import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '/src/contexts/ThemeContext';
import { useAuth } from '/src/contexts/AuthContext';
import '/src/pages/Login.css';

const Login = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (formData.email && formData.password) {
      login({
        id: 1,
        name: 'Пользователь',
        email: formData.email
      });
      navigate('/');
    } else {
      alert('Пожалуйста, заполните все поля');
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
            />
          </div>
          
          <button type="submit" className="login-btn">Войти</button>
        </form>
        
        <div className="login-footer">
          <p>Нет аккаунта? <span className="register-link">Зарегистрироваться</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;