import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connection } from "./connectDB.js"

const app = express()
const PORT = 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ТЕСТОВЫЙ МАРШРУТ
app.get('/test', (req, res) => {
    res.json({ message: 'Сервер работает!' })
})

// ПОЛУЧЕНИЕ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ (для отладки)
app.get('/users', (req, res) => {
    connection.query("SELECT id, login, full_name FROM user", (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: err.message })
        }
        res.json(results)
    })
})

app.post('/regUser', function (req, res) {
    const { login, password, full_name, phone, email } = req.body
    
    console.log('Попытка регистрации:', login)
    
    const checkSql = "SELECT * FROM user WHERE login = ?"
    connection.query(checkSql, [login], function(err, results) {
        if (err) {
            console.error('Ошибка проверки:', err)
            return res.status(500).json({ success: false, error: err.message })
        }
        
        if (results.length > 0) {
            return res.status(400).json({ success: false, error: "Пользователь уже существует" })
        }
        
        const sql = "INSERT INTO user(login, password, full_name, phone, email) VALUES(?, ?, ?, ?, ?)"
        connection.query(sql, [login, password, full_name, phone, email], function(err, result) {
            if (err) {
                console.error('Ошибка добавления:', err)
                return res.status(500).json({ success: false, error: err.message })
            }
            
            console.log('Пользователь добавлен:', login)
            res.json({ success: true, id: result.insertId })
        })
    })
})

app.post('/login', function (req, res) {
    const { login, password } = req.body
    
    console.log('Попытка входа:', login)
    
    const sql = "SELECT * FROM user WHERE login = ? AND password = ?"
    connection.query(sql, [login, password], function(err, results) {
        if (err) {
            console.error('Ошибка входа:', err)
            return res.status(500).json({ success: false, message: err.message })
        }
        
        console.log('Найдено пользователей:', results.length)
        
        if (results.length === 0) {
            return res.json({ success: false, message: "Неверный логин или пароль" })
        }
        
        const user = results[0]
        delete user.password
        
        console.log('Пользователь вошел:', user.login, 'ID:', user.id)
        res.json({ success: true, user: user })
    })
})

app.post('/application', function (req, res) {
    const { user_id, course_name, start_date, payment_method, status } = req.body
    
    console.log('Создание заявки для пользователя ID:', user_id)
    console.log('Данные заявки:', { course_name, start_date, payment_method, status })
    
    if (!user_id || !course_name || !start_date) {
        return res.status(400).json({ success: false, error: "Не все поля заполнены" })
    }
    
    const sql = "INSERT INTO applications(user_id, course_name, start_date, payment_method, status) VALUES(?, ?, ?, ?, ?)"
    connection.query(sql, [user_id, course_name, start_date, payment_method, status || 'Новая'], function(err, result) {
        if (err) {
            console.error('Ошибка создания заявки:', err)
            return res.status(500).json({ success: false, error: err.message })
        }
        
        console.log('Заявка создана, ID:', result.insertId)
        res.json({ success: true, id: result.insertId })
    })
})

app.get('/applications/user/:userId', function (req, res) {
    const userId = parseInt(req.params.userId)
    
    console.log('=== ЗАПРОС ЗАЯВОК ===')
    console.log('userId из параметра:', req.params.userId)
    console.log('userId после parseInt:', userId)
    
    if (!userId || isNaN(userId)) {
        console.log('userId невалидный, возвращаем []')
        return res.json([])
    }
    
    // Сначала проверим, есть ли пользователь
    connection.query("SELECT * FROM user WHERE id = ?", [userId], function(err, userResults) {
        if (err) {
            console.error('Ошибка проверки пользователя:', err)
            return res.json([])
        }
        
        console.log('Найден пользователь:', userResults.length > 0 ? userResults[0].login : 'не найден')
        
        if (userResults.length === 0) {
            console.log('Пользователь не найден, возвращаем []')
            return res.json([])
        }
        
        const sql = "SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC"
        connection.query(sql, [userId], function(err, results) {
            if (err) {
                console.error('Ошибка получения заявок:', err)
                return res.json([])
            }
            
            console.log('Найдено заявок для пользователя', userId, ':', results.length)
            console.log('Заявки:', results)
            res.json(results)
        })
    })
})

app.get('/admin/applications', function (req, res) {
    console.log('Запрос всех заявок (админ)')
    
    const sql = `
        SELECT a.*, u.full_name as user_full_name, u.login as user_login 
        FROM applications a 
        JOIN user u ON a.user_id = u.id 
        ORDER BY a.created_at DESC
    `
    
    connection.query(sql, function(err, results) {
        if (err) {
            console.error('Ошибка:', err)
            return res.json([])
        }
        console.log('Всего заявок:', results.length)
        res.json(results)
    })
})

app.put('/admin/applications/:appId', function (req, res) {
    const appId = req.params.appId
    const { status } = req.body
    
    console.log('Обновление статуса:', appId, '->', status)
    
    const sql = "UPDATE applications SET status = ? WHERE id = ?"
    connection.query(sql, [status, appId], function(err, result) {
        if (err) {
            console.error('Ошибка:', err)
            return res.status(500).json({ success: false, error: err.message })
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Заявка не найдена" })
        }
        
        res.json({ success: true })
    })
})

app.listen(PORT, function() {
    console.log(`✅ Сервер запущен на порту ${PORT}`)
    console.log(`📍 http://localhost:${PORT}`)
    console.log(`🧪 Тест: http://localhost:${PORT}/test`)
    console.log(`👥 Пользователи: http://localhost:${PORT}/users`)
})