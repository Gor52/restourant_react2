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
import './AdminPanel.css';

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
        <div className="admin-panel">
            <header className="admin-header">
                <h1>Панель управления рестораном</h1>
                <button
                    onClick={() => navigate('/')}
                    className="admin-back-btn"
                >
                    ← На главную
                </button>
            </header>

            <nav className="admin-nav">
                <div className="admin-nav-buttons">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`admin-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="admin-main">
                {tabs.find(tab => tab.key === activeTab)?.component}
            </main>
        </div>
    );
}

export default AdminPanel;