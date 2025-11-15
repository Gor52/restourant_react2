import { useEffect, useState } from 'react';
import { 
    getPaymentTypes, 
    createPaymentType, 
    updatePaymentType, 
    deletePaymentType 
} from '../api/paymentTypes';

export default function PaymentTypesList() {
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({ title: '' });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadPaymentTypes = async () => {
        try {
            setLoading(true);
            const data = await getPaymentTypes();
            setPaymentTypes(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке типов оплаты:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPaymentTypes();
    }, []);

    const handleRefresh = () => {
        loadPaymentTypes();
    };

    const resetForm = () => {
        setFormData({ title: '' });
        setEditingId(null);
        setFormError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.title.trim()) {
            setFormError('Название типа оплаты обязательно');
            return;
        }

        try {
            setSubmitting(true);
            if (editingId) {
                await updatePaymentType(editingId, { title: formData.title.trim() });
            } else {
                await createPaymentType({ title: formData.title.trim() });
            }
            setFormError(null);
            resetForm();
            await loadPaymentTypes();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (paymentType) => {
        setEditingId(paymentType.id_payment_type);
        setFormData({ title: paymentType.title });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот тип оплаты?')) {
            return;
        }

        try {
            setSubmitting(true);
            await deletePaymentType(id);
            await loadPaymentTypes();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Загрузка типов оплаты...</div>
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
                <h2>Список типов оплаты ({paymentTypes.length})</h2>
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
                    {editingId ? 'Редактирование типа оплаты' : 'Добавление типа оплаты'}
                </h3>
                {formError && (
                    <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        {formError}
                    </div>
                )}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Название типа оплаты"
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
                {paymentTypes.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Типов оплаты не найдено
                    </div>
                )}
                {paymentTypes.map(paymentType => (
                    <div key={paymentType.id_payment_type} style={{ 
                        border: '1px solid #dee2e6', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>ID:</strong> 
                            <span style={{ marginLeft: '8px', color: '#007bff' }}>{paymentType.id_payment_type}</span>
                        </div>
                        <div>
                            <strong style={{ color: '#495057' }}>Тип оплаты:</strong> 
                            <span style={{ marginLeft: '8px', color: 'black' }}>{paymentType.title}</span>
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleEdit(paymentType)}
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
                                onClick={() => handleDelete(paymentType.id_payment_type)}
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