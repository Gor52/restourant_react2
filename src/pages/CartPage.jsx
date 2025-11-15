import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '/src/contexts/CartContext';
import { useTheme } from '/src/contexts/ThemeContext';
import { useAuth } from '/src/contexts/AuthContext';
import { createOrder } from '/src/api/orders';
import { getPaymentTypes } from '/src/api/paymentTypes';
import { getPickupTypes } from '/src/api/pickupTypes';
import '/src/pages/CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getItemPrice, clearCart } = useCart();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [pickupTypes, setPickupTypes] = useState([]);
  const [comment, setComment] = useState('');
  const [paymentTypeId, setPaymentTypeId] = useState('');
  const [pickupTypeId, setPickupTypeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const [paymentData, pickupData] = await Promise.all([
          getPaymentTypes(),
          getPickupTypes()
        ]);
        setPaymentTypes(paymentData);
        setPickupTypes(pickupData);
        if (paymentData.length > 0) {
          setPaymentTypeId(paymentData[0].id_payment_type);
        }
        if (pickupData.length > 0) {
          setPickupTypeId(pickupData[0].id_pickup_type);
        }
      } catch (err) {
        console.error('Ошибка при загрузке типов:', err);
        setError('Ошибка при загрузке данных. Пожалуйста, обновите страницу.');
      }
    };
    loadTypes();
  }, []);

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const personalDiscount = user?.personal_discount || 0;
    
    if (personalDiscount > 0) {
      return subtotal * (1 - personalDiscount / 100);
    }
    return subtotal;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Для оформления заказа необходимо войти в систему');
      navigate('/login');
      return;
    }

    if (!paymentTypeId || !pickupTypeId) {
      setError('Пожалуйста, выберите способ оплаты и способ получения');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const dishes = cart
        .filter(item => item.type === 'dish')
        .map(item => ({
          dish_id: item.id,
          quantity: item.quantity
        }));

      const drinks = cart
        .filter(item => item.type === 'drink')
        .map(item => ({
          drink_id: item.id,
          quantity: item.quantity
        }));

      const totalCost = Math.round(getFinalTotal() * 100) / 100;
      const orderDate = new Date().toISOString();
      const personalDiscount = user?.personal_discount || 0;

      const orderData = {
        user_id: user.id_user,
        payment_type_id: Number(paymentTypeId),
        pickup_type_id: Number(pickupTypeId),
        order_date: orderDate,
        discount: personalDiscount,
        total_cost: totalCost,
        comment: comment.trim() || null,
        order_status: 'pending',
        dishes: dishes,
        drinks: drinks
      };

      const createdOrder = await createOrder(orderData);
      setOrderNumber(createdOrder.id_order);
      clearCart();
    } catch (err) {
      console.error('Ошибка при создании заказа:', err);
      setError(err.message || 'Ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <div className={`cart-page ${theme}`}>
        <div className="order-success">
          <h2>Заказ успешно оформлен!</h2>
          <p className="order-number">Номер вашего заказа: <strong>#{orderNumber}</strong></p>
          <p className="order-message">Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время.</p>
          <button className="back-to-shop-btn" onClick={() => {
            setOrderNumber(null);
            navigate('/');
          }}>Вернуться на главную</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={`cart-page ${theme}`}>
        <h2>Корзина пуста</h2>
        <button className="back-to-shop-btn" onClick={() => navigate('/')}>Вернуться на главную</button>
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
              <div className="cart-item-price">
                {item.discount && item.discount > 0 ? (
                  <div>
                    <span style={{ textDecoration: 'line-through', color: '#6c757d', marginRight: '10px', fontSize: '0.9em' }}>
                      {item.price} ₽
                    </span>
                    <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                      {Math.round(getItemPrice(item) * 100) / 100} ₽
                    </span>
                    <span style={{ color: '#dc3545', marginLeft: '8px', fontSize: '0.85em' }}>
                      (-{item.discount}%)
                    </span>
                  </div>
                ) : (
                  <span>{item.price} ₽</span>
                )}
              </div>
            </div>
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span className="quantity-display">{item.quantity}</span>
                <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Удалить</button>
            </div>
            <div className="cart-item-total">
              {Math.round(getItemPrice(item) * item.quantity * 100) / 100} ₽
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          {(() => {
            const subtotal = getTotalPrice();
            const personalDiscount = user?.personal_discount || 0;
            const finalTotal = getFinalTotal();
            const discountAmount = subtotal - finalTotal;
            
            return (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#6c757d' }}>Сумма товаров: </span>
                  <span>{Math.round(subtotal * 100) / 100} ₽</span>
                </div>
                {personalDiscount > 0 && (
                  <div style={{ marginBottom: '8px', color: '#28a745' }}>
                    <span>Персональная скидка ({personalDiscount}%): </span>
                    <span>-{Math.round(discountAmount * 100) / 100} ₽</span>
                  </div>
                )}
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #dee2e6' }}>
                  <span>Итого: </span>
                  <span style={{ color: '#28a745' }}>{Math.round(finalTotal * 100) / 100} ₽</span>
                </div>
              </div>
            );
          })()}
        </div>
        
        <form className="order-form" onSubmit={handleSubmitOrder}>
          <div className="form-group">
            <label htmlFor="payment-type">Способ оплаты:</label>
            <select
              id="payment-type"
              value={paymentTypeId}
              onChange={(e) => setPaymentTypeId(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Выберите способ оплаты</option>
              {paymentTypes.map(type => (
                <option key={type.id_payment_type} value={type.id_payment_type}>
                  {type.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pickup-type">Способ получения:</label>
            <select
              id="pickup-type"
              value={pickupTypeId}
              onChange={(e) => setPickupTypeId(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Выберите способ получения</option>
              {pickupTypes.map(type => (
                <option key={type.id_pickup_type} value={type.id_pickup_type}>
                  {type.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Комментарий к заказу (необязательно):</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Добавьте комментарий к заказу..."
              rows="3"
              className="form-textarea"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="cart-actions">
            <button 
              type="submit" 
              className="checkout-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CartPage;