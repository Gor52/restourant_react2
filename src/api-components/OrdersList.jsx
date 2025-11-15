import { useEffect, useState } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api/orders';
import { getUsers } from '../api/users';
import { getPaymentTypes } from '../api/paymentTypes';
import { getPickupTypes } from '../api/pickupTypes';

const formatDateInputValue = (value) => {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const tzOffset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0, 16);
};

const prepareDateForServer = (value) => {
    if (!value) {
        return new Date().toISOString();
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return new Date().toISOString();
    }
    return date.toISOString();
};

const parseItemsJson = (value, label, idField) => {
    if (!value || !value.trim()) return [];
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            throw new Error(`Поле "${label}" должно быть массивом объектов`);
        }
        return parsed.map((item, index) => {
            const id = Number(item[idField]);
            const quantity = Number(item.quantity) || 1;
            if (!id || quantity <= 0) {
                throw new Error(`Некорректные данные в "${label}" (элемент ${index + 1})`);
            }
            return { [idField]: id, quantity };
        });
    } catch (err) {
        throw new Error(`Некорректный JSON в поле "${label}": ${err.message}`);
    }
};

const createInitialFormState = () => ({
    user_id: '',
    payment_type_id: '',
    pickup_type_id: '',
    order_date: formatDateInputValue(new Date()),
    discount: '',
    total_cost: '',
    comment: '',
    order_status: '',
    dishesJson: '',
    drinksJson: ''
});

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [pickupTypes, setPickupTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState(createInitialFormState());
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const [ordersData, usersData, paymentsData, pickupsData] = await Promise.all([
                getOrders(),
                getUsers(),
                getPaymentTypes(),
                getPickupTypes()
            ]);
            setOrders(ordersData);
            setUsers(usersData);
            setPaymentTypes(paymentsData);
            setPickupTypes(pickupsData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке заказов:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleRefresh = () => {
        loadOrders();
    };

    const resetForm = () => {
        setFormData(createInitialFormState());
        setEditingId(null);
        setFormError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.user_id || !formData.payment_type_id || !formData.pickup_type_id || !formData.order_date || !formData.total_cost) {
            setFormError('Заполните обязательные поля заказа');
            return;
        }

        let dishes = [];
        let drinks = [];

        try {
            dishes = parseItemsJson(formData.dishesJson, 'Блюда', 'dish_id');
            drinks = parseItemsJson(formData.drinksJson, 'Напитки', 'drink_id');
        } catch (err) {
            setFormError(err.message);
            return;
        }

        const payload = {
            user_id: Number(formData.user_id),
            payment_type_id: Number(formData.payment_type_id),
            pickup_type_id: Number(formData.pickup_type_id),
            order_date: prepareDateForServer(formData.order_date),
            discount: formData.discount ? Number(formData.discount) : 0,
            total_cost: Number(formData.total_cost),
            comment: formData.comment.trim() || null,
            order_status: formData.order_status.trim() || null
        };

        if (Number.isNaN(payload.user_id) || Number.isNaN(payload.payment_type_id) || Number.isNaN(payload.pickup_type_id) || Number.isNaN(payload.total_cost)) {
            setFormError('Поля с числовыми значениями заполнены некорректно');
            return;
        }

        if (dishes.length) {
            payload.dishes = dishes;
        }

        if (drinks.length) {
            payload.drinks = drinks;
        }

        try {
            setSubmitting(true);
            if (editingId) {
                await updateOrder(editingId, payload);
            } else {
                await createOrder(payload);
            }
            setFormError(null);
            resetForm();
            await loadOrders();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (order) => {
        setEditingId(order.id_order);
        setFormData({
            user_id: String(order.user_id),
            payment_type_id: String(order.payment_type_id),
            pickup_type_id: String(order.pickup_type_id),
            order_date: formatDateInputValue(order.order_date),
            discount: order.discount !== null && order.discount !== undefined ? String(order.discount) : '',
            total_cost: order.total_cost !== null && order.total_cost !== undefined ? String(order.total_cost) : '',
            comment: order.comment || '',
            order_status: order.order_status || '',
            dishesJson: '',
            drinksJson: ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот заказ?')) {
            return;
        }

        try {
            setSubmitting(true);
            await deleteOrder(id);
            await loadOrders();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Загрузка заказов...</div>
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
                <h2>Список заказов ({orders.length})</h2>
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
                    {editingId ? 'Редактирование заказа' : 'Добавление заказа'}
                </h3>
                {formError && (
                    <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        {formError}
                    </div>
                )}
                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '10px' }}>
                    <select
                        value={formData.user_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    >
                        <option value="">Клиент</option>
                        {users.map(user => (
                            <option key={user.id_user} value={user.id_user}>
                                {user.first_name} {user.last_name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={formData.payment_type_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, payment_type_id: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    >
                        <option value="">Тип оплаты</option>
                        {paymentTypes.map(type => (
                            <option key={type.id_payment_type} value={type.id_payment_type}>
                                {type.title}
                            </option>
                        ))}
                    </select>
                    <select
                        value={formData.pickup_type_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, pickup_type_id: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    >
                        <option value="">Способ получения</option>
                        {pickupTypes.map(type => (
                            <option key={type.id_pickup_type} value={type.id_pickup_type}>
                                {type.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '10px' }}>
                    <input
                        type="datetime-local"
                        value={formData.order_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, order_date: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <input
                        type="number"
                        placeholder="Скидка %"
                        value={formData.discount}
                        onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                        min="0"
                        max="100"
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <input
                        type="number"
                        placeholder="Итоговая стоимость"
                        value={formData.total_cost}
                        onChange={(e) => setFormData(prev => ({ ...prev, total_cost: e.target.value }))}
                        min="0"
                        step="0.01"
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        placeholder="Статус заказа (опционально)"
                        value={formData.order_status}
                        onChange={(e) => setFormData(prev => ({ ...prev, order_status: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <textarea
                        placeholder="Комментарий к заказу (опционально)"
                        value={formData.comment}
                        onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                        style={{ 
                            width: '100%', 
                            minHeight: '80px', 
                            padding: '10px', 
                            border: '1px solid #ced4da', 
                            borderRadius: '4px',
                            resize: 'vertical'
                        }}
                    />
                </div>
                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '10px' }}>
                    <div>
                        <textarea
                            placeholder='Блюда заказа (JSON, пример: [{"dish_id":1,"quantity":2}])'
                            value={formData.dishesJson}
                            onChange={(e) => setFormData(prev => ({ ...prev, dishesJson: e.target.value }))}
                            style={{ width: '100%', minHeight: '90px', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                        />
                        <small style={{ color: '#6c757d' }}>Оставьте пустым, чтобы не изменять состав блюд.</small>
                    </div>
                    <div>
                        <textarea
                            placeholder='Напитки заказа (JSON, пример: [{"drink_id":1,"quantity":1}])'
                            value={formData.drinksJson}
                            onChange={(e) => setFormData(prev => ({ ...prev, drinksJson: e.target.value }))}
                            style={{ width: '100%', minHeight: '90px', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                        />
                        <small style={{ color: '#6c757d' }}>Эти поля учитываются только при создании заказа.</small>
                    </div>
                </div>
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
                {orders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Заказов не найдено
                    </div>
                )}
                {orders.map(order => (
                    <div key={order.id_order} style={{ 
                        border: '1px solid #dee2e6', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <div>
                                <strong style={{ color: '#495057' }}>ID заказа:</strong> 
                                <span style={{ marginLeft: '8px', color: '#007bff' }}>#{order.id_order}</span>
                            </div>
                            <div>
                                <strong style={{ color: '#495057' }}>Дата:</strong> 
                                <span style={{ marginLeft: '8px', color: 'black' }}>{order.order_date}</span>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <div>
                                <strong style={{ color: '#495057' }}>Клиент:</strong> 
                                <span style={{ marginLeft: '8px', color: 'black' }}>{order.user_name}</span>
                            </div>
                            <div>
                                <strong style={{ color: '#495057' }}>Способ оплаты:</strong> 
                                <span style={{ marginLeft: '8px', color: 'black' }}>{order.payment_type_title}</span>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <div>
                                <strong style={{ color: '#495057' }}>Получение:</strong> 
                                <span style={{ marginLeft: '8px', color: 'black' }}>{order.pickup_type_title}</span>
                            </div>
                            <div>
                                <strong style={{ color: '#495057' }}>Скидка:</strong> 
                                <span style={{ marginLeft: '8px', color: order.discount ? '#dc3545' : '#6c757d' }}>
                                    {order.discount || 0}%
                                </span>
                            </div>
                        </div>
                        
                        {order.order_status && (
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ color: '#495057' }}>Статус:</strong> 
                                <span style={{ 
                                    marginLeft: '8px', 
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}>
                                    {order.order_status}
                                </span>
                            </div>
                        )}
                        
                        {order.comment && (
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ color: '#495057' }}>Комментарий:</strong> 
                                <div style={{ 
                                    marginTop: '8px',
                                    padding: '10px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '4px',
                                    color: '#495057',
                                    fontStyle: 'italic',
                                    borderLeft: '3px solid #007bff'
                                }}>
                                    {order.comment}
                                </div>
                            </div>
                        )}
                        
                        <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
                            <strong style={{ color: '#495057' }}>Итоговая стоимость:</strong> 
                            <span style={{ 
                                marginLeft: '8px', 
                                color: '#28a745', 
                                fontSize: '18px', 
                                fontWeight: 'bold' 
                            }}>
                                {order.total_cost} ₽
                            </span>
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleEdit(order)}
                                style={{ padding: '8px 14px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Изменить
                            </button>
                            <button
                                onClick={() => handleDelete(order.id_order)}
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