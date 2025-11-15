const API_URL = 'http://localhost:3001/api/orders';

export async function getOrders() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при получении заказов');
    }
    return await response.json();
}

export async function getOrderById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении заказа');
    }
    return await response.json();
}

export async function createOrder(orderData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при создании заказа');
    }
    return await response.json();
}

export async function updateOrder(id, orderData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении заказа');
    }
    return await response.json();
}

export async function deleteOrder(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении заказа');
    }
    return await response.json();
}

export async function getOrderDishes(orderId) {
    const response = await fetch(`${API_URL}/${orderId}/dishes`);
    if (!response.ok) {
        throw new Error('Ошибка при получении блюд заказа');
    }
    return await response.json();
}

export async function addDishToOrder(orderId, dishData) {
    const response = await fetch(`${API_URL}/${orderId}/dishes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при добавлении блюда к заказу');
    }
    return await response.json();
}

export async function removeDishFromOrder(orderId, dishId) {
    const response = await fetch(`${API_URL}/${orderId}/dishes/${dishId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении блюда из заказа');
    }
    return await response.json();
}

export async function getOrderDrinks(orderId) {
    const response = await fetch(`${API_URL}/${orderId}/drinks`);
    if (!response.ok) {
        throw new Error('Ошибка при получении напитков заказа');
    }
    return await response.json();
}

export async function addDrinkToOrder(orderId, drinkData) {
    const response = await fetch(`${API_URL}/${orderId}/drinks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(drinkData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при добавлении напитка к заказу');
    }
    return await response.json();
}

export async function removeDrinkFromOrder(orderId, drinkId) {
    const response = await fetch(`${API_URL}/${orderId}/drinks/${drinkId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении напитка из заказа');
    }
    return await response.json();
}