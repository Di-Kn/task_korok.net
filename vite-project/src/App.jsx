import { useState } from 'react'
import { RegForm } from './forms/RegForm'
import { LogForm } from './forms/LogForm'
import { ApplicationForm } from './forms/ApplicationForm'
import { AdminPanel } from './forms/AdminPanel'
import { regUser } from './fetch/regUser'
import { logUser } from './fetch/logUser'
import './App.css'

function App() {
    const [users, setUsers] = useState([])
    const [showRegForm, setShowRegForm] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)

    const addUser = async (user) => {
        console.log('App.js - addUser получил:', user)
        try {
            const result = await regUser(user)
            console.log('Результат регистрации:', result)
            
            if (result && result.success) {
                setUsers([...users, user])
                alert('Регистрация успешна! Теперь войдите в систему.')
                setShowRegForm(false)
            } else {
                alert(result?.error || 'Ошибка регистрации. Попробуйте другой логин.')
            }
        } catch (error) {
            console.error('Ошибка:', error)
            alert('Произошла ошибка при регистрации')
        }
    }

    const handleLogin = async (userData) => {
        console.log('App.js - handleLogin получил:', userData)
        try {
            if (userData.login === 'Admin' && userData.password === 'KorokNET') {
                setIsAuthenticated(true)
                setIsAdmin(true)
                setCurrentUser({ 
                    login: 'Admin', 
                    full_name: 'Администратор',
                    id: 0 
                })
                alert('Добро пожаловать в панель администратора!')
                return
            }

            const result = await logUser(userData)
            console.log('Результат входа:', result)
            
            if (result && result.length > 0) {
                setIsAuthenticated(true)
                setIsAdmin(false)
                setCurrentUser(result[0])
                alert(`Добро пожаловать, ${result[0].full_name}!`)
            } else {
                alert('Неверный логин или пароль!')
            }
        } catch (error) {
            console.error('Ошибка:', error)
            alert('Произошла ошибка при входе')
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        setIsAdmin(false)
        setCurrentUser(null)
        setShowRegForm(true)
    }

    const toggleForm = () => {
        setShowRegForm(!showRegForm)
    }

    if (isAuthenticated && isAdmin) {
        return (
            <AdminPanel 
                currentUser={currentUser}
                onLogout={handleLogout}
            />
        )
    }

    if (isAuthenticated && !isAdmin) {
        return (
            <div>
                <ApplicationForm 
                    currentUser={currentUser}
                    onLogout={handleLogout}
                />
            </div>
        )
    }

        return (
        <div>
            {showRegForm ? (
                <RegForm 
                    text="Регистрация" 
                    textBtn="Создать пользователя" 
                    addUser={addUser}
                />
            ) : (
                <LogForm 
                    text="Авторизация" 
                    textBtn="Войти" 
                    loginUser={handleLogin}
                />
            )}
            
            <button onClick={toggleForm}>
                {showRegForm ? 'Уже есть аккаунт? Войти' : 'Еще не зарегистрированы? Регистрация'}
            </button>
        </div>
    )
}

export default App