import { useEffect, useState } from 'react';
import { getUserRoles } from '../api/userRoles';

export default function UserRolesList() {
    const [userRoles, setUserRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserRoles = async () => {
        try {
            setLoading(true);
            const data = await getUserRoles();
            setUserRoles(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка при загрузке ролей пользователей:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserRoles();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>Загрузка ролей пользователей...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red', padding: '20px' }}>
                <div>Ошибка: {error}</div>
                <button 
                    onClick={loadUserRoles}
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
                <h2>Системные роли ({userRoles.length})</h2>
                <button 
                    onClick={loadUserRoles}
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

            <div style={{ 
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <p style={{ color: '#6c757d', margin: 0 }}>
                    Роли являются системными и не могут быть изменены или удалены через интерфейс.
                </p>
            </div>
            
            <div style={{ display: 'grid', gap: '15px' }}>
                {userRoles.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        Ролей пользователей не найдено
                    </div>
                )}
                {userRoles.map(role => (
                    <div key={role.id_role} style={{ 
                        border: '1px solid #dee2e6', 
                        padding: '20px', 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#495057' }}>ID:</strong> 
                            <span style={{ marginLeft: '8px', color: '#007bff' }}>{role.id_role}</span>
                        </div>
                        <div>
                            <strong style={{ color: '#495057' }}>Название роли:</strong> 
                            <span style={{ marginLeft: '8px', color: 'black', fontWeight: 'bold' }}>{role.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}