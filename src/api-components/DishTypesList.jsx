import { useEffect, useState } from 'react';
import { 
    getDishTypes, 
    createDishType, 
    updateDishType, 
    deleteDishType 
} from '../api/dishTypes';

export default function DishTypesList() {
    const [dishTypes, setDishTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({ title: '' });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadDishTypes = async () => {
        try {
            setLoading(true);
            const data = await getDishTypes();
            setDishTypes(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке типов блюд:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDishTypes();
    }, []);

    const handleRefresh = () => {
        loadDishTypes();
    };

    const resetForm = () => {
        setFormData({ title: '' });
        setEditingId(null);
        setFormError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.title.trim()) {
            setFormError('Название типа обязательно');
            return;
        }

        try {
            setSubmitting(true);
            if (editingId) {
                await updateDishType(editingId, { title: formData.title.trim() });
            } else {
                await createDishType({ title: formData.title.trim() });
            }
            setFormError(null);
            resetForm();
            await loadDishTypes();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (dishType) => {
        setEditingId(dishType.id_dish_type);
        setFormData({ title: dishType.title });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот тип блюда?')) {
            return;
        }

        try {
            setSubmitting(true);
            await deleteDishType(id);
            await loadDishTypes();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Загрузка типов блюд...</div>
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
                <h2>Список типов блюд ({dishTypes.length})</h2>
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
                >Обновить</button>
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
                    {editingId ? 'Редактирование типа' : 'Добавление типа'}
                </h3>
                {formError && (
                    <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        {formError}
                    </div>
                )}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Название типа"
                        value={formData.title}
                        onChange={(e) => setFormData({ title: e.target.value })}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px'
                        }}/>
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
                            }}>Отмена</button>
                    )}
                    <button
                        type='submit'
                        disabled={submitting}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: editingId ? '#ffc107' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity: submitting ? 0.7 : 1
                        }}>{editingId ? 'Сохранить' : 'Добавить'}</button>
                </div>
            </form>
            
            <div style={{ display: 'grid', gap: '15px' }}>
                {dishTypes.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Типов блюд не найдено
                    </div>
                )}
                {dishTypes.map(dishType => (
                    <div key={dishType.id_dish_type} style={{ 
                        border: '1px solid #dee2e6', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>ID:</strong> 
                            <span style={{ marginLeft: '8px', color: '#007bff' }}>{dishType.id_dish_type}</span>
                        </div>
                        <div>
                            <strong style={{ color: '#495057' }}>Название типа:</strong> 
                            <span style={{ marginLeft: '8px', color: 'black' }}>{dishType.title}</span>
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleEdit(dishType)}
                                style={{
                                    padding: '8px 14px',
                                    backgroundColor: '#ffc107',
                                    color: '#212529',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                    }}>Изменить</button>
                            <button
                                onClick={() => handleDelete(dishType.id_dish_type)}
                                style={{
                                    padding: '8px 14px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>Удалить</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}