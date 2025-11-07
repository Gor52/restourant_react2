import React from 'react';
import { useCart } from '/src/contexts/CartContext';
import { useTheme } from '/src/contexts/ThemeContext';
import '/src/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { theme } = useTheme();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className={`product-card ${theme}`}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price} ₽</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Добавить в корзину</button>
      </div>
    </div>
  );
};

export default ProductCard;