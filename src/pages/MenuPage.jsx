import React, { useState, useEffect } from 'react';
import { useTheme } from '/src/contexts/ThemeContext';
import ProductCard from '/src/components/ProductCard';
import { getDishes } from '/src/api/dishes';
import { getDrinks } from '/src/api/drinks';
import { getDishTypes } from '/src/api/dishTypes';
import '/src/pages/MenuPage.css';

const MenuPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dishes');
  const [dishes, setDishes] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [dishTypes, setDishTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dishesData, drinksData, dishTypesData] = await Promise.all([
          getDishes(),
          getDrinks(),
          getDishTypes()
        ]);
        
        const formattedDishes = dishesData.map(dish => ({
          id: dish.id_dish,
          name: dish.dish_name,
          price: dish.price,
          image: dish.dish_image || 'https://via.placeholder.com/300x200?text=No+Image',
          discount: dish.discount || 0,
          type: 'dish',
          dishType: dish.dish_type_title,
          dishTypeId: dish.dish_type_id,
          description: dish.ingredients
        }));
        
        const formattedDrinks = drinksData
          .filter(drink => drink.title)
          .map(drink => ({
            id: drink.id_drink,
            name: drink.title,
            price: drink.price || 100,
            image: drink.drink_image || drink.image || 'https://via.placeholder.com/300x200?text=Drink',
            discount: drink.discount || 0,
            type: 'drink',
            description: drink.description
          }));
        
        setAllDishes(formattedDishes);
        setDishes(formattedDishes);
        setDrinks(formattedDrinks);
        setDishTypes(dishTypesData);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка при загрузке меню:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setDishes(allDishes);
    } else {
      const filtered = allDishes.filter(dish => 
        selectedTypes.includes(dish.dishTypeId)
      );
      setDishes(filtered);
    }
  }, [selectedTypes, allDishes]);

  const handleTypeToggle = (typeId) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTypes.length === dishTypes.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(dishTypes.map(type => type.id_dish_type));
    }
  };

  const currentProducts = activeTab === 'dishes' ? dishes : drinks;

  return (
    <div className={`menu-page ${theme}`}>
      <h2>Меню</h2>
      
      <div className="menu-tabs">
        <button
          className={`menu-tab ${activeTab === 'dishes' ? 'active' : ''} ${theme}`}
          onClick={() => setActiveTab('dishes')}
        >
          Блюда ({dishes.length})
        </button>
        <button
          className={`menu-tab ${activeTab === 'drinks' ? 'active' : ''} ${theme}`}
          onClick={() => setActiveTab('drinks')}
        >
          Напитки ({drinks.length})
        </button>
      </div>

      <div className="menu-content-wrapper">
        {activeTab === 'dishes' && dishTypes.length > 0 && (
          <aside className={`menu-filter-aside ${theme}`}>
            <h3 className="filter-title">Типы блюд</h3>
            <div className="filter-controls">
              <button 
                className="select-all-btn"
                onClick={handleSelectAll}
              >
                {selectedTypes.length === dishTypes.length ? 'Снять все' : 'Выбрать все'}
              </button>
            </div>
            <div className="filter-checkboxes">
              {dishTypes.map(type => (
                <label key={type.id_dish_type} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.id_dish_type)}
                    onChange={() => handleTypeToggle(type.id_dish_type)}
                    className="filter-checkbox"
                  />
                  <span className="checkbox-text">{type.title}</span>
                </label>
              ))}
            </div>
          </aside>
        )}

        <div className="menu-main-content">
          {loading && (
            <div className="menu-loading">
              <p>Загрузка меню...</p>
            </div>
          )}

          {error && (
            <div className="menu-error">
              <p>Ошибка при загрузке меню: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {currentProducts.length === 0 ? (
                <div className="menu-empty">
                  <p>В этой категории пока нет товаров</p>
                </div>
              ) : (
                <div className="products-grid">
                  {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;