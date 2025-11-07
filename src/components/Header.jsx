import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '/src/contexts/ThemeContext';
import { useCart } from '/src/contexts/CartContext';
import { useAuth } from '/src/contexts/AuthContext';
import '/src/components/Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`app-header ${theme}`}>
      <div className="header-content">
        <div className="logo">
          <h1>Араратская долина</h1>
          <p>Армянская кухня</p>
        </div>
        
        <nav className="main-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Главная</NavLink>
          <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Меню</NavLink>
        </nav>

        <div className="header-controls">
          
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Привет, {user?.name}!</span>
              <button className="logout-btn" onClick={handleLogout}>Выйти</button>
            </div>
          ) : (
            <button className="login-header-btn" onClick={() => navigate('/login')}>Войти</button>
          )}
          
          <button className="cart-btn" onClick={() => navigate('/cart')}>Корзина{getTotalItems() > 0 && <span className="cart-counter">{getTotalItems()}</span>}</button>

          <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'light' ? '☽' : '☀'}</button>
        </div>
      </div>
    </header>
  );
};

export default Header;