import { useEffect, useState } from 'react';
import { 
    getDrinks, 
    createDrink, 
    updateDrink, 
    deleteDrink 
} from '../api/drinks';

export default function DrinksList() {
    const [drinks, setDrinks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({ title: '', price: '', discount: '', description: '', drink_image: '' });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadDrinks = async () => {
        try {
            setLoading(true);
            const data = await getDrinks();
            setDrinks(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке напитков:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDrinks();
    }, []);

    const handleRefresh = () => {
        loadDrinks();
    };

    const resetForm = () => {
        setFormData({ title: '', price: '', discount: '', description: '', drink_image: '' });
        setEditingId(null);
        setFormError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.title.trim()) {
            setFormError('Название напитка обязательно');
            return;
        }

        if (!formData.price || Number(formData.price) <= 0) {
            setFormError('Цена напитка обязательна и должна быть больше 0');
            return;
        }

        const payload = {
            title: formData.title.trim(),
            price: Number(formData.price),
            discount: formData.discount ? Number(formData.discount) : null,
            description: formData.description.trim() || null,
            drink_image: formData.drink_image.trim() || null
        };

        try {
            setSubmitting(true);
            if (editingId) {
                await updateDrink(editingId, payload);
            } else {
                await createDrink(payload);
            }
            setFormError(null);
            resetForm();
            await loadDrinks();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (drink) => {
        setEditingId(drink.id_drink);
        setFormData({ 
            title: drink.title,
            price: drink.price ? String(drink.price) : '',
            discount: drink.discount ? String(drink.discount) : '',
            description: drink.description || '',
            drink_image: drink.drink_image || ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот напиток?')) {
            return;
        }

        try {
            setSubmitting(true);
            await deleteDrink(id);
            await loadDrinks();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Загрузка напитков...</div>
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
                <h2>Список напитков ({drinks.length})</h2>
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
                    {editingId ? 'Редактирование напитка' : 'Добавление напитка'}
                </h3>
                {formError && (
                    <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        {formError}
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Название напитка"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            type="number"
                            placeholder="Цена (₽)"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            style={{
                                width: '150px',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px'
                            }}
                            min="0"
                            step="0.01"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Скидка (%)"
                            value={formData.discount}
                            onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                            style={{
                                width: '150px',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px'
                            }}
                            min="0"
                            max="100"
                            step="1"
                        />
                    </div>
                    <textarea
                        placeholder="Описание напитка (опционально)"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '10px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            resize: 'vertical'
                        }}
                    />
                    <input
                        type="url"
                        placeholder="Ссылка на изображение напитка (опционально)"
                        value={formData.drink_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, drink_image: e.target.value }))}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    padding: '10px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Отмена
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: editingId ? '#ffc107' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                opacity: submitting ? 0.7 : 1
                            }}
                        >
                            {editingId ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </div>
            </form>
            
            <div style={{ display: 'grid', gap: '15px' }}>
                {drinks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Напитков не найдено
                    </div>
                )}
                {drinks.map(drink => (
                    <div key={drink.id_drink} style={{ 
                        border: '1px solid #dee2e6', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {drink.drink_image && (
                            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                                <img 
                                    src={drink.drink_image} 
                                    alt={drink.title}
                                    style={{
                                        maxWidth: '200px',
                                        maxHeight: '200px',
                                        borderRadius: '8px',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>ID:</strong> 
                            <span style={{ marginLeft: '8px', color: '#007bff' }}>{drink.id_drink}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>Название напитка:</strong> 
                            <span style={{ marginLeft: '8px', color: 'black' }}>{drink.title}</span>
                        </div>
                        {drink.price && (
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#495057' }}>Цена:</strong> 
                                <span style={{ marginLeft: '8px', color: '#28a745', fontWeight: 'bold' }}>
                                    {Number(drink.price).toFixed(2)} ₽
                                </span>
                            </div>
                        )}
                        {drink.description && (
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#495057' }}>Описание:</strong> 
                                <div style={{ marginLeft: '8px', color: 'black', fontStyle: 'italic', marginTop: '4px' }}>
                                    {drink.description}
                                </div>
                            </div>
                        )}
                        {drink.discount && drink.discount > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#495057' }}>Скидка:</strong> 
                                <span style={{ marginLeft: '8px', color: '#dc3545', fontWeight: 'bold' }}>
                                    {drink.discount}%
                                </span>
                            </div>
                        )}
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleEdit(drink)}
                                style={{
                                    padding: '8px 14px',
                                    backgroundColor: '#ffc107',
                                    color: '#212529',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Изменить
                            </button>
                            <button
                                onClick={() => handleDelete(drink.id_drink)}
                                style={{
                                    padding: '8px 14px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
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