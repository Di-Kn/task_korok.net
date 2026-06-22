import { useState } from 'react'
import { sendApplication } from '../fetch/sendApplication'

export function ApplicationForm({ currentUser, onLogout }) {
    const [ap_name, setApName] = useState('')
    const [ap_date, setApDate] = useState('')
    const [ap_pay, setApPay] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const applicationData = { 
            ap_name, 
            ap_date, 
            ap_pay,
            user_id: currentUser.id 
        }
        
        const result = await sendApplication(applicationData)
        if (result && result.success) {
            alert('Заявка успешно подана!')
            setApName('')
            setApDate('')
            setApPay('')
        } else {
            alert('Ошибка при подаче заявки')
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Добро пожаловать, {currentUser.full_name}!</h2>
                <button onClick={onLogout}>Выйти</button>
            </div>
            
            <form onSubmit={handleSubmit}>
                <h3>Подача заявки</h3>
                <input 
                    type="text" 
                    placeholder="Название заявки" 
                    value={ap_name}
                    onChange={(e) => setApName(e.target.value)}
                    required 
                />
                <input 
                    type="date" 
                    placeholder="Дата" 
                    value={ap_date}
                    onChange={(e) => setApDate(e.target.value)}
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Сумма оплаты" 
                    value={ap_pay}
                    onChange={(e) => setApPay(e.target.value)}
                    required 
                />
                <button type="submit">Подать заявку</button>
            </form>
        </div>
    )
}