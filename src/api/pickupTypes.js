const API_URL = 'http://localhost:3001/api/pickup-types';

export async function getPickupTypes() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при получении типов получения');
    }
    return await response.json();
}

export async function getPickupTypeById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении типа получения');
    }
    return await response.json();
}

export async function createPickupType(pickupTypeData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pickupTypeData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при создании типа получения');
    }
    return await response.json();
}

export async function updatePickupType(id, pickupTypeData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pickupTypeData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении типа получения');
    }
    return await response.json();
}

export async function deletePickupType(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении типа получения');
    }
    return await response.json();
}