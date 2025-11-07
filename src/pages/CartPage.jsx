import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '/src/contexts/CartContext';
import { useTheme } from '/src/contexts/ThemeContext';
import '/src/pages/CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className={`cart-page ${theme}`}>
        <h2>Корзина пуста</h2>
        <button className="back-to-shop-btn" onClick={() => navigate('/')}>
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className={`cart-page ${theme}`}>
      <h2>Корзина</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">{item.price} ₽</p>
            </div>
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button 
                className="remove-btn" 
                onClick={() => removeFromCart(item.id)}
              >
                Удалить
              </button>
            </div>
            <div className="cart-item-total">
              {item.price * item.quantity} ₽
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <strong>Итого: {getTotalPrice()} ₽</strong>
        </div>
        <div className="cart-actions">
          <button className="checkout-btn">
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;