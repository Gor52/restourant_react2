import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserRolesList from './api-components/UserRolesList';
import DishTypesList from './api-components/DishTypesList';
import DrinksList from './api-components/DrinksList';
import PaymentTypesList from './api-components/PaymentTypesList';
import PickupTypesList from './api-components/PickupTypesList';
import UsersList from './api-components/UsersList';
import DishesList from './api-components/DishesList';
import OrdersList from './api-components/OrdersList';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = React.useState('orders');
    const navigate = useNavigate();

    const tabs = [
        { key: 'orders', label: 'Заказы', component: <OrdersList /> },
        { key: 'dishes', label: 'Блюда', component: <DishesList /> },
        { key: 'users', label: 'Пользователи', component: <UsersList /> },
        { key: 'userRoles', label: 'Роли', component: <UserRolesList /> },
        { key: 'dishTypes', label: 'Типы блюд', component: <DishTypesList /> },
        { key: 'drinks', label: 'Напитки', component: <DrinksList /> },
        { key: 'paymentTypes', label: 'Типы оплаты', component: <PaymentTypesList /> },
        { key: 'pickupTypes', label: 'Типы получения', component: <PickupTypesList /> },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <header style={{ 
                backgroundColor: '#343a40', 
                color: 'white', 
                padding: '20px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ margin: 0 }}>Панель управления рестораном</h1>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                    ← На главную
                </button>
            </header>

            <nav style={{ 
                backgroundColor: 'white', 
                padding: '10px 20px',
                borderBottom: '1px solid #dee2e6',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: activeTab === tab.key ? '#007bff' : '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            <main>
                {tabs.find(tab => tab.key === activeTab)?.component}
            </main>
        </div>
    );
}

export default AdminPanel;