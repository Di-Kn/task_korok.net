import { useState, useEffect } from 'react'
import { RegForm } from './forms/RegForm'
import { LogForm } from './forms/LogForm'
import { ApplicationForm } from './forms/ApplicationForm'
import { AdminPanel } from './forms/AdminPanel'
import { regUser } from './fetch/regUser'
import { logUser } from './fetch/logUser'
import { getUserApplications } from './fetch/getUserApplications'

function App() {
    const [users, setUsers] = useState([])
    const [showRegForm, setShowRegForm] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [userApplications, setUserApplications] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated && !isAdmin && currentUser && currentUser.id) {
            console.log('Загрузка заявок для пользователя:', currentUser)
            loadUserApplications()
        }
    }, [isAuthenticated, currentUser, isAdmin])

    const loadUserApplications = async () => {
        if (!currentUser || !currentUser.id) {
            console.log('Нет currentUser или id')
            setUserApplications([])
            return
        }
        setLoading(true)
        try {
            console.log('Запрос заявок для userId:', currentUser.id)
            const apps = await getUserApplications(currentUser.id)
            console.log('Получены заявки:', apps)
            setUserApplications(Array.isArray(apps) ? apps : [])
        } catch (error) {
            console.error('Ошибка загрузки заявок:', error)
            setUserApplications([])
        } finally {
            setLoading(false)
        }
    }

    const addUser = async (user) => {
        try {
            const result = await regUser(user)
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
            
            if (result && result.success && result.user) {
                setIsAuthenticated(true)
                setIsAdmin(false)
                setCurrentUser(result.user)
                console.log('Установлен пользователь:', result.user)
                alert(`Добро пожаловать, ${result.user.full_name}!`)
            } else {
                alert(result?.message || 'Неверный логин или пароль!')
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
        setUserApplications([])
        setShowRegForm(true)
    }

    const toggleForm = () => {
        setShowRegForm(!showRegForm)
    }

    const handleApplicationCreated = () => {
        console.log('Заявка создана, обновляем список')
        loadUserApplications()
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
                    applications={userApplications}
                    onApplicationCreated={handleApplicationCreated}
                    loading={loading}
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