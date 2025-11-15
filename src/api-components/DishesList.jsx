import { useEffect, useState } from 'react';
import { getDishes, createDish, updateDish, deleteDish } from '../api/dishes';
import { getDishTypes } from '../api/dishTypes';

const initialFormState = {
    dish_name: '',
    dish_type_id: '',
    ingredients: '',
    price: '',
    dish_image: '',
    discount: ''
};

export default function DishesList() {
    const [dishes, setDishes] = useState([]);
    const [dishTypes, setDishTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const [dishesData, dishTypesData] = await Promise.all([
                getDishes(),
                getDishTypes()
            ]);
            setDishes(dishesData);
            setDishTypes(dishTypesData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке блюд:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRefresh = () => {
        loadData();
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setFormError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            dish_name: formData.dish_name.trim(),
            ingredients: formData.ingredients.trim(),
            dish_type_id: Number(formData.dish_type_id),
            price: Number(formData.price),
            dish_image: formData.dish_image.trim() || null,
            discount: formData.discount ? Number(formData.discount) : null
        };

        if (!payload.dish_name || !payload.ingredients || !payload.dish_type_id || !payload.price) {
            setFormError('Заполните обязательные поля блюда');
            return;
        }

        try {
            setSubmitting(true);
            if (editingId) {
                await updateDish(editingId, payload);
            } else {
                await createDish(payload);
            }
            setFormError(null);
            resetForm();
            await loadData();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (dish) => {
        setEditingId(dish.id_dish);
        setFormData({
            dish_name: dish.dish_name,
            ingredients: dish.ingredients,
            dish_type_id: String(dish.dish_type_id),
            price: String(dish.price),
            dish_image: dish.dish_image || '',
            discount: dish.discount ? String(dish.discount) : ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить это блюдо?')) {
            return;
        }

        try {
            setSubmitting(true);
            await deleteDish(id);
            await loadData();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Загрузка блюд...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red', padding: '20px' }}>
                <div>Ошибка: {error}</div>
                <button 
                    onClick={handleRefresh}
                    style={{ 
                        marginTop: '10px', 
                        padding: '8px 16px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Попробовать снова
                </button>
            </div>
        );
    }
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Меню блюд ({dishes.length})</h2>
                <button 
                    onClick={handleRefresh}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Обновить
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
            >
                <h3 style={{ marginTop: 0 }}>
                    {editingId ? 'Редактирование блюда' : 'Добавление блюда'}
                </h3>
                {formError && (
                    <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        {formError}
                    </div>
                )}
                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Название"
                        value={formData.dish_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, dish_name: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <select
                        value={formData.dish_type_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, dish_type_id: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    >
                        <option value="">Тип блюда</option>
                        {dishTypes.map((type) => (
                            <option key={type.id_dish_type} value={type.id_dish_type}>
                                {type.title}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Цена"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                        min="0"
                        step="0.01"
                    />
                    <input
                        type="number"
                        placeholder="Скидка (%)"
                        value={formData.discount}
                        onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                        min="0"
                        max="100"
                        step="1"
                    />
                    <input
                        type="text"
                        placeholder="URL изображения (опционально)"
                        value={formData.dish_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, dish_image: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                </div>
                <textarea
                    placeholder="Ингредиенты"
                    value={formData.ingredients}
                    onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                    style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{ padding: '10px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Отмена
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{ padding: '10px 20px', backgroundColor: editingId ? '#ffc107' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
                    >
                        {editingId ? 'Сохранить' : 'Добавить'}
                    </button>
                </div>
            </form>
            
            <div style={{ display: 'grid', gap: '15px' }}>
                {dishes.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Блюд не найдено
                    </div>
                )}
                {dishes.map(dish => (
                    <div key={dish.id_dish} style={{ 
                        border: '1px solid #dee2e6', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>Название:</strong> 
                            <span style={{ marginLeft: '8px', color: '#007bff', fontSize: '18px', fontWeight: 'bold' }}>
                                {dish.dish_name}
                            </span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>Тип:</strong> 
                            <span style={{ marginLeft: '8px', color: 'black' }}>{dish.dish_type_title}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>Цена:</strong> 
                            {dish.discount && dish.discount > 0 ? (
                                <div style={{ marginLeft: '8px' }}>
                                    <span style={{ textDecoration: 'line-through', color: '#6c757d', marginRight: '10px' }}>
                                        {dish.price} ₽
                                    </span>
                                    <span style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '18px' }}>
                                        {Math.round(dish.price * (1 - dish.discount / 100) * 100) / 100} ₽
                                    </span>
                                    <span style={{ color: '#dc3545', marginLeft: '8px', fontWeight: 'bold' }}>
                                        (-{dish.discount}%)
                                    </span>
                                </div>
                            ) : (
                                <span style={{ marginLeft: '8px', color: '#28a745', fontWeight: 'bold' }}>
                                    {dish.price} ₽
                                </span>
                            )}
                        </div>
                        {dish.discount && dish.discount > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#495057' }}>Скидка:</strong> 
                                <span style={{ marginLeft: '8px', color: '#dc3545', fontWeight: 'bold' }}>
                                    {dish.discount}%
                                </span>
                            </div>
                        )}
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>Ингредиенты:</strong> 
                            <div style={{ marginLeft: '8px', color: 'black', fontStyle: 'italic' }}>
                                {dish.ingredients}
                            </div>
                        </div>
                        {dish.dish_image && (
                            <div>
                                <strong style={{ color: '#495057' }}>Изображение:</strong> 
                                <span style={{ marginLeft: '8px', color: 'black' }}>{dish.dish_image}</span>
                            </div>
                        )}
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleEdit(dish)}
                                style={{ padding: '8px 14px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Изменить
                            </button>
                            <button
                                onClick={() => handleDelete(dish.id_dish)}
                                style={{ padding: '8px 14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}