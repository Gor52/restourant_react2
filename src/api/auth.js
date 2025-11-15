const API_URL = 'http://localhost:3001/api/auth';

export async function register(userData) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при регистрации');
    }
    
    return await response.json();
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при входе');
    }
    
    return await response.json();
}



