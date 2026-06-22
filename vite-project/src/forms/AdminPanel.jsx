import { useState } from 'react'

export function AdminPanel({ onLogout, currentUser }) {
    // Состояния для отображения данных (без реального функционала)
    const [applications, setApplications] = useState([
        {
            id: 1,
            user_name: 'Иванов Иван Иванович',
            course_name: 'JavaScript для начинающих',
            date: '2024-12-01',
            payment_method: 'Безналичный',
            status: 'Новая'
        },
        {
            id: 2,
            user_name: 'Петрова Анна Сергеевна',
            course_name: 'Python для анализа данных',
            date: '2024-12-15',
            payment_method: 'Наличный',
            status: 'Новая'
        },
        {
            id: 3,
            user_name: 'Сидоров Алексей Петрович',
            course_name: 'Java: основы программирования',
            date: '2024-11-20',
            payment_method: 'Безналичный',
            status: 'Идет обучение'
        },
        {
            id: 4,
            user_name: 'Козлова Мария Дмитриевна',
            course_name: 'C++ для начинающих',
            date: '2024-10-15',
            payment_method: 'Наличный',
            status: 'Обучение завершено'
        }
    ])

    // Состояние для выбранного статуса (без реального обновления)
    const [selectedStatus, setSelectedStatus] = useState({})

    // Статусы для выбора (только для отображения)
    const statusOptions = ['Новая', 'Идет обучение', 'Обучение завершено']

    // Обработчик изменения статуса (без реального функционала)
    const handleStatusChange = (appId, newStatus) => {
        // Только для демонстрации - показываем уведомление
        alert(`Заявка #${appId}: статус изменен на "${newStatus}" (демонстрация, без сохранения)`)
        setSelectedStatus(prev => ({...prev, [appId]: newStatus}))
    }

    // Подсчет статистики
    const stats = {
        total: applications.length,
        new: applications.filter(app => app.status === 'Новая').length,
        inProgress: applications.filter(app => app.status === 'Идет обучение').length,
        completed: applications.filter(app => app.status === 'Обучение завершено').length
    }

    // Функция для получения цвета статуса
    const getStatusColor = (status) => {
        switch(status) {
            case 'Новая': return '#ff9800'
            case 'Идет обучение': return '#2196f3'
            case 'Обучение завершено': return '#4caf50'
            default: return '#9e9e9e'
        }
    }

    return (
        <div className="admin-panel">
            {/* Заголовок админ-панели */}
            <div className="admin-header">
                <h1>Панель администратора</h1>
                <div className="admin-user-info">
                    <span>👋 {currentUser?.full_name || 'Admin'}</span>
                    <button onClick={onLogout} className="logout-btn">Выйти</button>
                </div>
            </div>

            {/* Статистика */}
            <div className="stats-container">
                <div className="stat-card">
                    <h3>Всего заявок</h3>
                    <p className="stat-number">{stats.total}</p>
                </div>
                <div className="stat-card" style={{borderColor: '#ff9800'}}>
                    <h3>Новые</h3>
                    <p className="stat-number" style={{color: '#ff9800'}}>{stats.new}</p>
                </div>
                <div className="stat-card" style={{borderColor: '#2196f3'}}>
                    <h3>Идет обучение</h3>
                    <p className="stat-number" style={{color: '#2196f3'}}>{stats.inProgress}</p>
                </div>
                <div className="stat-card" style={{borderColor: '#4caf50'}}>
                    <h3>Завершено</h3>
                    <p className="stat-number" style={{color: '#4caf50'}}>{stats.completed}</p>
                </div>
            </div>

            {/* Фильтры (только для отображения) */}
            <div className="admin-filters">
                <select>
                    <option value="all">Все статусы</option>
                    <option value="new">Новые</option>
                    <option value="progress">Идет обучение</option>
                    <option value="completed">Обучение завершено</option>
                </select>
                <input type="text" placeholder="Поиск по названию курса..." />
                <button className="filter-btn">Применить фильтр</button>
            </div>

            {/* Таблица заявок */}
            <div className="applications-table-container">
                <table className="applications-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Пользователь</th>
                            <th>Курс</th>
                            <th>Дата начала</th>
                            <th>Способ оплаты</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>{app.id}</td>
                                <td>{app.user_name}</td>
                                <td>{app.course_name}</td>
                                <td>{app.date}</td>
                                <td>{app.payment_method}</td>
                                <td>
                                    <span 
                                        className="status-badge"
                                        style={{backgroundColor: getStatusColor(app.status)}}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        value={selectedStatus[app.id] || app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                        className="status-select"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Уведомление о демонстрационном режиме */}
            <div className="demo-notice">
                ⚠️ Демонстрационный режим: изменение статусов не сохраняется в базе данных
            </div>
        </div>
    )
}