const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function initRoles() {
    try {
        console.log('Инициализация системных ролей...');
        
        const checkResult = await pool.query('SELECT * FROM user_roles WHERE title IN ($1, $2)', ['user', 'admin']);
        
        if (checkResult.rows.length > 0) {
            console.log('Роли уже существуют в базе данных:');
            checkResult.rows.forEach(role => {
                console.log(`  - ${role.title} (id: ${role.id_role})`);
            });
            console.log('Инициализация не требуется.');
            return;
        }
        
        const userResult = await pool.query(
            'INSERT INTO user_roles (title) VALUES ($1) RETURNING *',
            ['user']
        );
        console.log(`Роль 'user' создана с id: ${userResult.rows[0].id_role}`);
        
        const adminResult = await pool.query(
            'INSERT INTO user_roles (title) VALUES ($1) RETURNING *',
            ['admin']
        );
        console.log(`Роль 'admin' создана с id: ${adminResult.rows[0].id_role}`);
        
        console.log('Инициализация ролей завершена успешно!');
    } catch (error) {
        console.error('Ошибка при инициализации ролей:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

initRoles()
    .then(() => {
        console.log('Скрипт завершен.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Критическая ошибка:', error);
        process.exit(1);
    });


