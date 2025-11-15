import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users';
import { getUserRoles } from '../api/userRoles';

const initialFormState = {
    last_name: '',
    first_name: '',
    middle_name: '',
    login: '',
    user_password: '',
    email: '',
    role_id: '',
    personal_discount: ''
};

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([
                getUsers(),
                getUserRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке пользователей:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRefresh = () => {
        loadUsers();
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setFormError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            last_name: formData.last_name.trim(),
            first_name: formData.first_name.trim(),
            middle_name: formData.middle_name.trim() || null,
            login: formData.login.trim(),
            user_password: formData.user_password,
            email: formData.email.trim(),
            role_id: Number(formData.role_id),
            personal_discount: formData.personal_discount ? Number(formData.personal_discount) : null
        };

        if (!payload.last_name || !payload.first_name || !payload.login || !payload.user_password || !payload.email || !payload.role_id) {
            setFormError('Заполните все обязательные поля пользователя');
            return;
        }

        try {
            setSubmitting(true);
            if (editingId) {
                await updateUser(editingId, payload);
            } else {
                await createUser(payload);
            }
            setFormError(null);
            resetForm();
            await loadUsers();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.id_user);
        setFormData({
            last_name: user.last_name || '',
            first_name: user.first_name || '',
            middle_name: user.middle_name || '',
            login: user.login || '',
            user_password: user.user_password || '',
            email: user.email || '',
            role_id: String(user.role_id || ''),
            personal_discount: user.personal_discount !== null && user.personal_discount !== undefined ? String(user.personal_discount) : ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этого пользователя?')) {
            return;
        }

        try {
            setSubmitting(true);
            await deleteUser(id);
            await loadUsers();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Загрузка пользователей...</div>
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
                <h2>Список пользователей ({users.length})</h2>
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
                    {editingId ? 'Редактирование пользователя' : 'Добавление пользователя'}
                </h3>
                {formError && (
                    <div style={{ color: '#dc3545', marginBottom: '10px' }}>
                        {formError}
                    </div>
                )}
                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Фамилия"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        placeholder="Имя"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <input
                        type="text"
                        placeholder="Отчество (опционально)"
                        value={formData.middle_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, middle_name: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={formData.login}
                        onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={formData.user_password}
                        onChange={(e) => setFormData(prev => ({ ...prev, user_password: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
                    <select
                        value={formData.role_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, role_id: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    >
                        <option value="">Роль</option>
                        {roles.map(role => (
                            <option key={role.id_role} value={role.id_role}>
                                {role.title}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Персональная скидка (%)"
                        value={formData.personal_discount}
                        onChange={(e) => setFormData(prev => ({ ...prev, personal_discount: e.target.value }))}
                        min="0"
                        max="100"
                        style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
                    />
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
                {users.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Пользователей не найдено
                    </div>
                )}
                {users.map(user => (
                    <div key={user.id_user} style={{ 
                        border: '1px solid #dee2e6', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>ФИО:</strong> 
                            <span style={{ marginLeft: '8px', color: '#007bff' }}>
                                {user.last_name} {user.first_name} {user.middle_name || ''}
                            </span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>Логин:</strong> 
                            <span style={{ marginLeft: '8px', color: 'black' }}>{user.login}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>Email:</strong> 
                            <span style={{ marginLeft: '8px', color: 'black' }}>{user.email}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>Роль:</strong> 
                            <span 
                                style={{ 
                                    marginLeft: '8px', 
                                    padding: '4px 8px', 
                                    borderRadius: '4px', 
                                    backgroundColor: '#e9ecef',
                                    color: '#495057'
                                }}
                            >
                                {user.role_title}
                            </span>
                        </div>
                        {user.personal_discount !== null && user.personal_discount !== undefined && (
                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#495057' }}>Персональная скидка:</strong> 
                                <span style={{ marginLeft: '8px', color: '#28a745', fontWeight: 'bold' }}>
                                    {user.personal_discount}%
                                </span>
                            </div>
                        )}
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleEdit(user)}
                                style={{ padding: '8px 14px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Изменить
                            </button>
                            <button
                                onClick={() => handleDelete(user.id_user)}
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