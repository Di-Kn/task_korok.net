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
    ])}