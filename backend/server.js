const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
    console.log('Подключение к PostgreSQL установлено');
});

pool.on('error', (err) => {
    console.error('Ошибка подключения к PostgreSQL:', err);
});


app.get('/api/test', (req, res) => {
    res.json({ message: 'API работает!', timestamp: new Date() });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        res.json({ 
            message: 'Подключение к БД работает!',
            current_time: result.rows[0].current_time
        });
    } catch (error) {
        console.error('Ошибка теста БД:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/user-roles', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM user_roles ORDER BY id_role');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса user_roles:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/user-roles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM user_roles WHERE id_role = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Роль не найдена' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка запроса user_roles:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/dish-types', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM dish_types ORDER BY id_dish_type');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса dish_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/dish-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM dish_types WHERE id_dish_type = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип блюда не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка запроса dish_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/dish-types', async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Название типа обязательно' });
        }
        
        const result = await pool.query(
            'INSERT INTO dish_types (title) VALUES ($1) RETURNING *',
            [title]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка создания dish_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/dish-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Название типа обязательно' });
        }
        
        const result = await pool.query(
            'UPDATE dish_types SET title = $1 WHERE id_dish_type = $2 RETURNING *',
            [title, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип блюда не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка обновления dish_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/dish-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM dish_types WHERE id_dish_type = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип блюда не найден' });
        }
        
        res.json({ message: 'Тип блюда удален', deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка удаления dish_types:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/drinks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM drinks ORDER BY id_drink');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса drinks:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/drinks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM drinks WHERE id_drink = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Напиток не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка запроса drinks:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/drinks', async (req, res) => {
    try {
        const { title, price, discount, description, drink_image } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Название напитка обязательно' });
        }
        
        if (!price || price <= 0) {
            return res.status(400).json({ error: 'Цена напитка обязательна и должна быть больше 0' });
        }
        
        const result = await pool.query(
            'INSERT INTO drinks (title, price, discount, description, drink_image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, price, discount || null, description || null, drink_image || null]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка создания drinks:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/drinks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, discount, description, drink_image } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Название напитка обязательно' });
        }
        
        if (price !== undefined && price !== null && price <= 0) {
            return res.status(400).json({ error: 'Цена напитка должна быть больше 0' });
        }
        
        const result = await pool.query(
            'UPDATE drinks SET title = $1, price = $2, discount = $3, description = $4, drink_image = $5 WHERE id_drink = $6 RETURNING *',
            [title, price || null, discount || null, description || null, drink_image || null, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Напиток не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка обновления drinks:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/drinks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM drinks WHERE id_drink = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Напиток не найден' });
        }
        
        res.json({ message: 'Напиток удален', deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка удаления drinks:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/payment-types', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_types ORDER BY id_payment_type');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса payment_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/payment-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM payment_types WHERE id_payment_type = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип оплаты не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка запроса payment_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/payment-types', async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Название типа оплаты обязательно' });
        }
        
        const result = await pool.query(
            'INSERT INTO payment_types (title) VALUES ($1) RETURNING *',
            [title]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка создания payment_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/payment-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Название типа оплаты обязательно' });
        }
        
        const result = await pool.query(
            'UPDATE payment_types SET title = $1 WHERE id_payment_type = $2 RETURNING *',
            [title, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип оплаты не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка обновления payment_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/payment-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM payment_types WHERE id_payment_type = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип оплаты не найден' });
        }
        
        res.json({ message: 'Тип оплаты удален', deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка удаления payment_types:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/pickup-types', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pickup_types ORDER BY id_pickup_type');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса pickup_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/pickup-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pickup_types WHERE id_pickup_type = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип получения не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка запроса pickup_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pickup-types', async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Название типа получения обязательно' });
        }
        
        const result = await pool.query(
            'INSERT INTO pickup_types (title) VALUES ($1) RETURNING *',
            [title]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка создания pickup_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/pickup-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Название типа получения обязательно' });
        }
        
        const result = await pool.query(
            'UPDATE pickup_types SET title = $1 WHERE id_pickup_type = $2 RETURNING *',
            [title, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип получения не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка обновления pickup_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/pickup-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM pickup_types WHERE id_pickup_type = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Тип получения не найден' });
        }
        
        res.json({ message: 'Тип получения удален', deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка удаления pickup_types:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { last_name, first_name, middle_name, login, user_password, email } = req.body;
        
        if (!last_name || !first_name || !login || !user_password || !email) {
            return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
        }
        
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR login = $2',
            [email, login]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email или логином уже существует' });
        }
        
        const roleResult = await pool.query(
            'SELECT id_role FROM user_roles WHERE title = $1',
            ['user']
        );
        
        if (roleResult.rows.length === 0) {
            return res.status(500).json({ error: 'Роль "user" не найдена в системе' });
        }
        
        const roleId = roleResult.rows[0].id_role;
        
        const result = await pool.query(
            `INSERT INTO users 
            (last_name, first_name, middle_name, login, user_password, email, role_id, personal_discount) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING id_user, last_name, first_name, middle_name, login, email, role_id, personal_discount`,
            [last_name, first_name, middle_name || null, login, user_password, email, roleId, null]
        );
        
        const userResult = await pool.query(`
            SELECT u.*, ur.title as role_title 
            FROM users u 
            JOIN user_roles ur ON u.role_id = ur.id_role 
            WHERE u.id_user = $1
        `, [result.rows[0].id_user]);
        
        res.status(201).json(userResult.rows[0]);
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }
        
        const result = await pool.query(`
            SELECT u.*, ur.title as role_title 
            FROM users u 
            JOIN user_roles ur ON u.role_id = ur.id_role 
            WHERE u.email = $1 AND u.user_password = $2
        `, [email, password]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        
        const user = result.rows[0];
        delete user.user_password;
        
        res.json(user);
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.*, ur.title as role_title 
            FROM users u 
            JOIN user_roles ur ON u.role_id = ur.id_role 
            ORDER BY u.id_user
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса users:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT u.*, ur.title as role_title 
            FROM users u 
            JOIN user_roles ur ON u.role_id = ur.id_role 
            WHERE u.id_user = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка запроса users:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { last_name, first_name, middle_name, login, user_password, email, role_id, personal_discount } = req.body;
        
        if (!last_name || !first_name || !login || !user_password || !email || !role_id) {
            return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
        }
        
        const result = await pool.query(
            `INSERT INTO users 
            (last_name, first_name, middle_name, login, user_password, email, role_id, personal_discount) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [last_name, first_name, middle_name, login, user_password, email, role_id, personal_discount || null]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка создания users:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { last_name, first_name, middle_name, login, user_password, email, role_id, personal_discount } = req.body;
        
        if (!last_name || !first_name || !login || !user_password || !email || !role_id) {
            return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
        }
        
        const result = await pool.query(
            `UPDATE users SET 
            last_name = $1, first_name = $2, middle_name = $3, login = $4, 
            user_password = $5, email = $6, role_id = $7, personal_discount = $8 
            WHERE id_user = $9 RETURNING *`,
            [last_name, first_name, middle_name, login, user_password, email, role_id, personal_discount || null, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка обновления users:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM users WHERE id_user = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        res.json({ message: 'Пользователь удален', deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка удаления users:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/dishes', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.*, dt.title as dish_type_title 
            FROM dishes d 
            JOIN dish_types dt ON d.dish_type_id = dt.id_dish_type 
            ORDER BY d.id_dish
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса dishes:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/dishes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT d.*, dt.title as dish_type_title 
            FROM dishes d 
            JOIN dish_types dt ON d.dish_type_id = dt.id_dish_type 
            WHERE d.id_dish = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Блюдо не найдено' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка запроса dishes:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/dishes', async (req, res) => {
    try {
        const { dish_name, ingredients, dish_type_id, price, dish_image } = req.body;
        
        if (!dish_name || !ingredients || !dish_type_id || !price) {
            return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
        }
        
        const result = await pool.query(
            `INSERT INTO dishes 
            (dish_name, ingredients, dish_type_id, price, dish_image) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [dish_name, ingredients, dish_type_id, price, dish_image]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка создания dishes:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/dishes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { dish_name, ingredients, dish_type_id, price, dish_image } = req.body;
        
        if (!dish_name || !ingredients || !dish_type_id || !price) {
            return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
        }
        
        const result = await pool.query(
            `UPDATE dishes SET 
            dish_name = $1, ingredients = $2, dish_type_id = $3, price = $4, dish_image = $5 
            WHERE id_dish = $6 RETURNING *`,
            [dish_name, ingredients, dish_type_id, price, dish_image, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Блюдо не найдено' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка обновления dishes:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/dishes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM dishes WHERE id_dish = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Блюдо не найдено' });
        }
        
        res.json({ message: 'Блюдо удалено', deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка удаления dishes:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/simple', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders LIMIT 5');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса orders:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                o.*,
                u.first_name || ' ' || u.last_name as user_name,
                pt.title as payment_type_title,
                pkt.title as pickup_type_title
            FROM orders o
            JOIN users u ON o.user_id = u.id_user
            JOIN payment_types pt ON o.payment_type_id = pt.id_payment_type
            JOIN pickup_types pkt ON o.pickup_type_id = pkt.id_pickup_type
            ORDER BY o.order_date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка запроса orders:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const orderResult = await pool.query(`
            SELECT 
                o.*,
                u.first_name || ' ' || u.last_name as user_name,
                pt.title as payment_type_title,
                pkt.title as pickup_type_title
            FROM orders o
            JOIN users u ON o.user_id = u.id_user
            JOIN payment_types pt ON o.payment_type_id = pt.id_payment_type
            JOIN pickup_types pkt ON o.pickup_type_id = pkt.id_pickup_type
            WHERE o.id_order = $1
        `, [id]);
        
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }
        
        const dishesResult = await pool.query(`
            SELECT od.*, d.dish_name, d.price
            FROM order_dishes od
            JOIN dishes d ON od.dish_id = d.id_dish
            WHERE od.order_id = $1
        `, [id]);
        
        const drinksResult = await pool.query(`
            SELECT odr.*, dr.title as drink_title
            FROM order_drinks odr
            JOIN drinks dr ON odr.drink_id = dr.id_drink
            WHERE odr.order_id = $1
        `, [id]);
        
        const order = orderResult.rows[0];
        order.dishes = dishesResult.rows;
        order.drinks = drinksResult.rows;
        
        res.json(order);
    } catch (error) {
        console.error('Ошибка запроса order:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { user_id, payment_type_id, pickup_type_id, order_date, discount, total_cost, comment, order_status, dishes, drinks } = req.body;
        
        if (!user_id || !payment_type_id || !pickup_type_id || !order_date || !total_cost) {
            return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
        }
        
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const orderResult = await client.query(
                `INSERT INTO orders 
                (user_id, payment_type_id, pickup_type_id, order_date, discount, total_cost, comment, order_status) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [user_id, payment_type_id, pickup_type_id, order_date, discount || null, total_cost, comment || null, order_status || null]
            );
            
            const orderId = orderResult.rows[0].id_order;
            
            if (dishes && dishes.length > 0) {
                for (const dish of dishes) {
                    await client.query(
                        'INSERT INTO order_dishes (order_id, dish_id, quantity) VALUES ($1, $2, $3)',
                        [orderId, dish.dish_id, dish.quantity]
                    );
                }
            }
            
            if (drinks && drinks.length > 0) {
                for (const drink of drinks) {
                    await client.query(
                        'INSERT INTO order_drinks (order_id, drink_id, quantity) VALUES ($1, $2, $3)',
                        [orderId, drink.drink_id, drink.quantity]
                    );
                }
            }
            
            await client.query('COMMIT');
            
            const orderResultFull = await pool.query(`
                SELECT 
                    o.*,
                    u.first_name || ' ' || u.last_name as user_name,
                    pt.title as payment_type_title,
                    pkt.title as pickup_type_title
                FROM orders o
                JOIN users u ON o.user_id = u.id_user
                JOIN payment_types pt ON o.payment_type_id = pt.id_payment_type
                JOIN pickup_types pkt ON o.pickup_type_id = pkt.id_pickup_type
                WHERE o.id_order = $1
            `, [orderId]);
            
            const dishesResult = await pool.query(`
                SELECT od.*, d.dish_name, d.price
                FROM order_dishes od
                JOIN dishes d ON od.dish_id = d.id_dish
                WHERE od.order_id = $1
            `, [orderId]);
            
            const drinksResult = await pool.query(`
                SELECT odr.*, dr.title as drink_title
                FROM order_drinks odr
                JOIN drinks dr ON odr.drink_id = dr.id_drink
                WHERE odr.order_id = $1
            `, [orderId]);
            
            const fullOrder = orderResultFull.rows[0];
            fullOrder.dishes = dishesResult.rows;
            fullOrder.drinks = drinksResult.rows;
            
            res.status(201).json(fullOrder);
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        console.error('Ошибка создания orders:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, payment_type_id, pickup_type_id, order_date, discount, total_cost, comment, order_status } = req.body;
        
        if (!user_id || !payment_type_id || !pickup_type_id || !order_date || !total_cost) {
            return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
        }
        
        const result = await pool.query(
            `UPDATE orders SET 
            user_id = $1, payment_type_id = $2, pickup_type_id = $3, 
            order_date = $4, discount = $5, total_cost = $6, comment = $7, order_status = $8 
            WHERE id_order = $9 RETURNING *`,
            [user_id, payment_type_id, pickup_type_id, order_date, discount || null, total_cost, comment || null, order_status || null, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка обновления orders:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            await client.query('DELETE FROM order_dishes WHERE order_id = $1', [id]);
            await client.query('DELETE FROM order_drinks WHERE order_id = $1', [id]);
            
            const result = await client.query(
                'DELETE FROM orders WHERE id_order = $1 RETURNING *',
                [id]
            );
            
            await client.query('COMMIT');
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Заказ не найден' });
            }
            
            res.json({ message: 'Заказ удален', deleted: result.rows[0] });
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        console.error('Ошибка удаления orders:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/:id/dishes', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(`
            SELECT od.*, d.dish_name, d.price, (d.price * od.quantity) as total_price
            FROM order_dishes od
            JOIN dishes d ON od.dish_id = d.id_dish
            WHERE od.order_id = $1
        `, [id]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка получения блюд заказа:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders/:id/dishes', async (req, res) => {
    try {
        const { id } = req.params;
        const { dish_id, quantity } = req.body;
        
        if (!dish_id || !quantity) {
            return res.status(400).json({ error: 'dish_id и quantity обязательны' });
        }

        const orderCheck = await pool.query('SELECT id_order FROM orders WHERE id_order = $1', [id]);
        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }
        
        const result = await pool.query(
            'INSERT INTO order_dishes (order_id, dish_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [id, dish_id, quantity]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка добавления блюда к заказу:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/orders/:orderId/dishes/:dishId', async (req, res) => {
    try {
        const { orderId, dishId } = req.params;
        
        const result = await pool.query(
            'DELETE FROM order_dishes WHERE order_id = $1 AND dish_id = $2 RETURNING *',
            [orderId, dishId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Блюдо в заказе не найдено' });
        }
        
        res.json({ message: 'Блюдо удалено из заказа', deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка удаления блюда из заказа:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/:id/drinks', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(`
            SELECT odr.*, dr.title as drink_title
            FROM order_drinks odr
            JOIN drinks dr ON odr.drink_id = dr.id_drink
            WHERE odr.order_id = $1
        `, [id]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка получения напитков заказа:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders/:id/drinks', async (req, res) => {
    try {
        const { id } = req.params;
        const { drink_id, quantity } = req.body;
        
        if (!drink_id || !quantity) {
            return res.status(400).json({ error: 'drink_id и quantity обязательны' });
        }

        const orderCheck = await pool.query('SELECT id_order FROM orders WHERE id_order = $1', [id]);
        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }
        
        const result = await pool.query(
            'INSERT INTO order_drinks (order_id, drink_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [id, drink_id, quantity]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка добавления напитка к заказу:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/orders/:orderId/drinks/:drinkId', async (req, res) => {
    try {
        const { orderId, drinkId } = req.params;
        
        const result = await pool.query(
            'DELETE FROM order_drinks WHERE order_id = $1 AND drink_id = $2 RETURNING *',
            [orderId, drinkId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Напиток в заказе не найден' });
        }
        
        res.json({ message: 'Напиток удален из заказа', deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка удаления напитка из заказа:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('\n=== Доступные endpoints ===');
    console.log('1) Тестовые:');
    console.log(`   http://localhost:${PORT}/api/test`);
    console.log(`   http://localhost:${PORT}/api/test-db`);
    
    console.log('\n2) Основные таблицы:');
    console.log(`   http://localhost:${PORT}/api/user-roles`);
    console.log(`   http://localhost:${PORT}/api/dish-types`);
    console.log(`   http://localhost:${PORT}/api/drinks`);
    console.log(`   http://localhost:${PORT}/api/payment-types`);
    console.log(`   http://localhost:${PORT}/api/pickup-types`);
    console.log(`   http://localhost:${PORT}/api/users`);
    console.log(`   http://localhost:${PORT}/api/dishes`);
    console.log(`   http://localhost:${PORT}/api/orders`);
    
    console.log('\n3) Управление заказами:');
    console.log(`   GET    http://localhost:${PORT}/api/orders/:id/dishes     - блюда заказа`);
    console.log(`   POST   http://localhost:${PORT}/api/orders/:id/dishes     - добавить блюдо`);
    console.log(`   DELETE http://localhost:${PORT}/api/orders/:id/dishes/:id - удалить блюдо`);
    console.log(`   GET    http://localhost:${PORT}/api/orders/:id/drinks     - напитки заказа`);
    console.log(`   POST   http://localhost:${PORT}/api/orders/:id/drinks     - добавить напиток`);
    console.log(`   DELETE http://localhost:${PORT}/api/orders/:id/drinks/:id - удалить напиток`);
});