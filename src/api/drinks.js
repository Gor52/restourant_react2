const API_URL = 'http://localhost:3001/api/drinks';

export async function getDrinks() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при получении напитков');
    }
    return await response.json();
}

export async function getDrinkById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении напитка');
    }
    return await response.json();
}

export async function createDrink(drinkData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(drinkData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при создании напитка');
    }
    return await response.json();
}

export async function updateDrink(id, drinkData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(drinkData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении напитка');
    }
    return await response.json();
}

export async function deleteDrink(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении напитка');
    }
    return await response.json();
}