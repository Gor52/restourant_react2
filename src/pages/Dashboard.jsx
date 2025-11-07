import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '/src/contexts/ThemeContext';
import { useAuth } from '/src/contexts/AuthContext';
import '/src/pages/Dashboard.css';

const Dashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`dashboard-page ${theme}`}>
      <section className="hero-section">
        <h1 className="hero-title">Араратская долина</h1>
        <p className="hero-subtitle">Насладитесь подлинным вкусом армянской кухни</p>
        <div className="user-welcome">
          <p>Добро пожаловать, <strong>{user?.name}</strong>!</p>
        </div>
        <button className="hero-cta" onClick={() => navigate('/menu')}>Посмотреть меню</button>
      </section>

      <section className="features-section">
        <div className={`feature-card ${theme}`}>
          <div className="feature-icon">🍖</div>
          <h3 className="feature-title">Натуральные продукты</h3>
          <p>Используем только свежие и качественные ингредиенты</p>
        </div>
        <div className={`feature-card ${theme}`}>
          <div className="feature-icon">👨‍🍳</div>
          <h3 className="feature-title">Опытные повара</h3>
          <p>Блюда готовят мастера с многолетним опытом</p>
        </div>
        <div className={`feature-card ${theme}`}>
          <div className="feature-icon">🚚</div>
          <h3 className="feature-title">Быстрая доставка</h3>
          <p>Доставляем заказы в кратчайшие сроки</p>
        </div>
      </section>

      <section className={`about-section ${theme}`}>
        <h2 className="about-title">О нашей кухне</h2>
        <p className="about-text">
          Армянская кухня — одна из древнейших в мире, сохранившая свои традиции 
          на протяжении тысячелетий. Мы готовим блюда по старинным рецептам, 
          передаваемым из поколения в поколение, используя только натуральные 
          продукты и традиционные технологии приготовления.
        </p>
        <div className="dashboard-actions">
          <button className="dashboard-btn primary" onClick={() => navigate('/menu')}>Перейти к меню</button>
          <button className="dashboard-btn secondary" onClick={() => navigate('/cart')}>Корзина</button>
          <button className="dashboard-btn danger" onClick={handleLogout}>Выйти</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;