const API_URL = 'http://localhost:3001/api/user-roles';

export async function getUserRoles() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при получении ролей пользователей');
    }
    return await response.json();
}

export async function getUserRoleById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении роли пользователя');
    }
    return await response.json();
}
