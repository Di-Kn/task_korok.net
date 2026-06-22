import { useState } from 'react'

export function LogForm({text, textBtn, loginUser}){
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateLogin = (value) => {
        if (!value.trim()) {
            return 'Введите логин'
        }
        return ''
    }

    const validatePassword = (value) => {
        if (!value.trim()) {
            return 'Введите пароль'
        }
        return ''
    }

    const onChangeLogin = (e) => {
        const value = e.target.value
        setLogin(value)
        const error = validateLogin(value)
        setErrors(prev => ({...prev, login: error}))
    }

    const onChangePassword = (e) => {
        const value = e.target.value
        setPassword(value)
        const error = validatePassword(value)
        setErrors(prev => ({...prev, password: error}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const loginError = validateLogin(login)
        const passwordError = validatePassword(password)

        const newErrors = {
            login: loginError,
            password: passwordError
        }

        setErrors(newErrors)

        const hasErrors = Object.values(newErrors).some(error => error !== '')
        
        if (hasErrors) {
            setIsSubmitting(false)
            return
        }

        const userData = {
            login: login.trim(),
            password: password.trim()
        }

        try {
            await loginUser(userData)
            setLogin('')
            setPassword('')
            setErrors({})
        } catch (error) {
            console.error('Ошибка при входе:', error)
            setErrors({ general: 'Ошибка при входе в систему' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <h2>{text}</h2>

            {errors.general && <div>{errors.general}</div>}

            <div>
                <input
                    type='text'
                    value={login}
                    placeholder='Login'
                    onChange={onChangeLogin}
                    required
                    disabled={isSubmitting}
                />
                {errors.login && <span>{errors.login}</span>}
            </div>

            <div>
                <input
                    type='password'
                    value={password}
                    placeholder='Password'
                    onChange={onChangePassword}
                    required
                    disabled={isSubmitting}
                />
                {errors.password && <span>{errors.password}</span>}
            </div>

            <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Вход...' : textBtn}
            </button>
        </form>
    )
}