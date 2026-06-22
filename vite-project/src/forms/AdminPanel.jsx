import { useState, useEffect } from 'react'
import { getAllApplications } from '../fetch/getAllApplications'
import { updateApplicationStatus } from '../fetch/updateApplicationStatus'

export function AdminPanel({ onLogout, currentUser }) {
    const [applications, setApplications] = useState([])
    const [filteredApplications, setFilteredApplications] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        inProgress: 0,
        completed: 0
    })
    const [updatingId, setUpdatingId] = useState(null)

    const statusOptions = ['Новая', 'Идет обучение', 'Обучение завершено']

    const loadApplications = async () => {
        setLoading(true)
        try {
            const data = await getAllApplications()
            setApplications(data)
            updateStats(data)
            applyFilters(data, filter, searchTerm)
        } catch (error) {
            console.error('Ошибка загрузки заявок:', error)
            alert('Ошибка при загрузке заявок')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadApplications()
    }, [])

    useEffect(() => {
        applyFilters(applications, filter, searchTerm)
    }, [filter, searchTerm, applications])

    const updateStats = (apps) => {
        setStats({
            total: apps.length,
            new: apps.filter(app => app.status === 'Новая').length,
            inProgress: apps.filter(app => app.status === 'Идет обучение').length,
            completed: apps.filter(app => app.status === 'Обучение завершено').length
        })
    }

    const applyFilters = (apps, filterType, search) => {
        let filtered = [...apps]

        if (filterType !== 'all') {
            const statusMap = {
                'new': 'Новая',
                'progress': 'Идет обучение',
                'completed': 'Обучение завершено'
            }
            filtered = filtered.filter(app => app.status === statusMap[filterType])
        }

        if (search.trim()) {
            const searchLower = search.toLowerCase().trim()
            filtered = filtered.filter(app => 
                app.course_name.toLowerCase().includes(searchLower) ||
                app.user_full_name.toLowerCase().includes(searchLower) ||
                app.user_login.toLowerCase().includes(searchLower)
            )
        }

        setFilteredApplications(filtered)
    }

    const handleStatusChange = async (appId, newStatus) => {
        setUpdatingId(appId)
        try {
            const result = await updateApplicationStatus(appId, newStatus)
            if (result && result.success) {
                alert(`Статус заявки #${appId} изменен на "${newStatus}"`)
                await loadApplications()
            } else {
                alert(result?.error || 'Ошибка при обновлении статуса')
            }
        } catch (error) {
            console.error('Ошибка:', error)
            alert('Произошла ошибка при обновлении статуса')
        } finally {
            setUpdatingId(null)
        }
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'Новая': return '#ff9800'
            case 'Идет обучение': return '#2196f3'
            case 'Обучение завершено': return '#4caf50'
            default: return '#9e9e9e'
        }
    }

    const getStatusEmoji = (status) => {
        switch(status) {
            case 'Новая': return '🆕'
            case 'Идет обучение': return '📚'
            case 'Обучение завершено': return '✅'
            default: return '📌'
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div>
            <div>
                <div>
                    <h1>Панель администратора</h1>
                    <span>Управление заявками</span>
                </div>
                <div>
                    <span>{currentUser?.full_name || 'Admin'}</span>
                    <button onClick={onLogout}>Выйти</button>
                </div>
            </div>

            <div>
                <div>
                    <div>📊</div>
                    <div>
                        <h3>Всего заявок</h3>
                        <p>{stats.total}</p>
                    </div>
                </div>
                <div>
                    <div>🆕</div>
                    <div>
                        <h3>Новые</h3>
                        <p>{stats.new}</p>
                    </div>
                </div>
                <div>
                    <div>📚</div>
                    <div>
                        <h3>Идет обучение</h3>
                        <p>{stats.inProgress}</p>
                    </div>
                </div>
                <div>
                    <div>✅</div>
                    <div>
                        <h3>Завершено</h3>
                        <p>{stats.completed}</p>
                    </div>
                </div>
            </div>

            <div>
                <div>
                    <label>Статус:</label>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Все заявки</option>
                        <option value="new">Новые</option>
                        <option value="progress">Идет обучение</option>
                        <option value="completed">Завершено</option>
                    </select>
                </div>
                
                <div>
                    <label>Поиск:</label>
                    <input 
                        type="text" 
                        placeholder="Поиск по курсу или пользователю..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <button onClick={loadApplications}>
                    Обновить
                </button>
            </div>

            <div>
                {loading ? (
                    <div>Загрузка заявок...</div>
                ) : filteredApplications.length === 0 ? (
                    <div>
                        <div>📭</div>
                        <p>Заявки не найдены</p>
                        <span>Попробуйте изменить фильтры поиска</span>
                    </div>
                ) : (
                    <table>
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
                            {filteredApplications.map((app) => (
                                <tr key={app.id}>
                                    <td>#{app.id}</td>
                                    <td>
                                        <div>
                                            <span>{app.user_full_name}</span>
                                            <span>@{app.user_login}</span>
                                        </div>
                                    </td>
                                    <td>{app.course_name}</td>
                                    <td>{formatDate(app.start_date)}</td>
                                    <td>
                                        <span>
                                            {app.payment_method === 'Наличный' ? '💵' : '📱'} {app.payment_method}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{backgroundColor: getStatusColor(app.status)}}>
                                            {getStatusEmoji(app.status)} {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                            disabled={updatingId === app.id}
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        {updatingId === app.id && (
                                            <span>⏳</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div>
                <span>
                    Показано: {filteredApplications.length} из {applications.length} заявок
                </span>
                <button onClick={loadApplications}>
                    Обновить данные
                </button>
            </div>
        </div>
    )
}