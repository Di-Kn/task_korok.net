import { useState } from 'react'
import { RegForm } from './forms/RegForm'
import { LogForm } from './forms/LogForm'
import { ApplicationForm } from './forms/ApplicationForm'
import { regUser } from './fetch/regUser'
import { logUser } from './fetch/logUser'
import './App.css'

function App() {
    const [users, setUsers] = useState([])
    const [showRegForm, setShowRegForm] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)

    const addUser = async (user) => {
        const result = await regUser(user)
        console.log('Результат регистрации:', result)
        
        if (result && result.success === true) {
            setUsers([...users, user])
            alert('Регистрация успешна!')
            setShowRegForm(false)
        }
    }

    const handleLogin = async (userData) => {
        console.log('App.js - handleLogin получил:', userData)
        const result = await logUser(userData)
        console.log('Результат входа:', result)
        
        if (result && result.length > 0) {
            setIsAuthenticated(true)
            setCurrentUser(result[0])
            alert(`Добро пожаловать, ${result[0].full_name}!`)
        } else {
            alert('Неверный логин или пароль!')
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        setCurrentUser(null)
        setShowRegForm(true)
    }

    const toggleForm = () => {
        setShowRegForm(!showRegForm)
    }

    if (isAuthenticated) {
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
                    text="Registration" 
                    textBtn="Send" 
                    addUser={addUser}
                />
            ) : (
                <LogForm 
                    text="Login" 
                    textBtn="Sign In" 
                    loginUser={handleLogin}
                />
            )}
            
            <button onClick={toggleForm}>
                {showRegForm ? 'I have an account' : 'For the first time on the site'}
            </button>
        </div>
    )
}

export default App