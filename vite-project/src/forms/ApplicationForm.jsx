import { useState } from 'react'

export function ApplicationForm({ currentUser, onLogout }) {
    const [ap_name, setApName] = useState('')
    const [ap_date, setApDate] = useState('')
    const [ap_pay, setApPay] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cash') // 'cash' или 'transfer'
    const [applications, setApplications] = useState([
        {
            id: 1,
            course_name: 'JavaScript для начинающих',
            date: '2024-12-01',
            payment_method: 'Наличный',
            status: 'Новая'
        },
        {
            id: 2,
            course_name: 'Python для анализа данных',
            date: '2024-11-15',
            payment_method: 'Безналичный',
            status: 'Идет обучение'
        }
    ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const applicationData = { 
            ap_name, 
            ap_date, 
            ap_pay,
            payment_method: paymentMethod === 'cash' ? 'Наличный' : 'Безналичный',
            user_id: currentUser.id,
            status: 'Новая'
        }
        
        const newApp = {
            id: applications.length + 1,
            course_name: ap_name,
            date: ap_date,
            payment_method: applicationData.payment_method,
            status: 'Новая'
        }
        
        setApplications([...applications, newApp])
        alert('Заявка успешно подана!')
        
        setApName('')
        setApDate('')
        setApPay('')
        setPaymentMethod('cash')
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'Новая': return '#ff9800'
            case 'Идет обучение': return '#2196f3'
            case 'Обучение завершено': return '#4caf50'
            default: return '#9e9e9e'
        }
    }

    return (
        <div className="application-container">
            <div className="app-header">
                <h2>Добро пожаловать, {currentUser.full_name}!</h2>
                <button onClick={onLogout} className="logout-btn">Выйти</button>
            </div>

            <div className="app-content">
                {}
                <div className="app-form-section">
                    <h3>📝 Подача заявки на обучение</h3>
                    <form onSubmit={handleSubmit} className="app-form">
                        <div className="form-group">
                            <label>Название курса *</label>
                            <input 
                                type="text" 
                                placeholder="Введите название курса" 
                                value={ap_name}
                                onChange={(e) => setApName(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Желаемая дата начала обучения *</label>
                            <input 
                                type="date" 
                                value={ap_date}
                                onChange={(e) => setApDate(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Способ оплаты *</label>
                            <div className="payment-options">
                                <label>
                                    <input 
                                        type="radio" 
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Наличными
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        value="transfer"
                                        checked={paymentMethod === 'transfer'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Перевод по номеру телефона
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">Отправить заявку</button>
                    </form>
                </div>

                {}
                <div className="app-list-section">
                    <h3>📋 Мои заявки</h3>
                    {applications.length === 0 ? (
                        <p className="no-applications">У вас пока нет заявок</p>
                    ) : (
                        <div className="applications-grid">
                            {applications.map((app) => (
                                <div key={app.id} className="app-card">
                                    <h4>{app.course_name}</h4>
                                    <div className="app-details">
                                        <p><strong>Дата начала:</strong> {app.date}</p>
                                        <p><strong>Способ оплаты:</strong> {app.payment_method}</p>
                                        <p>
                                            <strong>Статус:</strong> 
                                            <span 
                                                className="status-badge"
                                                style={{backgroundColor: getStatusColor(app.status)}}
                                            >
                                                {app.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}