const API_URL = 'http://localhost:3001/api/dish-types';

export async function getDishTypes() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при получении типов блюд');
    }
    return await response.json();
}

export async function getDishTypeById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении типа блюда');
    }
    return await response.json();
}

export async function createDishType(dishTypeData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishTypeData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при создании типа блюда');
    }
    return await response.json();
}

export async function updateDishType(id, dishTypeData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishTypeData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении типа блюда');
    }
    return await response.json();
}

export async function deleteDishType(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении типа блюда');
    }
    return await response.json();
}