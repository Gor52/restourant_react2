import { useEffect, useState } from 'react';
import { 
    getPickupTypes,
    createPickupType,
    updatePickupType,
    deletePickupType
} from '../api/pickupTypes';

export default function PickupTypesList() {
    const [pickupTypes, setPickupTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({ title: '' });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadPickupTypes = async () => {
        try {
            setLoading(true);
            const data = await getPickupTypes();
            setPickupTypes(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке типов получения:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPickupTypes();
    }, []);

    const handleRefresh = () => {
        loadPickupTypes();
    };

    const resetForm = () => {
        setFormData({ title: '' });
        setEditingId(null);
        setFormError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.title.trim()) {
            setFormError('Название типа получения обязательно');
            return;
        }

        try {
            setSubmitting(true);
            if (editingId) {
                await updatePickupType(editingId, { title: formData.title.trim() });
            } else {
                await createPickupType({ title: formData.title.trim() });
            }
            setFormError(null);
            resetForm();
            await loadPickupTypes();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (pickupType) => {
        setEditingId(pickupType.id_pickup_type);
        setFormData({ title: pickupType.title });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот тип получения?')) {
            return;
        }

        try {
            setSubmitting(true);
            await deletePickupType(id);
            await loadPickupTypes();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Загрузка типов получения...</div>
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
                <h2>Список типов получения ({pickupTypes.length})</h2>
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
                    {editingId ? 'Редактирование типа получения' : 'Добавление типа получения'}
                </h3>
                {formError && (
                    <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        {formError}
                    </div>
                )}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Название типа получения"
                        value={formData.title}
                        onChange={(e) => setFormData({ title: e.target.value })}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px'
                        }}
                    />
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
            </form>

            <div style={{ display: 'grid', gap: '15px' }}>
                {pickupTypes.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Типов получения не найдено
                    </div>
                )}
                {pickupTypes.map(pickupType => (
                    <div key={pickupType.id_pickup_type} style={{ 
                        border: '1px solid #dee2e6', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>ID:</strong> 
                            <span style={{ marginLeft: '8px', color: '#007bff' }}>{pickupType.id_pickup_type}</span>
                        </div>
                        <div>
                            <strong style={{ color: '#495057' }}>Тип получения:</strong> 
                            <span style={{ marginLeft: '8px', color: 'black' }}>{pickupType.title}</span>
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleEdit(pickupType)}
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
                                onClick={() => handleDelete(pickupType.id_pickup_type)}
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