import React from 'react';
import { useCart } from '/src/contexts/CartContext';
import { useTheme } from '/src/contexts/ThemeContext';
import '/src/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, getItemPrice } = useCart();
  const { theme } = useTheme();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const finalPrice = getItemPrice(product);
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <div className={`product-card ${theme}`}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {hasDiscount && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.type === 'dish' && product.dishType && (
          <div className="product-type">
            <span className="type-label">Тип:</span>
            <span className="type-value">{product.dishType}</span>
          </div>
        )}
        {product.description && (
          <div className="product-description">
            {product.type === 'dish' ? (
              <div>
                <span className="description-label">Ингредиенты:</span>
                <p className="description-text">{product.description}</p>
              </div>
            ) : (
              <p className="description-text">{product.description}</p>
            )}
          </div>
        )}
        <div className="product-price">
          {hasDiscount ? (
            <div>
              <span style={{ textDecoration: 'line-through', color: '#6c757d', marginRight: '10px' }}>
                {product.price} ₽
              </span>
              <span style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '1.2em' }}>
                {Math.round(finalPrice * 100) / 100} ₽
              </span>
            </div>
          ) : (
            <span>{product.price} ₽</span>
          )}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Добавить в корзину</button>
      </div>
    </div>
  );
};

export default ProductCard;