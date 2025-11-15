const API_URL = 'http://localhost:3001/api/payment-types';

export async function getPaymentTypes() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при получении типов оплаты');
    }
    return await response.json();
}

export async function getPaymentTypeById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении типа оплаты');
    }
    return await response.json();
}

export async function createPaymentType(paymentTypeData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentTypeData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при создании типа оплаты');
    }
    return await response.json();
}

export async function updatePaymentType(id, paymentTypeData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentTypeData),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении типа оплаты');
    }
    return await response.json();
}

export async function deletePaymentType(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении типа оплаты');
    }
    return await response.json();
}