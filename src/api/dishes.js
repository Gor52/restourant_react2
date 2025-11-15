const API_URL = 'http://localhost:3001/api/dishes';

export async function getDishes() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при получении блюд');
    }
    return await response.json();
}

export async function getDishById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении блюда');
    }
    return await response.json();
}

export async function createDish(dishData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при создании блюда');
    }
    return await response.json();
}

export async function updateDish(id, dishData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении блюда');
    }
    return await response.json();
}

export async function deleteDish(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении блюда');
    }
    return await response.json();
}