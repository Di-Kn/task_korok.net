import { useState } from 'react'
import { createApplication } from '../fetch/createApplication'

export function ApplicationForm({ 
    currentUser, 
    onLogout, 
    applications, 
    onApplicationCreated,
    loading 
}) {
    const [ap_name, setApName] = useState('')
    const [ap_date, setApDate] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const applicationData = {
            user_id: currentUser.id,
            user_login: currentUser.login,
            course_name: ap_name,
            start_date: ap_date,
            payment_method: paymentMethod === 'cash' ? 'Наличный' : 'Безналичный',
            status: 'Новая'
        }

        try {
            const result = await createApplication(applicationData)
            if (result && result.success) {
                alert('Заявка успешно подана!')
                setApName('')
                setApDate('')
                setPaymentMethod('cash')
                onApplicationCreated()
            } else {
                alert(result?.error || 'Ошибка при подаче заявки')
            }
        } catch (error) {
            console.error('Ошибка:', error)
            alert('Произошла ошибка при подаче заявки')
        } finally {
            setIsSubmitting(false)
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

    return (
        <div>
            <div>
                <div>
                    <h2>Добро пожаловать, {currentUser.full_name}!</h2>
                    <span>@{currentUser.login}</span>
                </div>
                <button onClick={onLogout}>Выйти</button>
            </div>

            <div>
                <div>
                    <h3>Подача заявки на обучение</h3>
                    <span>Заполните все поля для подачи заявки</span>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Название курса *</label>
                        <input 
                            type="text" 
                            placeholder="Введите название курса"
                            value={ap_name}
                            onChange={(e) => setApName(e.target.value)}
                            required 
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label>Желаемая дата начала обучения *</label>
                        <input 
                            type="date" 
                            value={ap_date}
                            onChange={(e) => setApDate(e.target.value)}
                            required 
                            disabled={isSubmitting}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div>
                        <label>Способ оплаты *</label>
                        <div>
                            <label>
                                <input 
                                    type="radio" 
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <span>Наличными</span>
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="transfer"
                                    checked={paymentMethod === 'transfer'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <span>Перевод по номеру телефона</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    </button>
                </form>
            </div>

            <div>
                <div>
                    <h3>Мои заявки</h3>
                    <span>
                        {applications.length > 0 
                            ? `Всего: ${applications.length} заявок` 
                            : 'У вас пока нет заявок'}
                    </span>
                </div>

                {loading ? (
                    <div>Загрузка заявок...</div>
                ) : applications.length === 0 ? (
                    <div>
                        <div>📭</div>
                        <p>У вас пока нет заявок</p>
                        <span>Создайте свою первую заявку выше!</span>
                    </div>
                ) : (
                    <div>
                        {applications.map((app) => (
                            <div key={app.id}>
                                <div>
                                    <h4>{app.course_name}</h4>
                                    <span style={{backgroundColor: getStatusColor(app.status)}}>
                                        {getStatusEmoji(app.status)} {app.status}
                                    </span>
                                </div>
                                <div>
                                    <div>
                                        <span>Дата начала:</span>
                                        <span>{app.start_date}</span>
                                    </div>
                                    <div>
                                        <span>Способ оплаты:</span>
                                        <span>{app.payment_method}</span>
                                    </div>
                                    <div>
                                        <span>Номер заявки:</span>
                                        <span>#{app.id}</span>
                                    </div>
                                    <div>
                                        <span>Создана:</span>
                                        <span>
                                            {new Date(app.created_at).toLocaleDateString('ru-RU')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}